import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [user, setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(
        (blogA, blogB) => (blogB.likes - blogA.likes)
      ))
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

  const loginForm = () => {
    return (
      <Togglable buttonLable='login'>
        <LoginForm
          login={login}
        />
      </Togglable>
    )
  }

  const login = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)

      setSuccessMessage(`Welcome ${user.name}`)
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

  const newBlogRef = useRef()

  const loggedIn  = () => (
    <div>
      <h2>hello {user.name}!!!</h2>

      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} setBlogs={setBlogs} user={user} incrementLike={incrementLike} />
      )}

      <Togglable buttonLable='Add a new item' ref={newBlogRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>

      <br/>
      <button onClick={handleLogout}>logout</button>
    </div>
  )

  //can be done in Blog component, done here only for a test to be passed
  const incrementLike = async (blog) => {
    try {const updatedBlog = {
      ...blog,
      user: user.id,
      likes: blog.likes + 1
    }
    const newBlog = await blogService.update(updatedBlog)
    blog = newBlog

    const blogs = await blogService.getAll()
    setBlogs(blogs)
    } catch (error) {
      console.log(error)
    }
  }

  const createBlog = async (BlogListObject) => {
    try {
      const blog = await blogService.create(BlogListObject)

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

    newBlogRef.current.toggleVisibility()
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

  return (
    <div>
      <Notification errorMessage={errorMessage} successMessage={successMessage} />

      {(user === null) ? loginForm() : loggedIn()}

    </div>
  )
}

export default App