
const express = require("express");
const projectModel = require("../models/project");
const taskModel = require("../models/task");
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
    const projects = await projectModel
      .find({ userID: req.userId })
      .sort({ _id: 1 });

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

// Rename and/or pin a project owned by the logged-in user
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const { name, pinned } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ success: false, message: "Project name cannot be empty" });
      }
      updates.name = name.trim();
    }

    if (pinned !== undefined) {
      if (typeof pinned !== "boolean") {
        return res.status(400).json({ success: false, message: "pinned must be true or false" });
      }
      updates.pinned = pinned;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    const project = await projectModel.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({ success: true, message: "Project updated successfully", data: project });
  } catch (error) {
    console.error("Update project error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    return res.status(500).json({ success: false, message: "Error updating project" });
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

    // Remove the project's tasks so none are left orphaned
    await taskModel.deleteMany({ projectID: deletedProject._id });

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
