const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken') //for 'post'
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
// bcoz of 'ref' defined in the schema, 'user' is blogs's attribute
    const blogs = await Blog
        .find({}).populate('user', {username:1, name:1})
    response.json(blogs)
  })
  
//bcoz of 'express-async-error' included in 'app', if an exception occurs in a async route, the execution is automatically passed to the error handling middleware thru next(error)

blogsRouter.get('/:id', async (request, response) => {
    const res = await Blog.findById(request.params.id)
    response.status(200).json(res)
})

//userExtractor is defined in middleware
blogsRouter.post('/', userExtractor, async (request, response) => {
    const blog = new Blog(request.body)
//request.user is defined in userExtractor in middleware
    const user = request.user
    blog.user = user._id

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    
//request.user is defined in userExtractor in middleware
    const user = request.user
    if(blog.user.toString() !== user._id.toString()){
        return response.status(401).json({error: 'You CANNOT delete this blog, as you are not it\'s owner'})
    }
    
    
    //finds and delete the blog from 'blogs' array from User schema
    const index = user.blogs.indexOf(request.params.id)
    if(index > -1)
        user.blogs.splice(index, 1)
    await user.save()
    
    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
      likes: body.likes
    }
//{new: true} bcz of this will return blog after modifying instead of initial version of it
    const res = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(res)
})

module.exports = blogsRouter