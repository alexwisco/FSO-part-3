// Updating index.js to move backend to mongodb

const express = require('express')
const mongoose = require('mongoose')
const app = express()
var morgan = require('morgan')
app.use(express.json()) // value of body undefined without this 
const password = process.argv[2]

// mongoose set up
const url =
`mongodb+srv://alexwisco29:${password}@cluster0.x64ci.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  important: Boolean,
})

// Updating format of objects returned by Mongoose.
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
  }
})

const Note = mongoose.model('Note', noteSchema)

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
  const id = request.params.id // id value of the path param accessed with request object
  // that tells the request information
  const note = notes.find(note => note.id === id)

  // error checks before returning
  if (note) {
    response.json(note)
  } else {
    response.status(404).end() // end() says request should be answered without data
  }
}) // individual



// deleting individual contact
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  console.log('beep')
  console.log('requesting to delete id: ', id)
  notes = notes.filter(note => note.id !== id) // return new with everyone but id match
  response.status(204).end()
}) // deleting


// adding new contacts - task: add id with random numbers (Not a personal choice)
app.post('/api/notes', (request, response) => {

  console.log('are we usig this post')
  console.log("Notepad length before: ", notes.length)
  const body = request.body
  if (!body.title || !body.content) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const rdm = genId()
  // person object to add if content exists
  const note = {
    id: rdm,
    title: body.title,
    content: body.content
  }
  //Dont need this now that I am using morgan middleware
  //console.log("this is the new person: ", person)
  //console.log("Person's id: ", rdm)
  notes = notes.concat(note)
  console.log("Notepad length after: ", notes.length)
  response.json(notes)
})


// get a random Id - helper for adding new contact (random id not a personal choice)
const genId = () => {
  const randomId = 1 + 
  (Math.floor(Math.random() * 1000000)) // added floor for int rounding
  return (String(randomId))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
//NOTE: GET should always be safe (return data rather than change anything in the db)
