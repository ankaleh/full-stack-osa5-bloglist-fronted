import React, {useState} from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [showAll, setShowAll] = useState(false)
  

  const showOrNotToShow = (event) => {
    event.preventDefault()
    setShowAll(!showAll)
  }

  const hideWhenVisible = {display: showAll ? 'none' : ''}
  const showWhenVisible = {display: showAll ? '' : 'none'}

  const showToCreator = 
    {display:  
      user.kayttajatunnus===blog.user.kayttajatunnus
      ? '' : 'none'}

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = (event) => {
    event.preventDefault()
    const updatedBlog = {
      user: blog.user,
      author: blog.author,
      likes: blog.likes+1,
      title: blog.title,
      url: blog.url,
    }
    updateBlog(updatedBlog, blog.likes+1, blog.id)
  }

  const handleDelete = (event) => {
    event.preventDefault()
    deleteBlog(blog.id)
  }
  
  return (     
    <div style={blogStyle} >
      <p>{blog.author}: {blog.title}</p>
      <button style={hideWhenVisible} onClick={showOrNotToShow}>Näytä blogin tiedot</button>
      <div style={showWhenVisible}> 
        <p><b>url:</b> {blog.url}</p>
        <p>
          <b>tykkäyksiä:</b> {blog.likes}
          <button onClick={handleLike}>Tykkää</button>
        </p>
        <button style={showToCreator} onClick={handleDelete}>Poista blogi</button>
        <button onClick={showOrNotToShow}>Sulje</button>
      </div>
    </div>
  )
}
export default Blog
