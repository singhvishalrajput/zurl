
// cookieOptions

export const cookieOptions = {
    httpOnly : true,
    secure : process.env.NODE_ENV === 'production', // only send cookie over https
    sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site cookies in production
    maxAge : 1000 * 60 * 60 * 24, // 1 day
    path : '/',
};