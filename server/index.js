//Main start point of the application
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const router = require('./router')
const mongoose = require('mongoose')
const app = express()

//#region SetupDB
//mongodb://localhost:auth/[databaseName]
mongoose.connect('mongodb://localhost:auth/auth', { useNewUrlParser: true })
// mongoose.Promise = global.Promise
//#endregion

//#region App Setup
app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*' }))
router(app)
//#endregion

//#region Server Setup
const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)
console.log('Server Listening on:', port)

//#endregion