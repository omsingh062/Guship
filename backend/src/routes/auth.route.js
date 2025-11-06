import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// Arcjet protection middleware
router.use(arcjetProtection);

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Profile update
router.put("/update-profile", protectRoute, updateProfile);

// Check logged-in user
router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

export default router;
