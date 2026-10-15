// const express = require("express");
// const mongoose = require("mongoose");   
// const bycrypt = require("bcrypt");
// const userModel = require("../models/user");
// const router = express.Router();

// router.post("/register", async(req,res) => {
//     try{
//         const {name, email, password} = req.body;
//         const existingUser = await user.findOne({email});
//         if(existingUser){
//             return res.status(200).json({message: "User already exists", success: false});
//         }
//         const hashedPassword = await bycrypt.hash(password, 10);
//         const newUser = new userModel({name, email, password: hashedPassword});
//         await newUser.save();
//         res.status(201).json({message: "User created successfully", success: true});
//     }

//     catch(error){
//         console.log(error);
//         res.status(500).json({message: "Error in registeration", success: false});
//     }
// });


// router.post("/login", async(req,res) => {
//     try{
//         const {email, password} = req.body;
//         const user = await user.findOne({email});
//         if(!user){
//             return res.status(200).json({message: "User does not exist", success: false});
//         }

//         const isPasswordValid = await bycrypt.compare(password, user.password);
//         if(!isPasswordValid){
//             return res.status(200).json({message: "Invalid email or password", success: false});
//         }   

//         res.status(200).json({message: "Login successful", success: true, data: user});
//     }

//     catch(error){
//         console.log(error);
//         res.status(500).json({message: "Error in login", success: false});
//     }               
// });

// module.exports = router;



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
    return res.status(200).json({
      success: true,
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

