import React, { useState } from 'react'
import blogService from '../services/blogs'
// import Togglable from './Togglable'

const Blog = ({ blog, setBlogs, user, incrementLike }) => {
  const [view, setView] = useState('view')

  const compactBlog = () => (
    <div>
      <b>{blog.title}</b> &emsp;
      <button id='view' onClick={handleClick}>view</button>
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
      <button id='like' onClick={likeButton}>like</button>
      <br/>
      <em>{blog.author}</em>
      <br/>
      {showRemoveButtonIfUser()}
    </div>
  )

  const likeButton = () => incrementLike(blog)

  const handleClick = () => {
    if(view === 'view')
      setView('hide')
    else
      setView('view')
  }

  const showRemoveButtonIfUser = () => {
    if(user!==undefined && user.username === blog.user.username)
      return (
        <button id='remove' onClick={deleteBlog}>remove</button>
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
    <div style={blogStyle} className='blog'>
      {(view==='view') ? compactBlog() : DetailedBlog()}
    </div>
  )
}

export default Blog