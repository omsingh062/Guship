// backend/src/routes/authRoutes.js
import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// Apply Arcjet protection middleware to all routes in this router
router.use(arcjetProtection);

// Public routes
router.post("/signup", signup);  // Register a new user
router.post("/login", login);    // Login user
router.post("/logout", logout);  // Logout user

// Protected routes (requires authentication)
router.put("/update-profile", protectRoute, updateProfile);  // Update user profile
router.get("/check", protectRoute, (req, res) => {
  // Returns the current logged-in user
  res.status(200).json(req.user);
});

export default router;
