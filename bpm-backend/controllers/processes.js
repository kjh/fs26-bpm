const processesRouter = require('express').Router()
const Process = require('../models/process')

processesRouter.get('/', (request, response) => {
  Process.find({}).then((processes) => {
    response.json(processes)
  })
})

processesRouter.get('/:id', (request, response, next) => {
  Process.findById(request.params.id)
    .then((process) => {
      if (process) {
        response.json(process)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

processesRouter.post('/', (request, response, next) => {
  const body = request.body

  const process = new Process({
    name: body.name,
  })

  process
    .save()
    .then((savedProcess) => {
      response.json(savedProcess)
    })
    .catch((error) => next(error))
})

processesRouter.delete('/:id', (request, response, next) => {
  Process.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

processesRouter.put('/:id', (request, response, next) => {
  const { name } = request.body

  Process.findById(request.params.id)
    .then((process) => {
      if (!process) {
        return response.status(404).end()
      }

      process.name = name

      return process.save().then((updatedProcess) => {
        response.json(updatedProcess)
      })
    })
    .catch((error) => next(error))
})

module.exports = processesRouter