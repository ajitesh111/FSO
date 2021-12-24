const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { response } = require('express')

usersRouter.post('/', async(request, response, next) => {
    const body = request.body

    if(body.password.length < 3) {
        console.log(`User validation failed: username: Path \`password\` (${body.password}) is shorter than the minimum allowed length (3).`)
        return response.status(400).json({ error: `User validation failed: username: Path \`password\` (${body.password}) is shorter than the minimum allowed length (3).`})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()
    response.json(savedUser)
})

usersRouter.get('/', async(request, response) => {
// bcoz of 'ref' defined in the schema. 'blogs' is the attribute for each user 
    const users = await User
        .find({}).populate('blogs', {title:1, author:1, url:1})
    response.json(users)
})

module.exports = usersRouter