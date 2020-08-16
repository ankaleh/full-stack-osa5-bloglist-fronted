import React, { useState } from 'react'
import PropTypes from 'prop-types'

const SaveForm = ({ addBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSaveBlog = async (event) => {
    event.preventDefault()
    const blog = {
      title, author, url,
    }
    addBlog(blog, author, title)
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <h2>Tallenna uusi blogi</h2>

      <form id='lomake' onSubmit={handleSaveBlog}>

        <div>Title:</div>
        <input id='title' type="text" value={title} name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
        <div>Author:</div>
        <input id='author' type="text" value={author} name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <div>Url:</div>
        <input id='uri' type="text" value={url} name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
        <button id='tallenna' type="submit">Tallenna</button>

      </form>
    </div>
  )
}

SaveForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default SaveForm