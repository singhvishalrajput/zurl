import { generateNanoId } from "../utils/helper.js";
import ShortUrl from "../models/shorturl.model.js";
import { shorturlServiceWithoutUser, shorturlServiceWithUser } from "../services/shorturl.service.js";
import { getShortUrl, shortUrlExists, getUserUrls} from '../dao/shorturl.dao.js';
import catchAsync from "../utils/catchasync.js";
import { AppError } from "../utils/errorHandler.js";

export const createShortUrl = catchAsync(async (req, res)=> {
    let {url, slug} = req.body;
    const user = req.user;
    console.log("Create Short URL User :", user);

    if(!url.startsWith('http://') && !url.startsWith('https://')){
        url = `http://${url}`;
    }
    let shortUrl;
    if(user && user.id){
        shortUrl = await shorturlServiceWithUser(url, slug, user.id);
    }else{
        shortUrl = await shorturlServiceWithoutUser(url, slug);
    }
    
    res.status(200).json({shortUrl : shortUrl});
})

export const redirectShortUrl = catchAsync(async (req, res, next) => {

    const {shortUrl} = req.params;
    const shortUrlDoc = await getShortUrl(shortUrl);
    if(shortUrlDoc){
        return res.redirect(shortUrlDoc.fullUrl);
    }else {
        next(new AppError('Short URL not found', 404));
    }
    
})

export const checkShortUrlAvailability = catchAsync(async (req, res)=>{
    const {slug} = req.params;
    const exists = await shortUrlExists(slug);
    const isAvailable = !exists;
    
    console.log(`Checking slug: "${slug}" - ${isAvailable ? 'AVAILABLE' : 'TAKEN'}`);
    
    res.status(200).json({
        message: isAvailable ? "Slug is available" : "Slug is already taken",
        available: isAvailable
    });
})

export const getMyUrls = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { cursor, limit = 10 } = req.query;
    
    // Validate limit (max 100)
    const validLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    
    const result = await getUserUrls(userId, cursor, validLimit);
    
    res.status(200).json({
        urls: result.urls,
        pagination: {
            nextCursor: result.nextCursor,
            hasMore: result.hasMore,
            limit: validLimit
        }
    });
})