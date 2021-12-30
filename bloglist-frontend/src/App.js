import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newAuthor, setNewAuthor] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
  <div>
    <h2>login to the application</h2>
    <form onSubmit={handleLogin}>
        <div>
{/* '&emsp;' puts a tab space */}
          username &emsp;
          <input type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)}/>
        </div>
        <div>
          password &emsp;
          <input type='password' value={password} name='password' onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <button type='submit'>login</button>
    </form>
  </div>
  )

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setSuccessMessage(`Welcome ${user.username}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loggedIn  = () => (
    <div>
      <h2>hello {user.name}</h2>

      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}

      {blogForm()}
      
      <br/>
      <button onClick={handleLogout}>logout</button>
    </div>
  )

  const blogForm = () => (
    <form onSubmit={addBlogItem}>
      <h2>Create a new bloglist entry</h2>
      <div>
        Title: &emsp;
        <input value={newTitle} onChange={handleTitleChange}/>
      </div>
      <div>
        author: &ensp;
        <input value={newAuthor} onChange={handleAuthorChange}/>
      </div>
      <div>
        Url: &emsp;
        <input value={newUrl} onChange={handleUrlChange} />
      </div>
      <br/>
      <button type='submit'>save</button>
    </form>
  )

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }
  
  const addBlogItem = async(event) => {
    event.preventDefault()

    const BloglistObject = {
      author: newAuthor,
      title: newTitle,
      url: newUrl,
    }

    try {
      const blog = await blogService.create(BloglistObject)

      setBlogs(blogs.concat(blog)) //creates an appended copy

      setSuccessMessage(`Added bloglist item ${blog.title}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception){
      setErrorMessage(exception.response.data)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    try {
      window.localStorage.clear()
      blogService.setToken(null)
      setUser(null)

      setSuccessMessage('Successfully logged out')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(exception.repsonse.data)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const Notification = (props) => {
    if(props.errorMessage){
      return(
        <div className='error'>
          {props.errorMessage}
        </div>
      )} else if(props.successMessage){
      return(
        <div className='success'>
          {props.successMessage}
        </div>
      )} else {
        return null
      }
  }

  return (
    <div>
      <Notification errorMessage={errorMessage} successMessage={successMessage} />
      
      {(user === null) ? loginForm() : loggedIn()}

    </div>
  )
}

export default App