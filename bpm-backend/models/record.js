const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
  
  process_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Process', 
    //required: true 
  },
  
  title: { 
    type: String, 
    //required: true
  },
  
  current_phase_id: { 
    type: mongoose.Schema.Types.ObjectId,
    //required: true
  },
  
  fields: [
    {
      _id: false, 
      field_definition: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true 
      },    
      value: { 
        type: mongoose.Schema.Types.Mixed,
      } 
    }
  ]
})

recordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Record', recordSchema)