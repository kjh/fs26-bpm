const mongoose = require('mongoose')

const processSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
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
    /*{
      type: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      options: [
        { type: String } 
      ],
      phases: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Phase'
        }
      ]
    }*/
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

processSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Process', processSchema)
