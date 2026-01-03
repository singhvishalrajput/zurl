import express from 'express';
const app = express();
import {nanoid} from 'nanoid';
import dotenv from 'dotenv';
import connectDB from "./src/config/mongo.config.js";
import { connectRedis } from './src/config/redis.config.js';
import { startClickCountSyncJob } from './src/utils/clickSyncJob.js';
import ShortUrl from './src/models/shorturl.model.js';
import shorturlRouter from './src/routes/shorturl.route.js';
import authRoute from './src/routes/auth.routes.js';
import { redirectShortUrl } from './src/controllers/shorturl.controller.js';
import { AppError, globalErrorHandler } from './src/utils/errorHandler.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './src/middleware/auth.middleware.js';

// Load environment variables
dotenv.config({path : './.env'});

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : ['http://localhost:5174'];

console.log('Allowed CORS origins:', allowedOrigins);
console.log('NODE_ENV:', process.env.NODE_ENV);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.some(allowedOrigin => 
            origin === allowedOrigin || origin.endsWith(allowedOrigin)
        )) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.get('/', (req, res)=> {
    res.send("Server is up and running")
})

// Public routes (no authentication required)
app.use('/api/auth', authRoute);
app.use('/api/create', shorturlRouter);
app.get('/:shortUrl', redirectShortUrl);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.url}`, 404));
})

app.use(globalErrorHandler)

// Initialize connections
const initializeApp = async () => {
    try {
        await connectDB();
        // Only start Redis and background jobs in non-serverless environment
        if (process.env.NODE_ENV !== 'production') {
            await connectRedis();
            // Start background job to sync click counts every 5 minutes
            startClickCountSyncJob(5);
        } else {
            // In serverless (Vercel), try to connect Redis but don't fail if it's not available
            try {
                await connectRedis();
            } catch (error) {
                console.warn('Redis connection failed in serverless environment:', error.message);
                console.warn('Continuing without Redis cache...');
            }
        }
    } catch (error) {
        console.error('Failed to initialize app:', error);
        throw error;
    }
};

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, async () => {
        await initializeApp();
        console.log(`Server is running on http://localhost:${PORT}`);
    });
} else {
    // Initialize for serverless (Vercel) - connections will be reused across requests
    initializeApp().catch(err => {
        console.error('Failed to initialize serverless app:', err);
    });
}

// Export for Vercel
export default app;

