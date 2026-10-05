const recordsRouter = require('express').Router({ mergeParams: true })
const Process = require('../models/process')
const Record = require('../models/record')

recordsRouter.put('/:id', async (request, response, next) => {
  console.log('recordsRouter put')
  try {
    const recordId = request.params.id
    const processId = request.params.processId
    const updatedFields = request.body?.fields
    const updatedTitle = request.body?.title
    const updatedPhase = request.body?.current_phase

    console.log('processId', processId)
    console.log('recordId', recordId)

    if (!updatedFields && !updatedTitle && !updatedPhase) {
      return response.status(204).send()
    }

    const recordExists = await Record.exists({ _id: recordId })
    if (!recordExists) {
      return response.status(404).json({ error: 'Record not found' })
    }

    const record = await Record.findById(recordId)
    console.log('from request updatedTitle', updatedTitle)
    console.log('from request updatedPhase', updatedPhase)
    console.log('from request updatedFields', updatedFields)
    console.log('from db record.fields', record.fields)

    if (updatedFields) {
      record.fields = record.fields.map((field) => {
        const fieldId = field._id

        if (updatedFields[fieldId] !== undefined) {
          return {
            ...field,
            value: updatedFields[fieldId],
          }
        }

        return field
      })

      record.markModified('fields')
    }

    if (updatedTitle) {
      record.title = updatedTitle
      record.markModified('title')
    }

    if (updatedPhase) {
      record.current_phase = updatedPhase
      record.markModified('current_phase')
    }

    const savedRecord = await record.save()

    await savedRecord.populate([
      {
        path: 'process',
        select: { name: 1 },
      },
      {
        path: 'current_phase',
        select: { name: 1 },
      },
      {
        path: 'title',
        select: { name: 1 },
      },
      {
        path: 'fields.field_definition',
        select: 'name type phases options _id',
        populate: {
          path: 'phases',
          select: 'name _id',
        },
      },
    ])
    console.log(
      'recordsRouter put response: ',
      JSON.stringify(savedRecord, null, 2),
    )
    response.status(200).json(savedRecord)
  } catch (error) {
    next(error)
  }
})

recordsRouter.post('/', async (request, response, next) => {
  console.log('recordsRouter post')
  try {
    const { processId } = request.params

    console.log('processId', processId)
    console.log('===')

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
        select: { name: 1 },
      },
      {
        path: 'current_phase',
        select: { name: 1 },
      },
      {
        path: 'fields.field_definition',
        select: 'name type phases options',
        populate: {
          path: 'phases',
          select: 'name _id',
        },
      },
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
        select: 'name type phases options _id',
        populate: {
          path: 'phases',
          select: 'name _id',
        },
      })
    console.log(
      'recordsRouter get response: ',
      JSON.stringify(records, null, 2),
    )
    response.json(records)
  } catch (error) {
    next(error)
  }
})

module.exports = recordsRouter
