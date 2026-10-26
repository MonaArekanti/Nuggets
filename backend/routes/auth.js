const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");

const router = express.Router();

// ==================== SIGN UP ====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    // Check password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    // Check whether the user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });

    // Save the user in MongoDB
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully"
    });

  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate email errors from MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error in registration"
    });
  }
});


// ==================== SIGN IN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find the user in MongoDB
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare the entered password with the stored hash
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Send user details without the password hash

const token = jwt.sign(
  { userId: existingUser._id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);


    return res.status(200).json({
      success: true,
      token: token,
      message: "Login successful",
      data: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Error in login"
    });
  }
});

module.exports = router;

