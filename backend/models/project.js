const mongoose = require("mongoose");

const projectschema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }       
});

const project = new mongoose.model("project",projectschema);
module.exports = project;