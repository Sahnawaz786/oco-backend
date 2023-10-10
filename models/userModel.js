const mongoose = require('mongoose');
const validator = require('validator');
const Task = require('./taskModel');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A user must have a name 🙂'],
        maxlength:[30,'A user name should not be greater than 30 character'],
        minlength:[4,'A user name should contain atleast 4 characters']
    },
    email:{
        type:String,
        required:[true,'A user must have a email 🤨'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'pls provide a valid Email']
    },
    password:{
        type:String,
        required:[true,'pls provide a password'],
        maxlength:[15,'password length should not exceed 15 characters'],
        minlength:[4,'password length should contain atleast 4 characters'],
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,'pls confirm your password'],
        validate: {
            validator: function(el) {
              return el === this.password;
            },
            message: 'Passwords are not the same!'
          }
    },
    passwordChangedAt:Date,
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    tasks:[
        {
        type:mongoose.Schema.ObjectId,
        ref:'Task'
        }
    ],
    
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});


userSchema.pre('save',async function(next){
    const taskData = this.tasks.map(async (id)=> await Task.findById(id));
    this.tasks = await Promise.all(taskData);
    next();
})

userSchema.pre(/^find/,function(next){
    this.populate({
        path:'tasks',
        select:['name','status','Assigned']
    })
    next();
});

//Authentication & Authorization

//Encrypting the password before saving it in DB
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined;
    next();
})

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.checkPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

//Method to check if user changed password after the token is issued

userSchema.methods.changedPasswordAfter = function(JwtTimeStamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JwtTimeStamp < changedTimeStamp;
    }
    return false;
}

const User = mongoose.model('User',userSchema);

module.exports = User;