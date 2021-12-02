var lodash = require('lodash')   // makes JavaScript easier by taking the hassle out of working with arrays, numbers, objects, strings, etc.

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (likes, blog) => {    //(aggregate of previous objects, current object)
        return likes + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    let res = Math.max.apply(Math, blogs.map(blog => blog.likes))

    return blogs.find(blog => blog.likes === res)
}

const mostBlogs = (blogs) => {
    //https://lodash.com/docs/4.17.15#values
    const blogsByAuthor = lodash.values(lodash.groupBy(blogs, 'author'))   //https://lodash.com/docs/4.17.15#groupBy

    
    // const maxBlogCount = Math.max.apply(Math, blogsByAuthor.map(author => author.length))
    
    // const authorBlog = blogsByAuthor.find(author => author.length === maxBlogCount)
    
    // return authorBlog === undefined ? undefined : {
        //     author: authorBlog[0].author,
        //     blogs: maxBlogCount
        // }
        
//blogsByAuthor is a 2D array

    const maxBlogger = blogsByAuthor.reduce((max,cur) => (max.length > cur.length ? max : cur), {}) //finding an object with a max property

    return Object.keys(maxBlogger).length===0 ? {} :{
        author: maxBlogger[0].author,
        blogs: maxBlogger.length
    }
}

const mostLikes = (blogs) => {
    let blogsByAuthor = blogs.reduce((res, blog) => {
        res[blog.author] = res[blog.author] || {likes: 0} //initializes an object IF not found
      
        res[blog.author].author = blog.author
        res[blog.author].likes += blog.likes
      console.log(typeof(res))
        return res
      }, {})
// console.log(blogsByAuthor)
    blogsByAuthor = Object.values(blogsByAuthor)    //converts object ot array of values

    const maxLikedAuthor = blogsByAuthor.reduce((max, cur) => (max.likes > cur.likes) ? max : cur, {})

    return maxLikedAuthor
}

module.exports = {
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes,
    dummy
}