import { useQuery } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import {ALL_BOOKS} from '../query'

const Books = (props) => {
  const books = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState('all')
  const [filteredBooks, setFilteredBooks] = useState([])
  let bookGenres = []

  useEffect(() => {
      if (filter !== 'all') {
        setFilteredBooks(books.data.allBooks.filter(book => book.genres.includes(filter)))
      }
      else {
        if (books.data !== undefined) {
          setFilteredBooks(books.data.allBooks)
        }
      }
  },[filter])

  if (!props.show) {
    return null
  }

  if(books.loading){
    return <>Loading</>
  }

  if(books.error){
    props.showError(books.error)
    return null
  }

  books.data.allBooks.map(book => {
    if (book.genres) {
      bookGenres = [...bookGenres, ...book.genres]
    }
  })
  const uniqueGenres = bookGenres.filter((book, index) => bookGenres.indexOf(book) === index)
  if (!filteredBooks.length) {
    setFilteredBooks(books.data.allBooks)
  }
  return (
    <div>
      <h2>books</h2>
      <h3>
        {filter === 'all' ? null : <>in genre: {filter}</>}
      </h3>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>

      {uniqueGenres.map(genre => <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>)}
      <button onClick={() => setFilter('all')}>all</button>
    </div>
  )
}

export default Books