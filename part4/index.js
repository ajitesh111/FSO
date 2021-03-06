const http = require('http')
const app = require('./app')  //was created so that backend is seperate from the component that listens for browser
const logger = require('./utils/logger')
const config = require('./utils/config')

const server = http.createServer(app)

// const PORT = 3003
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})