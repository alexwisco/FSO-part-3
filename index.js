// Updating index.js to move backend to mongodb with note.js from models
require('dotenv').config()
const Note = require('./models/note')

const express = require('express')
const app = express()
app.use(express.json()) // value of body undefined without this 
var morgan = require('morgan')

// All mongoose set up moves to ./models/note


app.use(express.static('dist')) // dist folder from front end repo

const cors = require('cors')

app.use(cors())


// Middleware: functions that are used to process req/res objects.
// Should be enabled before the applications routes. 
const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
//app.use(requestLogger)

//Defining a custom token for morgan. Adding request data logs for POST requests. 
// for data we are dealing with the request
const middlewaring =
morgan.token('req-body', (req) => {
  if (req.method === 'POST'){
    //return the body if we are adding 
    return JSON.stringify(req.body)
  }
  // if it is any other request (i.e GET) we don't need to do anything 
  return ""
}) // token
 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

// routes
// Main page 
app.get('/', (request, response) => {
    response.send('<h1> Hello World <h1>')
}) // homepage


// retrieve all items in phonebook
// Updating for mongodb
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
  }) // all


// retrieve number of people in phonebook
app.get('/info', (request, response) => {
  // Timestamp code:
  const d = Date()
  console.log("Date: ", d)
    //console.log("timestamp: ", request.date)
    response.send(`<p>Note pad has info for ${notes.length} people</p>
      <p>${d}</p>`)
}) // length of phonebook


// retrieving individual data - colon defines parameters on the path
app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id)
      .then(note => {
        response.json(note)
      })
}) // individual



// deleting individual contact
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  console.log('beep')
  console.log('requesting to delete id: ', id)
  notes = notes.filter(note => note.id !== id) // return new with everyone but id match
  response.status(204).end()
}) // deleting


// adding new notes: mongodb backend version
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined || body.title === undefined) {
    return response.status(400).json({error: 'Incomplete note'})
  }

  // Note object created using Note constructor.
  const note = new Note({
    title: body.title,
    content: body.content,
    important: body.important || false 
  })

  // request responded to inside save callback function.
  // Ensures the response to the operation only happens
  // if the operation is successful.
  note.save().then(savedNote => {
    response.json(savedNote)
    //savedNote is ... a saved note.
    // HTTP request automatically returns a formatted
    //version of it using toJSON method.
  })
}) // post 

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
//NOTE: GET should always be safe (return data rather than change anything in the db)
