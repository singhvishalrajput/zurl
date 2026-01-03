import User from "../models/user.model.js";

export const findUserByEmail = async (email, includePassword = false) => {
    const query = User.findOne({email : email});
    if(includePassword){
        query.select('+password');
    }
    return await query;
}

export const findUserByEmailOrUsername = async(username, email ) =>{
    const query = await User.findOne({
        $or : [
            {username : username},
            {email : email},
        ]
    })
    return query;
}

export const createUser = async (userData) => {
    const newUser = await User.create(userData);
    return newUser; 
}

export const checkUsernameExists  = async (username) => {
    return await User.exists({username : username});
}

export const checkEmailExists  = async (email) => {
    return await User.exists({ email : email});
}

export const findUserById = async (userId) => {
    return await User.findById(userId);
}