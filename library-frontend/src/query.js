import {gql} from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors{
      name
      born
      bookCount
      id
    }
  }
`
export const ALL_BOOKS = gql`
  query allBooks($author: String, $genre: String) {
    allBooks (
      author: $author
      genre: $genre
    ){
      title
      author {
        name
      }
      published
      genres
    }
  }
`
export const ADD_BOOK = gql`
  mutation addNewBook($title: String!, $author: String!, $published: Int!, $genres:[String]) {
    addBook (
      title: $title
      author: {
        name: $author
      }
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const ADD_YEAR = gql`
  mutation addYear($id: String!, $born: Int!) {
    editAuthor(
      id: $id
      setBornTo: $born
    ) {
      name
      born
    }
  }
`

export const ADD_USER = gql`
  mutation addUser($username: String!, $favorite: String!) {
    createUser(
      username: $username
      favoriteGenre: $favorite
    ) {
      username
      favoriteGenre
    }
  }
`

export const LOGIN_USER = gql`
  mutation loginUser($username: String!, $password: String!) {
    login(
      username: $username
      password: $password
    ) {
      value
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

