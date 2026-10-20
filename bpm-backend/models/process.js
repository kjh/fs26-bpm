const mongoose = require('mongoose')

const processSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
    },

    phases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Phase',
      },
    ],

    field_definitions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FieldDefinition',
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
)

processSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Process', processSchema)
