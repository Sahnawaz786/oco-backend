const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')

//Creating a User
exports.createUser = catchAsync(async(req,res,next)=>{
    const user = await User.create(req.body);
    res.status(201).json({
        message:'Success',
        user
    })
})

//Getting all User
exports.getAllUser = catchAsync(async (req,res,next)=>{
    const allUser = await User.find();
    res.status(200).json({
        result:allUser.length,
        message:"Success",
        users:allUser
    })
})

//Getting a Specific User
exports.getUser = catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    res.status(200).json({
        message:'Success',
        user
    })
})

//Deleting a Specific User
exports.deleteUser = catchAsync(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
        message:'Success'
    });
})

//Deleting All Users
exports.deleteAllUser = catchAsync(async(req,res,next)=>{
    const user = await User.deleteMany();
    res.status(204).json({
        message:'Success'
    });
})

//Admin can Assign task's to normal user

exports.assignTask = catchAsync(async(req,res,next)=>{

    const help = await User.findById(req.params.userid);

    const user = await User.findByIdAndUpdate(req.params.userid,{tasks:[...help.tasks,req.params.taskid]},{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        message:'Success',
        user
    })

})