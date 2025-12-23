import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log('Received Token:', token); 
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded); 

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        console.log('User not found for ID:', decoded.id);
        return res.status(401).json({ message: "User not found" });
      }
      console.log('Authenticated User:', req.user); 
      next();
    } catch (error) {
      console.log('Token Verification Error:', error.message); 
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    console.log('No token provided in headers'); 
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({ message: "User not authenticated" }); 
    }
    if (!roles.includes(req.user.role)) {
      console.log('Unauthorized role:', req.user.role, 'Required roles:', roles); 
      return res.status(403).json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
};

export { protect, authorize };