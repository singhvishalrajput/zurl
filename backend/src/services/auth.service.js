import bcrypt from 'bcrypt';
import { findUserByEmail, findUserByEmailOrUsername, createUser, checkUsernameExists, checkEmailExists } from '../dao/auth.dao.js';
import {generateToken} from "../utils/generatetoken.js";

export const registerUserService  = async ({username, email, password}) => {
    
    if(!username || !email || !password){
        throw new Error("All fields are required");
    }

    const existingUser = await findUserByEmailOrUsername(username, email);
    if(existingUser){
        throw new Error("User already existing");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await createUser({
        username,
        email,
        password : hashedPassword,
    })

    const token = generateToken(user._id);

    return {
        token,
        user : {
            id : user._id,
            username : user.username,
            email : user.email,
            avatar : user.avatar,
        }
    }

}

export const loginUserService = async ({email, password}) => {
    if(!email || !password){
        throw new Error("All fields are required");
    }

    const user = await findUserByEmail(email, true);

    console.log("User found :", user);
    if(!user){
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id);

    return {
        token,
        user : {
            id : user._id,
            username : user.username,
            email : user.email,
            avatar : user.avatar,
        }
    }
}

export const checkAvailabilityService = async ({username, email}) => {
    if(username){
        const exists = await checkUsernameExists(username);
        return {
            field : "username",
            available : !exists
        }
    }
    if(email){
        const exists =  await checkEmailExists(email);
        return {
            field : "email",
            available : !exists
        }
    }
    throw new Error("No field to check availability");
}
