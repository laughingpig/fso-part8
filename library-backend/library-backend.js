require('dotenv').config()
const { ApolloServer, ValidationError, AuthenticationError, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const MONGODB_URI = process.env.MONGO_URI
console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
*/

const typeDefs = gql`
  type Book {
    title: String!
    author: Author!
    published: Int
    id: ID
    genres: [String!]
  }

  type Author {
    name: String!
    id: ID
    born: Int
    bookCount: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }  

  input AuthorInput {
    name: String!
    born: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author]
    me: User
  }

  type Mutation {
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token,  
    addBook (
      title: String!
      author: AuthorInput!
      published: Int
      genres: [String]
    ): Book,
    editAuthor (
      id: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: ()=> authors.length,
    allBooks: async (root, args) =>  {
      if (!args.author && !args.genre) {
        const books = await Book.find({}).populate('author')
        return books
      }
      if(args.author && args.genre){
        const books = await Book.find({genre: args.genre, author: args.author}).populate('author')
        return books
      }      
      if(args.author) {
        const books = await Book.find({author: args.author}).populate('author')
        return books
      }
      if(args.genre){
        const books = await Book.find({genres: args.genre}).populate('author')
        return books
      }
    },
    allAuthors: async (root,args) => {
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({author: {$in: root.id}})
      return books.length
    }
  },
  Mutation: {
    createUser: async (root, args) => {
      try {
        const newUser = new User({...args})
        return newUser.save()
      }
      catch {
        throw new ValidationError(error.message, {
          invalidArgs: args,
        })        
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({username: args.username})
      if (!user || args.password !== 'pass') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }  
    },
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }      
      const exists = await Author.findOne({name: args.author.name})
      try {
        if (!exists) {
          const newAuth = new Author({...args.author})
          const authDet = await newAuth.save()
        }
        const newBook = new Book({...args, author: exists ? exists : authDet})
        await newBook.save()
        return newBook            
      }
      catch (error) {
        throw new ValidationError(error.message, {
          invalidArgs: args,
        })  
      }      
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }      
            
      const auth = await Author.find({id: args.id})
      const newAuth = await Author.findByIdAndUpdate(args.id, {...auth, born: parseInt(args.setBornTo)})
      return newAuth
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
