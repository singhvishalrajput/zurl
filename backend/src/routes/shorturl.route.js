import express from 'express';
import { checkShortUrlAvailability, createShortUrl, getMyUrls } from '../controllers/shorturl.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { optionalAuthMiddleware } from '../middleware/optionalAuth.middleware.js';

const router = express.Router();

// Optional auth - extracts user if token exists, but doesn't fail if missing
router.post("/", optionalAuthMiddleware, createShortUrl);       
router.get("/my-urls", authMiddleware, getMyUrls);
router.get("/check/:slug", checkShortUrlAvailability);          

export default router;
