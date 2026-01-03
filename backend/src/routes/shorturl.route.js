import express from 'express';
import { checkShortUrlAvailability, createShortUrl, getMyUrls } from '../controllers/shorturl.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/", createShortUrl);       
router.get("/my-urls", authMiddleware, getMyUrls);
router.get("/check/:slug", checkShortUrlAvailability);          

export default router;
