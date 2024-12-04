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
      }
]

// routes
// Main page 
app.get('/', (request, response) => {
    response.send('<h1> .Hello World. <h1>')
})

// retrieve all items in phonebook
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

// retrieve number of people in phonebook
app.get('/info', (request, response) => {
  // Timestamp code:
  const d = Date()
  console.log("Date: ", d)
    //console.log("timestamp: ", request.date)
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
      <p>${d}</p>`)
  
})

// retrieving individual data - colon defines parameters on the path
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id // id value of the path param accessed with request object
  // that tells the request information
  const person = persons.find(person => person.id === id)

  // error checks before returning
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})