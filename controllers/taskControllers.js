const catchAsync = require('../utils/catchAsync');
const Task = require('./../models/taskModel');

//Creating a Task
exports.createTask = catchAsync(async(req,res,next)=>{
    const task = await Task.create(req.body);
    res.status(201).json({
        message:'Success',
        task
    })
})

//Updating a Task
exports.updateTask = catchAsync(async(req,res,next)=>{
    const task = await Task.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        message:'Success',
        task
    })
})

//Deleting a Task
exports.deleteTask = catchAsync(async(req,res,next)=>{
    const task = await Task.findByIdAndDelete(req.params.id);
    res.status(204).json({
        message:'Success'
    });
})

//Get all Tasks
exports.getAllTask = catchAsync(async(req,res,next)=>{
    const task = await Task.find();
    res.status(200).json({
        result:task.length,
        message:'Success',
        task
    })
})