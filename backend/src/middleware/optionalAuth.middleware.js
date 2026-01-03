import { verifyToken } from "../utils/verifytoken.js";
import User from "../models/user.model.js";

/**
 * Optional authentication middleware
 * Extracts user from token if present, but doesn't fail if missing
 * Sets req.user if token is valid, otherwise leaves it undefined
 */
export const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        // If no token, continue without user
        if (!token) {
            req.user = null;
            return next();
        }

        // Verify token
        const decoded = verifyToken(token);
        
        // Get user from database
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            req.user = null;
            return next();
        }

        req.user = user;
        next();
    } catch (error) {
        // If token is invalid or expired, continue without user
        console.log('Optional auth failed:', error.message);
        req.user = null;
        next();
    }
};
