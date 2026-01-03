import ShortUrl from '../models/shorturl.model.js';
import { getAllClickCounts, deleteClickCount } from '../services/redis.service.js';

/**
 * Sync click counts from Redis to MongoDB
 * This should be called periodically (e.g., every 5 minutes)
 */
export const syncClickCountsToMongoDB = async () => {
    try {
        console.log('Starting click count sync from Redis to MongoDB...');
        
        const clickCounts = await getAllClickCounts();
        const shortUrls = Object.keys(clickCounts);
        
        if (shortUrls.length === 0) {
            console.log('No click counts to sync');
            return { synced: 0, failed: 0 };
        }
        
        let synced = 0;
        let failed = 0;
        
        // Batch update all URLs
        for (const shortUrl of shortUrls) {
            const redisClicks = clickCounts[shortUrl];
            
            try {
                // Get current DB clicks
                const doc = await ShortUrl.findOne({ shortUrl });
                
                if (doc) {
                    const dbClicks = doc.clicks;
                    const clicksToAdd = redisClicks - dbClicks;
                    
                    if (clicksToAdd > 0) {
                        // Update MongoDB with the difference
                        await ShortUrl.findOneAndUpdate(
                            { shortUrl },
                            { $inc: { clicks: clicksToAdd } }
                        );
                        
                        console.log(`Synced ${shortUrl}: +${clicksToAdd} clicks (DB: ${dbClicks} -> ${redisClicks})`);
                        synced++;
                    }
                } else {
                    console.warn(`URL not found in DB: ${shortUrl}`);
                    // Clean up Redis entry for non-existent URL
                    await deleteClickCount(shortUrl);
                }
            } catch (error) {
                console.error(`Failed to sync ${shortUrl}:`, error);
                failed++;
            }
        }
        
        console.log(`Click count sync completed: ${synced} synced, ${failed} failed`);
        return { synced, failed };
        
    } catch (error) {
        console.error('Click count sync error:', error);
        return { synced: 0, failed: 0 };
    }
};

/**
 * Start periodic sync job
 */
export const startClickCountSyncJob = (intervalMinutes = 5) => {
    const intervalMs = intervalMinutes * 60 * 1000;
    
    console.log(`🚀 Starting click count sync job (every ${intervalMinutes} minutes)`);
    
    // Run immediately on startup
    syncClickCountsToMongoDB();
    
    // Then run periodically
    setInterval(() => {
        syncClickCountsToMongoDB();
    }, intervalMs);
};
