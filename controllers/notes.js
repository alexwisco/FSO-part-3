/**
 * Routing definitions moved here. 
 * Event handlers of routes often called controllers.
 * 
 * "A router object is an isolated instance of middleware and routes
 * You can think of it as a 'mini-application', capable only
 * of performing middleware and routing functions. Every Express
 * application has a built in app router"
 */

/**
 * Router object created and exported for use in other files
 * All routes are attached to notesRouter.
 */
const notesRouter = require('express').Router()
const Note = require('../models/note')


/**
 * Get request to display entire collection of notes.
 */
notesRouter.get('/', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
  })

/**
 * GET request to display a single note given its ID.
 * Can be done in browser/postman
 */
notesRouter.get('/:id', (request, response, next) => {
    Note.findById(request.params.id)
      .then(note => {
        if (note) {
          response.json(note)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })
  
  /**
   * Adding a new note to the application
   */
  notesRouter.post('/', (request, response, next) => {
    const body = request.body

    if (body.content === undefined || body.title === undefined) {
      return response.status(400).json({ error: 'Incomplete note' })
    }
  
    // Note object created using Note constructor.
    const note = new Note({
      title: body.title,
      content: body.content,
      important: body.important || false,
    })
  
    // request responded to inside save callback function.
    // Ensures the response to the operation only happens
    // if the operation is successful.
    note.save().then((savedNote) => {
      response.json(savedNote)
    })
      .catch(error => next(error))
  })
  

  /**
   * Delete a note given an ID.
   */
  notesRouter.delete('/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })
  
  module.exports = notesRouter