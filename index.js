const express = require('express')
const app = express()

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

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})