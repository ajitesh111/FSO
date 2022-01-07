import React, { useState } from 'react'
import blogService from '../services/blogs'
// import Togglable from './Togglable'

const Blog = ({ blog, setBlogs, user }) => {
  const [view, setView] = useState('view')

  const compactBlog = () => (
    <div>
      <b>{blog.title}</b> &emsp;
      <button onClick={handleClick}>view</button>
    </div>
  )

  const DetailedBlog = () => (
    <div>
      <b>{blog.title}</b> &emsp;
      <button onClick={handleClick}>hide</button>
      <br/>
      {blog.url}
      <br/>
      likes {blog.likes}
      <button onClick={incrementLike}>like</button>
      <br/>
      <em>{blog.author}</em>
      <br/>
      {removeButtonIfUser()}
    </div>
  )

  const handleClick = () => {
    if(view === 'view')
      setView('hide')
    else
      setView('view')
  }

  const incrementLike = async () => {
    const updatedBlog = {
      ...blog,
      user: user.id,
      likes: blog.likes + 1
    }
    const newBlog = await blogService.update(updatedBlog)
    blog = newBlog

    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  const removeButtonIfUser = () => {
    if(user.username === blog.user.username)
      return (
        <button onClick={deleteBlog}>remove</button>
      )
  }

  const deleteBlog = async () => {
    if(window.confirm(`Do you want to remove blog ${blog.title}`)) {
      await blogService.remove(blog.id)

      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {(view==='view') ? compactBlog() : DetailedBlog()}
    </div>
  )
}

export default Blog