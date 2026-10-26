const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const authRoute = require("./routes/auth");
const projectRoute = require("./routes/project");
const taskRoute = require("./routes/task");



const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/projects", projectRoute);
app.use("api/tasks", taskRoute);
require("dotenv").config();

// MOngoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(async() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });


app.use("/api/auth", authRoute);




  
