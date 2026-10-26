
const express = require("express");
const projectModel = require("../models/project");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Create a project
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required"
      });
    }

    const newProject = new projectModel({
      name,
      description,
      userID: req.userId
    });

    await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating project"
    });
  }
});

// Get only the logged-in user's projects
router.get("/", authenticateToken, async (req, res) => {
  try {
    const projects = await projectModel.find({
      userID: req.userId
    });

    return res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching projects"
    });
  }
});

// Delete a project owned by the logged-in user
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedProject = await projectModel.findOneAndDelete({
      _id: req.params.id,
      userID: req.userId
    });

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Delete project error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error deleting project"
    });
  }
});

module.exports = router;
