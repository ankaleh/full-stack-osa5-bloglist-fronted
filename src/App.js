import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [kayttajatunnus, setKayttajatunnus] = useState('')
  const [salasanaHash, setSalasanaHash] = useState('')
  const [user, setUser] = useState(null)
  
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [ message, setMessage] = useState(null)
  const [ errorMessage, setErrorMessage] = useState(null)

  const handleSaveBlog = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.create({
        title, author, url,
      })
      
      setBlogs(blogs.concat(blog))
      setMessage(`Uusi blogi lisättiin: ${author}, ${title}.`)
      setTitle('')
      setAuthor('')
      setUrl('')

    } catch (exception) {
      setErrorMessage('Blogin lisääminen ei onnistunut. Yritä uudelleen.')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      console.log('Virhe!')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('kukkuu')
    try {
      const user = await loginService.login({
        kayttajatunnus, salasanaHash,
      })
      window.localStorage.setItem('kirjautunutKayttaja', JSON.stringify(user))
      //jos kirjautuminen onnistuu:
      setUser(user)
      setMessage(`Kirjautuminen onnistui. Tervetuloa, ${user.nimi}!`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setKayttajatunnus('')
      setSalasanaHash('')
      blogService.setToken(user.token)

    } catch (exception) {
      setErrorMessage('Kirjautuminen ei onnistunut. Tarkista käyttäjätunnus ja salasana.')
      console.log('Virhe!')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('kirjautunutKayttaja')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

if (user === null) {
  console.log('Returnissa!')
  console.log(kayttajatunnus)
  console.log(user)

  return (
    <div>
      <h2>Kirjaudu sisään alla olevalla lomakkeella</h2>
      <Notification message = {message} errorMessage={errorMessage}/>
      <form onSubmit={handleLogin}>
        <div>Käyttäjätunnus</div>
        <input type="text" value={kayttajatunnus} name="Username"
        onChange={({ target }) => setKayttajatunnus(target.value)}
        />
        <div>Salasana</div>
        <input type="text" value={salasanaHash} name="Password"
        onChange={({ target }) => setSalasanaHash(target.value)}
        />
        <button type="submit">Kirjaudu</button>
      </form>
    </div>
  )
}  

 return (
  <div>
    <p>{user.nimi} kirjautuneena palveluun.</p>
    <button onClick={() => window.localStorage.removeItem('kirjautunutKayttaja')}>
      Kirjaudu ulos
    </button>

    <h2>Blogit</h2>
    <Notification message = {message} errorMessage={errorMessage}/>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}

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

export default App