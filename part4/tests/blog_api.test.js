const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')   //backend handler
const helper = require('./test_helper')

const api = supertest(app)  //wrapper for the backend handler

const Blog = require('../models/blog')

//"Jest did not exit one second after the test run has completed" -warning- was resolved by adding beforeAll/beforeSync
beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.intitialBlogs.map(blog => new Blog(blog))   //assigned to an array of Mongoose objects
    const promiseArray = blogObjects.map(blog => blog.save())   //array of promises for saving each item in DB
    await Promise.all(promiseArray) //will be fulfilled once every promise in the array passed is fulfilled
})

describe('testing get', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const res = await api.get('/api/blogs')

        expect(res.body).toHaveLength(helper.intitialBlogs.length)
    })

    test('unique identifier is \'id\'', async () => {
        const res = await api.get('/api/blogs')
// console.log(res.body)
        expect(res.body[0].id).toBeDefined()
    })
})

describe('testing post', () => {
    test('a valid post', async () => {
        const newBlogList = {
            title: 'Testing POST',
            author: 'jest',
            url: '/api/blogs',
            likes: -1
        }
    
        await api
            .post('/api/blogs')
            .send(newBlogList)
            .expect(201)
            .expect('Content-type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.intitialBlogs.length + 1)
    
        const titles = response.body.map(blog => blog.title)
        expect(titles).toContain(newBlogList.title)
    })

    test('an invalid post', async () => {
        const newBlogList = {
            author: 'wrong',
            url: '/api/'
        }

        await api
            .post('/api/blogs')
            .send(newBlogList)
            .expect(400)

        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.intitialBlogs.length)
    })

    test('post with no likes defined', async () => {
        const newBlogPost = {
            title: 'test blog with no likes',
            author: 'myself',
            url: '/tests/blog_api.test.js'
        }

        await api
            .post('/api/blogs')
            .send(newBlogPost)
            .expect(201)
            
        const res = await api.get('/api/blogs')

        const getBlogInDb = res.body.find(blog => blog.title === newBlogPost.title)

        expect(getBlogInDb.likes).toEqual(0)
    })
})

describe('deletion test', () => {
    test('succeed with status code 204 if id exists', async () => {
        const blogList = await api.get('/api/blogs')

        await api
            .delete(`/api/blogs/${blogList.body[0].id}`)
            .expect(204)

        const blogListAtEnd = await api.get('/api/blogs')

        expect(blogListAtEnd.body).toHaveLength(helper.intitialBlogs.length - 1)

        const titles = blogListAtEnd.body.map(blog => blog.title)

        expect(titles).not.toContain(blogList.body[0].title)
    })
})

describe('updating likes', () => {
    test('valid id', async () => {
        const blogListRes = await api.get('/api/blogs')

// console.log(blogListRes.body)
        let updatedBlog = blogListRes.body[0]
        updatedBlog.likes = updatedBlog.likes + 1

        await api
            .put(`/api/blogs/${updatedBlog.id}`)
            .send(updatedBlog)

        const res = await api.get(`/api/blogs/${updatedBlog.id}`)
console.log(blogListRes.body)
        expect(res.body.likes).toEqual(updatedBlog.likes)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
    console.log('afteralll')
})