const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')   //backend handler
const helper = require('./test_helper')

const api = supertest(app)  //wrapper for the backend handler

const Blog = require('../models/blog')

const bcrypt  = require('bcrypt')
const User = require('../models/user')
const { usersInDb } = require('./test_helper')

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
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('shhhh!!', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('a valid post', async () => {
        const loginResponse = await api
            .post('/api/login')
            .send({username: 'root', password: 'shhhh!!'})
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const token = 'bearer '+loginResponse.body.token

        const newBlogList = {
            title: 'Testing POST',
            author: 'jest',
            url: '/api/blogs',
            likes: -1
        }
    
        await api
            .post('/api/blogs')
            .send(newBlogList)
            .set({ Authorization: token})
            .expect(201)
            .expect('Content-type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.intitialBlogs.length + 1)
    
        const titles = response.body.map(blog => blog.title)
        expect(titles).toContain(newBlogList.title)
    })

    test('Invalid (401) as no token is provided', async () => {
        const loginResponse = await api
            .post('/api/login')
            .send({username: 'root', password: 'shhhh!!'})
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const newBlogList = {
            title: 'Testing POST',
            author: 'jest',
            url: '/api/blogs',
            likes: -1
        }
        
//authorization is not set    
        await api
            .post('/api/blogs')
            .send(newBlogList)
            .expect(401)
    })

    test('invalid as no Title is defined', async () => {
        const loginResponse = await api
            .post('/api/login')
            .send({username: 'root', password: 'shhhh!!'})
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const token = 'bearer '+loginResponse.body.token

        const newBlogList = {
            author: 'wrong',
            url: '/api/'
        }

        await api
            .post('/api/blogs')
            .send(newBlogList)
            .set({Authorization: token})
            .expect(400)

        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.intitialBlogs.length)
    })

    test('post with no likes defined', async () => {
        const loginResponse = await api
            .post('/api/login')
            .send({username: 'root', password: 'shhhh!!'})
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const token = 'bearer '+loginResponse.body.token

        const newBlogPost = {
            title: 'test blog with no likes',
            author: 'myself',
            url: '/tests/blog_api.test.js'
        }

        await api
            .post('/api/blogs')
            .send(newBlogPost)
            .set({Authorization: token})
            .expect(201)
            
        const res = await api.get('/api/blogs')

        const getBlogInDb = res.body.find(blog => blog.title === newBlogPost.title)

        expect(getBlogInDb.likes).toEqual(0)
    })
})

describe('deletion test', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('shhhh!!', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('succeed with status code 204 if id exists', async () => {
        const loginResponse = await api
            .post('/api/login')
            .send({username: 'root', password: 'shhhh!!'})
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const token = 'bearer '+loginResponse.body.token

        // const blogList = await api.get('/api/blogs')

        const newBlogList = {
            title: 'Testing POST',
            author: 'jest',
            url: '/api/blogs',
            likes: -1
        }
    
        const blogPostRes = await api
            .post('/api/blogs')
            .send(newBlogList)
            .set({ Authorization: token})
            .expect(201)
console.log(blogPostRes.body)
        await api
            .delete(`/api/blogs/${blogPostRes.body.id}`)
            .set({Authorization: token})
            .expect(204)

        const blogListAtEnd = await api.get('/api/blogs')

        // expect(blogListAtEnd.body).toHaveLength(helper.intitialBlogs.length - 1)

        const titles = blogListAtEnd.body.map(blog => blog.title)

        expect(titles).not.toContain(blogPostRes.body.title)
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
// console.log(blogListRes.body)
        expect(res.body.likes).toEqual(updatedBlog.likes)
    })
})

describe('when their is initially 1 user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('shhhh!!', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('creating a user succeeds', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'punker',
            name: 'punk ass',
            password: 'sekret'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creating user fails for already existing username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'superuser',
            password: '0000'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creating user with shorter username or password fails', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username:'hurraa',
            name: 'divv',
            password: 'gg'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        expect(result.body.error).toContain('shorter than the minimum allowed length')
    })
})

afterAll(async () => {
    await mongoose.connection.close()
    console.log('afteralll')
})