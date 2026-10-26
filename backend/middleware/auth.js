
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // Get the token sent with the request
  const authHeader = req.headers.authorization;

  // Check whether the token was sent
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token missing. Please log in."
    });
  }

  // Extract the token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using our secret
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Save the verified user's ID for the next handler
    req.userId = decoded.userId;

    // Allow the request to continue
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

module.exports = authenticateToken;
