const mongoose = require('mongoose'); // Import mongoose
 
const mongoURL = process.env.MONGO_URL // MongoDB connection URL  

mongoose.connect(mongoURL,{  // Connect to MongoDB
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const db = mongoose.connection; // Get the connection object
  // Event listeners:
db.on('connected',()=>{
    console.log('database connected')
})
db.on('disconnected',()=>{
    console.log('database disconnected')
})
db.on('error',(error)=>{
    console.log('error',error)
})


module.exports=db