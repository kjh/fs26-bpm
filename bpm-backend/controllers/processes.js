const processesRouter = require('express').Router()
const Process = require('../models/process')
const Phase = require('../models/phase')
const Record = require('../models/record')
const FieldDefinition = require('../models/fieldDefinition')

processesRouter.get('/', async (request, response) => {
  const processes = await Process.find({})
    .populate('phases', { name: 1 })
    .populate({
      path: 'field_definitions',
      select: 'name type options phases _id',
      populate: {
        path: 'phases',
        select: { name: 1 },
      },
    })

  console.log('processes get /', processes)

  response.json(processes)
})

processesRouter.get('/:id', async (request, response, next) => {
  try {
    const process = await Process.findById(request.params.id)
      .populate('phases', { name: 1 })
      .populate({
        path: 'field_definitions',
        populate: {
          path: 'phases',
          select: { name: 1 },
        },
      })

    console.log('process get id', process)

    if (process) {
      response.json(process)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

processesRouter.post('/', async (request, response, next) => {
  const { name, phases, field_definitions } = request.body

  if (!name || name.trim().length < 5) {
    return response.status(400).json({
      error:
        'Prosessin nimi on pakollinen ja sen täytyy olla vähintään 5 merkkiä pitkä.',
    })
  }

  try {
    let formattedPhases = []
    if (Array.isArray(phases)) {
      formattedPhases = phases.map((phase) => {
        if (typeof phase === 'string') {
          return { name: phase }
        }
        return phase
      })
    }

    const savedPhases = await Phase.insertMany(formattedPhases, {
      writeConcern: { w: 'majority' },
    }) // luodaan vaiheet
    const savedPhasesMap = new Map(
      savedPhases.map((phase) => [phase.name, phase._id]),
    )
    const phaseIds = savedPhases.map((phase) => phase._id) // voidaan käyttää savedPhases suoraan

    const updatedFields = field_definitions.map((field) => {
      return {
        ...field,
        phases: field.phases.map((name) => savedPhasesMap.get(name)),
      }
    })

    const savedFieldDefinitions = await FieldDefinition.insertMany(
      updatedFields,
      { writeConcern: { w: 'majority' } },
    ) // luodaan määritelmät

    const process = new Process({
      name: name,
      phases: phaseIds,
      field_definitions: savedFieldDefinitions,
    })

    try {
      const savedProcess = await process.save()
      await savedProcess.populate([
        { path: 'phases', select: 'name' },
        {
          path: 'field_definitions',
          select: 'name type options phases',
          populate: {
            path: 'phases',
            select: 'name',
          },
        },
      ])
      response.status(201).json(savedProcess)
    } catch (error) {
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

processesRouter.delete('/:id', async (request, response, next) => {
  try {
    const processId = request.params.id

    const process = await Process.findById(processId)
    if (!process) {
      return res.status(404).json({ error: 'Process not found' })
    }

    await Promise.all([
      Phase.deleteMany({ _id: { $in: process.phases } }),
      FieldDefinition.deleteMany({ _id: { $in: process.field_definitions } }),
      Record.deleteMany({ process: processId }),
    ])

    await Process.findByIdAndDelete(processId)

    response.status(204).end()
  } catch (error) {
    next(error)
  }
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
