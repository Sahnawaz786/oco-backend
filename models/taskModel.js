const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:[5,'A task name should contain atleast 3 character'],
        maxlength:[20,'A task name should not contain more than 20 character'],
        required:[true,'A task must have a name']
    },
    Assigned:{
        type:Date,
        default:Date.now()
    },
    Deadline:{
        type:Date
    },
    status:{
        type:String,
        enum:['pending','completed','upcoming'],
        default:'upcoming',
        required:[true,'A task must have a status']
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

const Task = mongoose.model('Task',taskSchema);

module.exports = Task;