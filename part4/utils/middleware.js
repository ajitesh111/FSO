const logger = require('./logger')
const { request } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body: ', request.body)
    logger.info('---')
    next()
}

const getTokenFrom = request => {
    const authorization = request.get('authorization')  //'authorization' is one of js headers
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){ //bearer => authentication scheme
        return authorization.substring(7)
    }
    return null
}

const tokenExtractor = (request, response, next) => {
    request.token = getTokenFrom(request)
    next()
}

const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!request.token || !decodedToken.id){
        return response.status(401).json({error: 'invalid or missing token'})
    }
//token has username and id
    const user = await User.findById(decodedToken.id)
    request.user = user

    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({ error: error.message })
    } else if(error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } else if(error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    }

    logger.error(error.message)
    next(error)
}

module.exports = {
    requestLogger,
    tokenExtractor,
    userExtractor,
    unknownEndpoint,
    errorHandler
}