const mongoose = require('mongoose')

const processSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
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