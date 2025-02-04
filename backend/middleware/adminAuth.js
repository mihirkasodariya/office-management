const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.header("Authorization");

  // Check if the header exists
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token, authorization denied" });
  }

  // Remove "Bearer " from the header to extract the token
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded token (which contains the admin info) to the request
    req.admin = decoded;
    
    // Continue to the next middleware or route
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token is not valid" });
  }
};

module.exports = adminAuth;
