import { findUserById } from "../dao/auth.dao.js";
import { verifyToken } from "../utils/verifytoken.js";


export const authMiddleware = async (req, res, next) => {

    const token  = req.cookies?.token
    console.log("Auth Middleware Token :", token); 

    if(!token) return res.status(401).json({message : "Unauthorized"});

    try {
        const decoded = verifyToken(token);
        const user = await findUserById(decoded.id);

        if(!user){
            return res.status(401).json({message : "Unauthorized"});
        }
        req.user = user;
        next();
        
    }catch(err){
        return res.status(401).json({message : "Unauthorized"});
    }

}