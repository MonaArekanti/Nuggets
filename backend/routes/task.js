
const express = require("express");
const mongoose = require("mongoose");
const taskModel = require("../models/task");
const projectModel = require("../models/project");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Create a task inside a project
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, projectID } = req.body;

    if (!name || !projectID) {
      return res.status(400).json({
        success: false,
        message: "Task name and project ID are required"
      });
    }

    if (!mongoose.isValidObjectId(projectID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID"
      });
    }

    const project = await projectModel.findOne({
      _id: projectID,
      userID: req.userId
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const newTask = new taskModel({
      name,
      projectID
    });

    await newTask.save();

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating task"
    });
  }
});

// Get tasks belonging to one of the user's projects
router.get("/project/:projectID", authenticateToken, async (req, res) => {
  try {
    const { projectID } = req.params;

    if (!mongoose.isValidObjectId(projectID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID"
      });
    }

    const project = await projectModel.findOne({
      _id: projectID,
      userID: req.userId
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const tasks = await taskModel.find({ projectID });

    return res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching tasks"
    });
  }
});

// Update a task's name or status
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    if (name === undefined && status === undefined) {
      return res.status(400).json({
        success: false,
        message: "Provide a task name or status to update"
      });
    }

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return res.status(400).json({
        success: false,
        message: "Task name cannot be empty"
      });
    }

    const updates = {};

    if (name !== undefined) updates.name = name.trim();

    if (status !== undefined) {
      if (!["pending", "in progress", "completed"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status"
        });
      }

      updates.status = status;
    }

    const task = await taskModel.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const project = await projectModel.findOne({
      _id: task.projectID,
      userID: req.userId
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating task"
    });
  }
});

// Delete a task
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    const task = await taskModel.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const project = await projectModel.findOne({
      _id: task.projectID,
      userID: req.userId
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    await taskModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting task"
    });
  }
});

module.exports = router;
