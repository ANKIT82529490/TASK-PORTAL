const jwt = require("jsonwebtoken");

 
function requireAuth(req, res, next) {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization || "";

     
    let token = null;


if (authHeader) {
  
  const parts = authHeader.split(" ");

 
  if (parts.length === 2 && parts[0] === "Bearer") {
    token = parts[1];
  }
}

 
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Missing token",
      });
    }

 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

     
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

     
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
    });
  }
}

module.exports = {
  requireAuth,
};
