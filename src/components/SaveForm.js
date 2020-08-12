import React, { useState } from 'react'

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

    <form onSubmit={handleSaveBlog}> 

      <div>Title:</div>
      <input type="text" value={title} name="Title"
        onChange={({ target }) => setTitle(target.value)}
      />
      <div>Author:</div>
      <input type="text" value={author} name="Author"
        onChange={({ target }) => setAuthor(target.value)}
      />
      <div>Url:</div>
      <input type="text" value={url} name="Url"
        onChange={({ target }) => setUrl(target.value)}
      />
      <button type="submit">Tallenna</button>

    </form>
  </div>
  )
}
export default SaveForm