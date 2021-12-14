const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })
  
//bcoz of 'express-async-error' included in 'app', if an exception occurs in a async route, the execution is automatically passed to the error handling middleware thru next(error)

blogsRouter.get('/:id', async (request, response) => {
    const res = await Blog.findById(request.params.id)
    response.status(200).json(res)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
      likes: body.likes
    }

    const res = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(res)
})

module.exports = blogsRouter