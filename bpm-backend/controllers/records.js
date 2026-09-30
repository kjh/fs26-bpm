const recordsRouter = require('express').Router({ mergeParams: true })
const Process = require('../models/process')
const Record = require('../models/record')

recordsRouter.post('/', async (request, response, next) => {
  console.log('recordsRouter')
  try {
    const { processId } = request.params

    console.log('processId', processId)

    const processExists = await Process.exists({ _id: processId })
    if (!processExists) {
      return response.status(404).json({ error: 'Process not found' })
    }

    const newRecord = new Record({
      ...request.body,
      process: processId,
    })

    const savedRecord = await newRecord.save()
    await savedRecord.populate([
      {
        path: 'process',
        select: { name: 1 }
      },
      {
        path: 'current_phase',
        select: { name: 1 }
      },
      {
        path: 'fields.field_definition',
        select: 'name type options'
      }
    ])
    response.status(201).json(savedRecord)
  } catch (error) {
    next(error)
  }
})

recordsRouter.get('/', async (request, response, next) => {
  const { processId } = request.params
  console.log('records for process id', processId)
  try {
    console.log('got id', processId)
    const records = await Record.find({ process: processId })
      .populate('process', { name: 1 })
      .populate('current_phase', { name: 1 })
      .populate({
        path: 'fields.field_definition',
        select: 'name type options _id',
      })
    console.log('got records', records)
    response.json(records)
  } catch (error) {
    next(error)
  }
})

module.exports = recordsRouter
