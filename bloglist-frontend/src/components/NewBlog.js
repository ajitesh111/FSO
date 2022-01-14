import React, { useState } from 'react'

const NewBlog = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newAuthor, setNewAuthor] = useState('')

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

    createBlog(BloglistObject)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <form onSubmit={addBlogItem}>
        <h2>Create a new bloglist entry</h2>
        <div>
                    Title: &emsp;
          <input id='title' value={newTitle} onChange={handleTitleChange}/>
        </div>
        <div>
                    author: &ensp;
          <input id='author' value={newAuthor} onChange={handleAuthorChange}/>
        </div>
        <div>
                    Url: &emsp;
          <input id='url' value={newUrl} onChange={handleUrlChange} />
        </div>
        <br/>
        <button id='save' type='submit'>save</button>
      </form>
    </div>
  )
}

export default NewBlog