const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

//Creating Connection to cluster

mongoose.connect(process.env.DATABASE_URL,{
    ssl:true,
    tlsAllowInvalidCertificates:false
})
.then(()=>console.log('BD connection Succesfull ✅'))
.catch((err)=> console.log('DB connection Failed 😔'));


//Starting the server with the PORT number 4000 else 5000

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});