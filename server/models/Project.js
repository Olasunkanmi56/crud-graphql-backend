const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ProjectSchema = new mongoose.Schema({
    name:{
        type:String,
        requierd: true,
    },
    description:{
        type:String,
        requierd: true,
    },
    status:{
        type:String,
        enum: ["Not Started", "In Progress", "Completed"]
    },  
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    }
});

//Export the model
module.exports = mongoose.model('Project', ProjectSchema);