const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({description: {
    type: String,
    trim: true,
    required: true
}, 
completed: {
    default: false,
    type: Boolean
}, 
owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
}
}, {
    timestamps: true
})

const task = mongoose.model('task', taskSchema)



module.exports = task