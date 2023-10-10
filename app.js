const express = require('express');
const app = express();
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');

const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use('/api/v1/user',userRouter);
app.use('/api/v1/task',taskRouter);

app.all('*',(req,res,next)=>{
    const err = new Error('Route is not defined 😕 !');
    err.statusCode = 404;
    err.status = 'Fail';
    next(err);
})

//Global Error Handler

app.use((err,req,res,next)=>{
    err.statusCode = err.statusCode || 404;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    })
})

module.exports = app;