// Updating index.js to move backend to mongodb with note.js from models
require("dotenv").config();
const Note = require("./models/note");

const express = require("express");
const app = express();
app.use(express.json()); // value of body undefined without this
var morgan = require("morgan");

// All mongoose set up moves to ./models/note

app.use(express.static("dist")); // dist folder from front end repo

const cors = require("cors");

app.use(cors());

// Middleware: functions that are used to process req/res objects.
// Should be enabled before the applications routes.
const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method)
  console.log("Path: ", request.path)
  console.log("Body:  ", request.body)
  console.log("---")
  next()
};
//app.use(requestLogger)

//Defining a custom token for morgan. Adding request data logs for POST requests.
// for data we are dealing with the request
const middlewaring = morgan.token("req-body", (req) => {
  if (req.method === "POST") {
    //return the body if we are adding
    return JSON.stringify(req.body)
  }
  // if it is any other request (i.e GET) we don't need to do anything
  return ""
}); // token

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

// routes
// retrieve all items in phonebook
// Updating for mongodb
app.get("/api/notes", (request, response, next) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
  .catch(error => next(error))
}) // all

// retrieve number of people in phonebook and display time
app.get("/info", (request, response, next) => {
  // Timestamp code:
  const d = Date();
  console.log("Date: ", d);

  response
    .send(
      `<p>Note pad has info for ${Note.length} people</p>
      <p>${d}</p>`
    )
    .catch((error) => next(error));
}); // length of phonebook

// retrieving individual data - colon defines parameters on the path
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      // error handling for non existents
      if (note) {
        response.json(note);
      } else {
        // Null state
        response.status(404).end();
      }
    })
    /*
        Error passed forward given as param in 'next' function. 
        If 'next' function called without a param, processing would
        only pass the next defined route or middleware.
        If a param is given, processing will pass to the error handling middleware.
      */
    .catch((error) => next(error));
}); // individual

// deleting individual contact
app.delete("/api/notes/:id", (request, response) => {
  console.log("deletion of ", request.params.id);
  //Note.deleteOne({"_id": id})
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
}); // deleting

// adding new notes: mongodb backend version
app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  if (body.content === undefined || body.title === undefined) {
    return response.status(400).json({ error: "Incomplete note" });
  }

  // Note object created using Note constructor.
  const note = new Note({
    title: body.title,
    content: body.content,
    important: body.important || false,
  });

  // request responded to inside save callback function.
  // Ensures the response to the operation only happens
  // if the operation is successful.
  note.save().then((savedNote) => {
    response.json(savedNote);
    //savedNote is ... a saved note.
    // HTTP request automatically returns a formatted
    //version of it using toJSON method.
  })
  .catch(error => next(error))
}) // post

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};

app.use(unknownEndpoint);

// error handler function
// Express error handlers are middleware whose defining function has four params.
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error);
}; //

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//NOTE: GET should always be safe (return data rather than change anything in the db)
