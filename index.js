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
        important: "234"
      },
      {
        id: "3",
        name: "Spongebob",
        number: "345"
      }
]

// routes

app.get('/', (request, response) => {
    response.send('<h1> .Hello World. <h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})