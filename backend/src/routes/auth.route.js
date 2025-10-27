import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// ✅ Apply Arcjet protection middleware
router.use(arcjetProtection);

// ✅ Authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// ✅ Profile update (protected route)
router.put("/update-profile", protectRoute, updateProfile);

// ✅ Check authentication (session validation)
router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

export default router;
