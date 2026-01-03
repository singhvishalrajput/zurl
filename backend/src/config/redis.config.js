import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient = null;

export const connectRedis = async () => {
    // If already connected, return existing client
    if (redisClient && redisClient.status === 'ready') {
        console.log('Using existing Redis connection');
        return redisClient;
    }

    try {
        redisClient = new Redis(process.env.REDIS_URL, {
            maxRetriesPerRequest: 3,
            enableOfflineQueue: false, // Important for serverless
            connectTimeout: 5000, // 5 second timeout
            lazyConnect: false,
            retryStrategy(times) {
                if (times > 3) {
                    return null; // Stop retrying after 3 attempts
                }
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            reconnectOnError(err) {
                const targetError = 'READONLY';
                if (err.message.includes(targetError)) {
                    return true;
                }
                return false;
            }
        });

        redisClient.on('connect', () => {
            console.log('Redis connected successfully');
        });

        redisClient.on('error', (err) => {
            console.error('Redis connection error:', err);
        });

        redisClient.on('ready', () => {
            console.log('Redis is ready to use');
        });

        // Test the connection
        await redisClient.ping();
        console.log('Redis PING successful');

        return redisClient;
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        throw error;
    }
};

export const getRedisClient = () => {
    if (!redisClient) {
        throw new Error('Redis client not initialized. Call connectRedis() first.');
    }
    return redisClient;
};

export const closeRedis = async () => {
    if (redisClient) {
        await redisClient.quit();
        console.log('Redis connection closed');
    }
};

export default redisClient;
