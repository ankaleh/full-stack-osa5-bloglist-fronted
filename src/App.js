import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import SaveForm from './components/SaveForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [kayttajatunnus, setKayttajatunnus] = useState('')
  const [salasanaHash, setSalasanaHash] = useState('')
  const [user, setUser] = useState(null)


  const [ message, setMessage] = useState(null)
  const [ errorMessage, setErrorMessage] = useState(null)

  const addBlog = async (newBlog, author, title) => {
    try {
      const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))
      window.location.reload()
      setMessage(`Uusi blogi lisättiin: ${author}, ${title}.`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    }  catch (exception) {
      setErrorMessage('Blogin lisääminen ei onnistunut. Yritä uudelleen.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.log('Virhe!')

    }
  }

  const updateBlog = async (updatedBlog, likes, id) => {
    try {
      console.log(id)
      await blogService.update(id, updatedBlog)
      setMessage(`Blogilla on nyt tykkäyksiä: ${likes}.`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      window.location.reload()

    }  catch (exception) {
      setErrorMessage('Blogin päivittäminen ei onnistunut. Yritä uudelleen.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.log('Virhe!')
    }
  }

  const deleteBlog = async (id) => {
    if (window.confirm('Haluatko varmasti poistaa blogin?')) {


      try {
        console.log(id)
        await blogService.remove(id)
        setMessage('Blogin poistaminen onnistui!')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        window.location.reload()
      }  catch (exception) {
        setErrorMessage('Blogin poistaminen ei onnistunut. Yritä uudelleen.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        console.log('Virhe!')
      }
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

  const sortBlogs = blogs.sort((a, b) => b.likes - a.likes)

  if (user === null) {
    console.log('Returnissa!')

    return (
      <div>

        <Notification message = {message} errorMessage={errorMessage}/>

        <Togglable buttonLabel='Kirjautumislomake'>
          <LoginForm kayttajatunnus={kayttajatunnus} salasanaHash={salasanaHash} setKayttajatunnus ={setKayttajatunnus} setSalasanaHash={setSalasanaHash} handleLogin={handleLogin} />
        </Togglable>

      </div>
    )
  }


  return (
    <div>
      <p>{user.nimi} kirjautuneena palveluun.</p>
      <button onClick={() => {
        window.localStorage.removeItem('kirjautunutKayttaja')
        window.location.reload()}}>
      Kirjaudu ulos
      </button>

      <Notification message = {message} errorMessage={errorMessage}/>

      {sortBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user}/>
      )}

      <Togglable buttonLabel='Lomake, jolla voit tallentaa uuden blogin'>
        <SaveForm addBlog={addBlog} />
      </Togglable>

    </div>
  )
}

export default App