import express from 'express';
import { checkAvailability, loginUser, logOutUser, registerUser, checkUsernameAvailability, checkEmailAvailability, getCurrentUser } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logOutUser);
router.post("/check-availability", checkAvailability);

// New routes for real-time validation
router.get("/check/username/:username", checkUsernameAvailability);
router.get("/check/email/:email", checkEmailAvailability);
router.get("/me", authMiddleware, getCurrentUser);

export default router;