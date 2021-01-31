import { useQuery, useLazyQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import {ALL_BOOKS, ME} from '../query'

const Books = (props) => {
  const author = useQuery(ME)
  const favs = author?.data?.me?.favoriteGenre
  const [loadBooks, books] = useLazyQuery(ALL_BOOKS, {
    variables: {genre: favs},
    fetchPolicy: "network-only"
  })

  useEffect(() => {
    loadBooks()
  },[favs])

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

  return (
    <div>
      <h2>books in your favourite genre: {favs}</h2>
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
          {books.data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books