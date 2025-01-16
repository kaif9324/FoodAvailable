const mongoose = require('mongoose');
const foodSchema = mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    price:{
        type:String,
        require:true
    }
}) 
const food_Schema= mongoose.model('food_Schema',foodSchema);
module.exports = food_Schema;