const Blog = require('../models/blog')

const intitialBlogs = [
    {
        title: "Test blog 1",
        author: 'myself',
        url: 'localhost:3000',
        likes: 0
    },
    {
        title: "Test blog 2",
        author: 'me',
        url: 'localhost:3000/api/persons',
        likes: 1
    }
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'placebo',
        aythor: 'placebo',
        url: '/placebo/'
    })

    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

module.exports = {
    intitialBlogs,
    nonExistingId
}