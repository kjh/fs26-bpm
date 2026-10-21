const processesRouter = require('express').Router()
const Process = require('../models/process')
const Phase = require('../models/phase')
const Record = require('../models/record')
const FieldDefinition = require('../models/fieldDefinition')
const { userExtractor } = require('../utils/middleware')

processesRouter.get('/', userExtractor, async (request, response) => {
  const user = request.user

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  if (!user) {
    return response.status(400).json({ error: 'user not valid' })
  }

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

processesRouter.get('/:id', userExtractor, async (request, response, next) => {
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

processesRouter.post('/', userExtractor, async (request, response, next) => {
  const { name, phases, field_definitions } = request.body

  if (!name || name.trim().length < 2) {
    return response.status(400).json({
      error:
        'Prosessin nimi on pakollinen ja sen täytyy olla vähintään 2 merkkiä pitkä.',
    })
  }

  try {
    // vaiheet oikeaan muotoon
    let formattedPhases = []
    if (Array.isArray(phases)) {
      formattedPhases = phases.map((phase) => {
        if (typeof phase === 'string') {
          return { name: phase }
        }
        return phase
      })
    }
    console.log('formattedPhases', formattedPhases)
    // tallennetaan uudet vaiheet tietokantaan
    const savedPhases = await Phase.insertMany(formattedPhases, {
      writeConcern: { w: 'majority' },
    })
    console.log('savedPhases', savedPhases)
    const savedPhasesMap = new Map(
      savedPhases.map((phase) => [phase.name, phase._id]),
    )
    console.log('savedPhasesMap', savedPhasesMap) // muunnetaan nimi:id
    const phaseIds = savedPhases.map((phase) => phase._id)
    console.log('phaseIds', phaseIds) // muunnetaan id
    const updatedFields = field_definitions.map((field) => {
      return {
        ...field,
        phases: field.phases.map((name) => savedPhasesMap.get(name)),
      }
    })
    console.log('updatedFields', updatedFields)

    // luodaan field_definitions
    const savedFieldDefinitions = await FieldDefinition.insertMany(
      updatedFields,
      { writeConcern: { w: 'majority' } },
    )
    console.log('savedFieldDefinitions', savedFieldDefinitions)

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

processesRouter.delete(
  '/:id',
  userExtractor,
  async (request, response, next) => {
    try {
      const processId = request.params.id

      const process = await Process.findById(processId)
      if (!process) {
        return response.status(404).json({ error: 'Process not found' })
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
  },
)

processesRouter.put('/:id', userExtractor, async (request, response, next) => {
  const processId = request.params.id

  const { name, phases, field_definitions } = request.body

  const process = await Process.findById(processId).populate('phases')

  if (!process)
    return response.status(404).json({ message: 'Process not found' })

  // validations
  // name
  if (!name || name.trim().length < 2) {
    return response.status(400).json({
      error: 'Processname is required and minumum length is 2 characters',
    })
  }

  try {
    // check new phase
    let newPhases = []
    if (Array.isArray(phases)) {
      newPhases = phases.filter((phase) => {
        return typeof phase === 'object' && !phase?.id
      })
    }
    // new phase
    if (newPhases.length > 0) {
      const savedPhases = await Phase.insertMany(newPhases, {
        writeConcern: { w: 'majority' },
      })

      console.log('newPhases on DB ja nyt -> savedPhases', savedPhases)
      const savedPhasesMap = new Map(
        savedPhases.map((phase) => [phase.name, phase._id]),
      )

      if (savedPhases.length > 0) {
        const processPhaseIdArray = phases.map((phase) => {
          if (phase.id) return phase.id

          return savedPhasesMap.get(phase.name)
        })
        process.phases = processPhaseIdArray
        process.markModified('phases')
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

        return response.status(201).json(savedProcess)
      }
    }

    // Check phase names
    let hasChangedPhaseNames = false
    for (const phase of phases) {
      const fromDbPhase = process.phases.find((p) => p._id.equals(phase.id))
      if (fromDbPhase && fromDbPhase.name !== phase.name) {
        const updatedPhase = await Phase.findByIdAndUpdate(phase.id, {
          name: phase.name,
        })
        console.log('updated phase: ', updatedPhase)
        hasChangedPhaseNames = true
      }
    }

    // Update phase names
    if (hasChangedPhaseNames) {
      console.log('update phase names')
      const withChangedNames =
        await Process.findById(processId).populate('phases')
      await withChangedNames.populate([
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
      return response.status(201).json(withChangedNames)
    }

    // process.phases
    const processPhaseIds = phases.map((phase) => phase.id) // vaiheet ok

    const processPhaseIdsMap = new Map(
      phases.map((phase) => {
        return [phase.name, phase.id]
      }),
    )

    const updatedFields = field_definitions.map((field, i) => {
      return {
        ...field, // name, options
        phases: field.phases.map((phase) => {
          console.log('phase from form:', phase)
          if (typeof phase === 'object')
            return processPhaseIdsMap.get(phase.name)
          return processPhaseIdsMap.get(phase) // phases:['name'] -> phases:[id]
        }),
      }
    })

    // handle old definition
    const fieldsWithId = updatedFields.filter((f) => f.id)

    for (const field of fieldsWithId) {
      await FieldDefinition.findByIdAndUpdate(field.id, field)
    }

    // handle new field defintion
    const fieldsWithNoId = updatedFields.filter((f) => !f?.id)

    const savedFieldDefinitions = await FieldDefinition.insertMany(
      fieldsWithNoId,
      { writeConcern: { w: 'majority' } },
    )

    // update record.fields
    if (savedFieldDefinitions) {
      const records = await Record.find({ process: processId })
      for (const record of records) {
        for (const def of savedFieldDefinitions) {
          record.fields.push({
            field_definition: def._id,
            value: '',
          })
        }
        record.markModified('fields')
        await record.save()
      }
    }

    process.name = name
    process.phases = processPhaseIds
    process.field_definitions = [
      ...fieldsWithId.map((f) => f.id),
      ...savedFieldDefinitions.map((f) => f.id),
    ]

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

module.exports = processesRouter
