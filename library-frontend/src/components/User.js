import React, {useState} from 'react'
import { useMutation } from '@apollo/client'
import {ADD_USER} from '../query'

const Users = (props) => {
  const [username, setUsername] = useState('')
  const [favorite, setFavorite] = useState('')
  const [addUser] = useMutation(ADD_USER, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }  
  })

  const processForm = (event) => {
    event.preventDefault()
    addUser({variables: {username, favorite}})
    setUsername('')
    setFavorite('')
  }

  return (
    <>
    <h3>Add user</h3>
    <form onSubmit={processForm}>
      <div>
      username<br />
      <input value={username} onChange={({target}) => setUsername(target.value)} />
      </div>
      <div>
      favorite genre <br />
      <input value={favorite} onChange={({target}) => setFavorite(target.value)} />     
      </div>
      <button>Submit</button>
      <br /><br />
    </form>
    </>
  )
}

export default Users