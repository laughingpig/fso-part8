import React, {useState, useEffect} from 'react'
import { useMutation } from '@apollo/client'
import {LOGIN_USER} from '../query'

const Users = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, result] = useMutation(LOGIN_USER, {
    onError: (error) => {
      props.showError(error.message)
    }
  })

  useEffect(() => {
    if(result.data) {
      props.setToken(result.data.login.value)
      localStorage.setItem('token', result.data.login.value)
      props.setPage('authors')
    }
  }, [result.data])

  const processForm = async (event) => {
    event.preventDefault()
    login({variables: {username, password}})
    setUsername('')
    setPassword('')
  }

  if (!props.show) {
    return null
  }

  return (
      <>
      <h3>Login</h3>
      <form onSubmit={processForm}>
        <div>
        username<br />
        <input type="text" value={username} onChange={({target}) => setUsername(target.value)} />
        </div>
        <div>
        password <br />
        <input type="password" value={password} onChange={({target}) => setPassword(target.value)} />     
        </div>
        <button>Submit</button>
      </form>
      </>
    )
}

export default Users