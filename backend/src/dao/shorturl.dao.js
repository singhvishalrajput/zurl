import ShortUrl from '../models/shorturl.model.js';
import { 
    cacheUrlRedirect, 
    getUrlRedirectFromCache, 
    cacheSlugExists, 
    getSlugExistsFromCache,
    incrementClickCount,
    invalidateUserUrlsCache,
    setClickCount
} from '../services/redis.service.js';

export const saveShortUrl = async (fullurl, shorturl, userId) => {
    const newShortUrl = new ShortUrl ({
        fullUrl : fullurl,
        shortUrl : shorturl,
    })
    if(userId){
        newShortUrl.userId = userId;
    }
    await newShortUrl.save();

    // Cache the new URL redirect
    await cacheUrlRedirect(shorturl, fullurl);
    
    // Cache that this slug exists
    await cacheSlugExists(shorturl, true);
    
    // Initialize click count in Redis
    await setClickCount(shorturl, 0);
    
    // Invalidate user's URL cache if they have one
    if (userId) {
        await invalidateUserUrlsCache(userId);
    }

    return newShortUrl;
}

export const getShortUrl = async (shortUrl) => {
    // Try to get from cache first
    const cachedFullUrl = await getUrlRedirectFromCache(shortUrl);
    
    if (cachedFullUrl) {
        // Increment click count in Redis (async, don't wait)
        incrementClickCount(shortUrl);
        
        return {
            fullUrl: cachedFullUrl,
            shortUrl: shortUrl
        };
    }

    // Cache miss - get from database
    const shortUrlDoc = await ShortUrl.findOne({shortUrl : shortUrl});
    
    if(shortUrlDoc){
        // Cache the URL for future requests
        await cacheUrlRedirect(shortUrl, shortUrlDoc.fullUrl);
        
        // Set initial click count in Redis from DB
        await setClickCount(shortUrl, shortUrlDoc.clicks);
        
        // Increment click count in Redis
        await incrementClickCount(shortUrl);
        
        // Also increment in DB (you can make this async or batch it)
        ShortUrl.findOneAndUpdate(
            {shortUrl : shortUrl}, 
            {$inc : {clicks : 1}}
        ).exec(); // Fire and forget
        
        return shortUrlDoc;
    }
    
    return null;
}

export const shortUrlExists = async (shortUrl) => {
    // Try to get from cache first
    const cachedExists = await getSlugExistsFromCache(shortUrl);
    
    if (cachedExists !== null) {
        return cachedExists;
    }
    
    // Cache miss - check database
    const exists = await ShortUrl.exists({shortUrl : shortUrl});
    
    // Cache the result
    await cacheSlugExists(shortUrl, !!exists);
    
    return exists;
}

export const getUserUrls = async (userId, cursor = null, limit = 10) => {
    const query = { userId: userId };
    
    // If cursor exists, fetch records created before the cursor timestamp
    if (cursor) {
        query.createdAt = { $lt: new Date(cursor) };
    }
    
    const urls = await ShortUrl.find(query)
        .sort({ createdAt: -1 })
        .limit(limit + 1)  // Fetch one extra to check if there's more
        .select('fullUrl shortUrl clicks createdAt')
        .lean();
    
    // Check if there are more results
    const hasMore = urls.length > limit;
    const results = hasMore ? urls.slice(0, limit) : urls;
    
    // Get next cursor (last item's createdAt)
    const nextCursor = hasMore && results.length > 0 
        ? results[results.length - 1].createdAt.toISOString() 
        : null;
    
    return { urls: results, nextCursor, hasMore };
}