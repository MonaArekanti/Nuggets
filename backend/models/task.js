const mongoose = require("mongoose");

const taskschema = new mongoose.connect.Schema({
    name: {
        type: String,
        required: true              
    },
    status: {
        type: String,
        enum: ["pending", "in progress", "completed"],  
    },
    projectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true
    }     
});

const task = new mongoose.model("task", taskschema);
module.exports = task;


