
const mongoose = require("mongoose");

const taskschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "in progress", "completed"],
        default: "pending"
    },
    projectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true
    }
});

const task = mongoose.model("task", taskschema);
module.exports = task;
