import { cookieOptions } from "../config/config.js";
import { checkAvailabilityService, loginUserService, registerUserService } from "../services/auth.service.js";
import catchAsync from "../utils/catchasync.js";

export const registerUser = catchAsync(async (req, res)=> {

    const result = await registerUserService(req.body);

    res.cookie('token', result.token, cookieOptions);
    res.status(201).json({
        success : true,
        message : "User registered successfully",
        ...result
    })

})

export const loginUser = catchAsync(async (req, res)=>{
    
    const result = await loginUserService(req.body);

    res.cookie('token', result.token, cookieOptions);
    res.status(200).json({
        success: true,
        message : "User logged in successfully",
        ...result
    })
})

export const logOutUser = catchAsync(async (req, res)=>{
    res.cookie('token', null, {
        httpOnly :  true,
        expires : new Date(Date.now()),
        path : '/',
    })
    res.status(200).json({
        success : true,
        message : "User logged out successfully",
    })
})

export const checkAvailability =  catchAsync(async (req, res)=>{
    const result = await checkAvailabilityService(req.query);

    res.status(200).json({
        success : true,
        ...result
    })
})

export const checkUsernameAvailability = catchAsync(async (req, res) => {
    const { username } = req.params;
    const result = await checkAvailabilityService({ username });
    
    res.status(200).json({
        ...result,
        message: result.available ? "Username is available" : "Username is already taken"
    });
})

export const checkEmailAvailability = catchAsync(async (req, res) => {
    const { email } = req.params;
    const result = await checkAvailabilityService({ email });
    
    res.status(200).json({
        ...result,
        message: result.available ? "Email is available" : "Email is already registered"
    });
})

export const getCurrentUser = catchAsync(async (req, res) => {
    const user = req.user;
    
    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
        }
    });
})
