const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema(
  {
    process: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Process',
      required: true,
    },

    title: {
      type: String,
    },

    current_phase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Phase',
    },

    fields: [
      {
        field_definition: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'FieldDefinition',
        },
        value: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

recordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Record', recordSchema)
