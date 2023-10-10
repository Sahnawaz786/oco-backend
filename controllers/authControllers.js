const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');

const assignToken = (id)=>{
   return  jwt.sign({id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

//Signup Functionality
exports.signup = catchAsync(async(req,res,next)=>{
    const newUser = await User.create(req.body);
    //Creating a JWT token
    const token = assignToken(newUser._id);
    res.status(201).json({
        message:'Successs',
        user:newUser,
        token
    })
});

//Login Functionality

exports.login = catchAsync(async(req,res,next)=>{
    const {email,password} = req.body;

    //Checking if email & password is given by user or not
    if(!email || !password){
        return next(new Error('Pls provide email and password !'));
    }

    //if given then getting the user by email
    const user = await User.findOne({email}).select('+password');

    //checking if user exit's and password is also correct
    if(!user || !(await user.checkPassword(password,user.password))){
        return next(new Error('Email or password is inncorrect 😔'));
    }

    // console.log(user);

    const token = assignToken(user._id);

    res.status(200).json({
        status:'success',
        token
    })

})

//Protecting by verifying The JWT Token's

exports.protect = catchAsync(async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next(new Error('You are not logged In pls login !'));
    }

    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET_KEY);

    const currentUser = await User.findById(decoded.id);

    if(!currentUser) return next('User no longer exits !');

    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new Error('User recently changed password pls login again !'))
    }

    req.user = currentUser;
    next();

})


exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new Error('You dont have permission'));
        }
        next();
    }
}

