const express = require('express')
const app = express()

var morgan = require('morgan')

app.use(express.json()) // value of body undefined without this 

let persons = [
    {
        id: "1",
        name: "Alex",
        number: "123"
      },
      {
        id: "2",
        name: "Angela",
        number: "234"
      },
      {
        id: "3",
        name: "Spongebob2",
        number: "345"
      },
      {
        id: "4",
        name: "Spong",
        number: "456"
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
app.get('/api/persons', (request, response) => {
    response.json(persons)
  }) // all


// retrieve number of people in phonebook
app.get('/info', (request, response) => {
  // Timestamp code:
  const d = Date()
  console.log("Date: ", d)
    //console.log("timestamp: ", request.date)
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
      <p>${d}</p>`)
}) // length of phonebook


// retrieving individual data - colon defines parameters on the path
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id // id value of the path param accessed with request object
  // that tells the request information
  const person = persons.find(person => person.id === id)

  // error checks before returning
  if (person) {
    response.json(person)
  } else {
    response.status(404).end() // end() says request should be answered without data
  }
}) // individual



// deleting individual contact
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log('requesting to delete id: ', id)
  persons = persons.filter(person => person.id !== id) // return new with everyone but id match
  response.status(204).end()
}) // deleting


// adding new contacts - task: add id with random numbers (Not a personal choice)
app.post('/api/persons', (request, response) => {
  console.log("phonebook length before: ", persons.length)
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const rdm = genId()
  // person object to add if content exists
  const person = {
    id: rdm,
    name: body.name,
    number: body.number
  }
  //Dont need this now that I am using morgan middleware
  //console.log("this is the new person: ", person)
  //console.log("Person's id: ", rdm)
  persons = persons.concat(person)
  console.log("phonebook length after: ", persons.length)
  response.json(person)
})


// get a random Id - helper for adding new contact (random id not a personal choice)
const genId = () => {
  const randomId = 1 + 
  (Math.floor(Math.random() * 10000)) // added floor for int rounding
  return (String(randomId))
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
//NOTE: GET should always be safe (return data rather than change anything in the db)
