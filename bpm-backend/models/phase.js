const mongoose = require('mongoose')

const phaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
})

phaseSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Phase', phaseSchema)
