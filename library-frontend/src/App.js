
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import Login from './components/Login'
import { useApolloClient } from '@apollo/client';

const App = () => {
  const [page, setPage] = useState('authors')
  const [error, setError] = useState('')
  const tokenExist = localStorage.getItem('token') ? localStorage.getItem('token') : null
  const [token, setToken] = useState(tokenExist)
  const client = useApolloClient()

  const showError = (errorValue) => {
    setError(errorValue)
    setTimeout(() => {setError('')}, 10000)
  }

  const logOut = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div style={{'color': 'red', 'fontWeight': 'bold'}}>
        {error}
      </div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? <button onClick={() => setPage('add')}>add book</button> : null}
        {token ? <button onClick={() => setPage('recommend')}>recommend</button> : null}
        {token ? <button onClick={logOut}>logout</button> :  <button onClick={() => setPage('login')}>login</button> }
      </div>

      <Authors
        show={page === 'authors'}
        token={token}
        showError={showError}
      />

      <Books
        show={page === 'books'}
        showError={showError}        
      />

      <NewBook
        show={page === 'add'}
        showError={showError}        
      />

      <Recommend
        show={page === 'recommend'}
        showError={showError}        
      />      

      <Login
        show={page === 'login'}
        setToken={setToken}
        showError={showError} 
        setPage={setPage}       
      />
    </div>
  )
}

export default App