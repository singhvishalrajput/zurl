import { getRedisClient } from '../config/redis.config.js';

// Cache TTL constants (in seconds)
const CACHE_TTL = {
    URL_REDIRECT: 24 * 60 * 60, // 24 hours
    SLUG_AVAILABILITY: 60 * 60,  // 1 hour
    USER_URLS: 5 * 60            // 5 minutes
};

// Redis key prefixes
const KEYS = {
    URL_REDIRECT: 'url:redirect:',
    SLUG_EXISTS: 'slug:exists:',
    CLICK_COUNT: 'clicks:',
    USER_URLS: 'user:urls:'
};

// Helper to safely get Redis client
const safeGetRedisClient = () => {
    try {
        return getRedisClient();
    } catch (error) {
        // Redis not available, return null
        console.warn('Redis not available:', error.message);
        return null;
    }
};

/**
 * URL Redirect Caching
 */
export const cacheUrlRedirect = async (shortUrl, fullUrl) => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return false;
        
        const key = `${KEYS.URL_REDIRECT}${shortUrl}`;
        await redis.setex(key, CACHE_TTL.URL_REDIRECT, fullUrl);
        console.log(`Cached redirect: ${shortUrl} -> ${fullUrl}`);
        return true;
    } catch (error) {
        console.error('Redis cache error:', error);
        return false;
    }
};

export const getUrlRedirectFromCache = async (shortUrl) => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return null;
        
        const key = `${KEYS.URL_REDIRECT}${shortUrl}`;
        const fullUrl = await redis.get(key);
        
        if (fullUrl) {
            console.log(`Cache HIT for redirect: ${shortUrl}`);
            return fullUrl;
        }
        
        console.log(`Cache MISS for redirect: ${shortUrl}`);
        return null;
    } catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
};

export const invalidateUrlRedirectCache = async (shortUrl) => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return false;
        
        const key = `${KEYS.URL_REDIRECT}${shortUrl}`;
        await redis.del(key);
        console.log(`Invalidated cache for: ${shortUrl}`);
        return true;
    } catch (error) {
        console.error('Redis delete error:', error);
        return false;
    }
};

/**
 * Slug Availability Caching
 */
export const cacheSlugExists = async (slug, exists = true) => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return false;
        
        const key = `${KEYS.SLUG_EXISTS}${slug}`;
        // Store as "1" for exists, "0" for doesn't exist
        await redis.setex(key, CACHE_TTL.SLUG_AVAILABILITY, exists ? '1' : '0');
        console.log(`Cached slug availability: ${slug} = ${exists}`);
        return true;
    } catch (error) {
        console.error('Redis cache error:', error);
        return false;
    }
};

export const getSlugExistsFromCache = async (slug) => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return null;
        
        const key = `${KEYS.SLUG_EXISTS}${slug}`;
        const result = await redis.get(key);
        
        if (result !== null) {
            const exists = result === '1';
            console.log(`Cache HIT for slug: ${slug} = ${exists}`);
            return exists;
        }
        
        console.log(`Cache MISS for slug: ${slug}`);
        return null;
    } catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
};

/**
 * Click Analytics Caching
 */
export const incrementClickCount = async (shortUrl) => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return null;
        
        const key = `${KEYS.CLICK_COUNT}${shortUrl}`;
        const newCount = await redis.incr(key);
        console.log(`Incremented click count for ${shortUrl}: ${newCount}`);
        return newCount;
    } catch (error) {
        console.error('Redis increment error:', error);
        return null;
    }
};

export const getClickCount = async (shortUrl) => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return 0;
        
        const key = `${KEYS.CLICK_COUNT}${shortUrl}`;
        const count = await redis.get(key);
        return count ? parseInt(count, 10) : 0;
    } catch (error) {
        console.error('Redis get error:', error);
        return 0;
    }
};

export const setClickCount = async (shortUrl, count) => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return false;
        
        const key = `${KEYS.CLICK_COUNT}${shortUrl}`;
        await redis.set(key, count);
        console.log(`Set click count for ${shortUrl}: ${count}`);
        return true;
    } catch (error) {
        console.error('Redis set error:', error);
        return false;
    }
};

/**
 * Batch sync click counts to MongoDB
 * Call this periodically (e.g., every 5 minutes)
 */
export const getAllClickCounts = async () => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return {};
        
        const pattern = `${KEYS.CLICK_COUNT}*`;
        const keys = await redis.keys(pattern);
        
        if (keys.length === 0) {
            return {};
        }
        
        const clickCounts = {};
        const pipeline = redis.pipeline();
        
        keys.forEach(key => {
            pipeline.get(key);
        });
        
        const results = await pipeline.exec();
        
        keys.forEach((key, index) => {
            const shortUrl = key.replace(KEYS.CLICK_COUNT, '');
            const count = parseInt(results[index][1], 10) || 0;
            clickCounts[shortUrl] = count;
        });
        
        return clickCounts;
    } catch (error) {
        console.error('Redis getAllClickCounts error:', error);
        return {};
    }
};

export const deleteClickCount = async (shortUrl) => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return false;
        
        const key = `${KEYS.CLICK_COUNT}${shortUrl}`;
        await redis.del(key);
        console.log(`Deleted click count for: ${shortUrl}`);
        return true;
    } catch (error) {
        console.error('Redis delete error:', error);
        return false;
    }
};

/**
 * User URLs Dashboard Caching (Optional - for future use)
 */
export const cacheUserUrls = async (userId, urls, cursor) => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return false;
        
        const key = `${KEYS.USER_URLS}${userId}:${cursor || 'initial'}`;
        await redis.setex(key, CACHE_TTL.USER_URLS, JSON.stringify(urls));
        console.log(`Cached user URLs for: ${userId}`);
        return true;
    } catch (error) {
        console.error('Redis cache error:', error);
        return false;
    }
};

export const getUserUrlsFromCache = async (userId, cursor) => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return null;
        
        const key = `${KEYS.USER_URLS}${userId}:${cursor || 'initial'}`;
        const data = await redis.get(key);
        
        if (data) {
            console.log(`Cache HIT for user URLs: ${userId}`);
            return JSON.parse(data);
        }
        
        console.log(`Cache MISS for user URLs: ${userId}`);
        return null;
    } catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
};

export const invalidateUserUrlsCache = async (userId) => {
    try {
        const redis = safeGetRedisClient();
        if (!redis) return false;
        
        const pattern = `${KEYS.USER_URLS}${userId}:*`;
        const keys = await redis.keys(pattern);
        
        if (keys.length > 0) {
            await redis.del(...keys);
            console.log(`Invalidated user URLs cache for: ${userId}`);
        }
        return true;
    } catch (error) {
        console.error('Redis delete error:', error);
        return false;
    }
};

/**
 * Health check
 */
export const redisHealthCheck = async () => {
    try {
        const redis = getRedisClient();
        const result = await redis.ping();
        return result === 'PONG';
    } catch (error) {
        console.error('Redis health check failed:', error);
        return false;
    }
};
