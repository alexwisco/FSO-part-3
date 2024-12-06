const express = require('express')
const app = express()
// Changing backend functionality, no longer 3000/notes, add api to path
// (Learning about CORS) - cross-origin resource sharing: 
// Mechanism that allows restricted resources on a web page to be requested from 
// another sdomain outside the domain from which the first resource was served.
// for our update from 3000/notes -> 3000/api/notes
// need CORS middleware :) allows requests from other origins

var morgan = require('morgan')

app.use(express.json()) // value of body undefined without this 


// HTTP GET /index shows the frontend made with React.
// GET to /api/notes handeled by backend code (this repo)
app.use(express.static('dist')) // dist folder from front end repo

const cors = require('cors')
app.use(cors())

let notes = [
  {
    id:"1",
    title:"testing",
    content:"Hello"
  },
  {
    id:"2",
    title:"testing2",
    content:"Hello2"
  },
  {
    id:"3",
    title:"testing3",
    content:"Hello3"
  }
]


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

//const middlewaring = morgan('tiny')

//const middlewaring = morgan(':method :url :status :response-time ms - :res[content-length]')
/*
const middlewaring = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',

  ].join(' ')
})*/

//const middlewaring = morgan('tiny')

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
app.get('/api/notes', (request, response) => {
    response.json(notes)
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
