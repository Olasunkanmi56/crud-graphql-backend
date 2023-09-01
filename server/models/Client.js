const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ClientSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },  
});

//Export the model
module.exports = mongoose.model('Client', ClientSchema);