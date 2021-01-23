  
import React, {useState} from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {ALL_AUTHORS, ADD_YEAR} from '../query'

const Authors = (props) => {
  const authors = useQuery(ALL_AUTHORS)
  const [author, setAuthor] = useState('')
  const [born, setBorn] = useState('')

  const [addYear] = useMutation(ADD_YEAR, {
    refetchQueries: [  {query: ALL_AUTHORS} ],
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  }) 

  const handleSubmit = event => {
    event.preventDefault()
    addYear({variables: {author, born}})
    setAuthor('')
    setBorn('')
  }

  if (!props.show) {
    return null
  }

  if(authors.loading) {
    return <>Loading</>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <br />
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <div>
          author<br />
          <select value={author} onChange={({target}) => setAuthor(target.value)}>
            {authors.data.allAuthors.map(auth => 
              <option value={auth.name}>{auth.name}</option>
            )}
          </select>
        </div>    
        <div>
          born<br />
          <input type="text" name="born" value={born} onChange={({target}) => setBorn(parseInt(target.value))} />
        </div>
        <button>Submit</button>
      </form>
    </div>
  )
}

export default Authors
