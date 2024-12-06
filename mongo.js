//Testing file to learn mongoose 

const mongoose = require('mongoose')
const password = process.argv[2]
const title = process.argv[3]
const content = process.argv[4]
const url =
`mongodb+srv://alexwisco29:${password}@cluster0.x64ci.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

// Tell mongoose how to store note object in the database
const noteSchema = new mongoose.Schema({
    title: String,  
    content: String,
    important: Boolean,
  })

/* note param: Mongoose stores the objects corresponding to the 
note in a collection called 'notes', because Mongoose convention
is to define the names of collections in plural when they are reffered to 
in the singular form in the scheme definition. 

MongoDB is a Document database and thus schema free, so the db itself
doesnt care about the format of the data stored. Its possible to 
store objects with completely different fields in the same collection. 

However, the principle is that a schema is defined at the application code
level for the data to be stored in the database, which defines what form objects 
are stored in the different collections of the database. */
const Note = mongoose.model('Note', noteSchema)




// Adding cmd functionality here: 
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
} // < 3

// If we are given only a password -> Show the notes 
if (process.argv.length === 3) {
    console.log('Three args provided. Fetching Notes ...')
    Note.find({}).then(result => {
        result.forEach(note => { 
          console.log(note)
        })
        mongoose.connection.close()
      })
} // 3 

// If not given content
if (process.argv.length === 4) {
   console.log('Need title and content. Try again')
   process.exit(1)
} // 3 

if (process.argv.length === 5) {
    console.log('Five args provided, creating new note ...')
   console.log('Creating new note ... ')
   const note = new Note({
    title: title,
    content: content,
    important: true,
  })

  console.log('Check mongoDB to view your new note. ')
  note.save().then(result => {
    console.log('note saved!')
    console.log(result)
    mongoose.connection.close() 
    // cannot close before saving others. 
  })
} // 4


/*
// Creates a note object using the model corresponding to the note.
// Model: constructor compiled from Schema definitions. 
// an instance of a model is a document. Responsible for
// createing and reading documents from underlying mongoDB db
const note = new Note({
  title: 'One',
  content: 'HTML is easy',
  important: true,
})

const note01 = new Note({
    title: 'two',
    content: "Backend is not",
    important: true,
})
    */
/*
// saving. returns a promise for which an event handler can be registered using the 
// the 'then' method
note.save().then(result => {
  console.log('note saved!')
  console.log(result)
  //mongoose.connection.close() 
  // cannot close before saving others. 
})

note01.save().then(result => {
  console.log('note saved!')
  console.log(result)
  mongoose.connection.close()
})
  */
// result of the save op is in callback param 'result'


/*
// find method, param is a search condition. Empty Search condition means we get 
//all the objects in the notes collection.
// we could have find{important: true} and only get important notes. 
Note.find({}).then(result => {
    result.forEach(note => {
      console.log("Note -> ")  
      console.log(note)
    })
    mongoose.connection.close()
  })

  */