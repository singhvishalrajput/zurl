import axiosInstance from "../utils/axiosinstance";

export const signup = async (userData) => {
    const { data } = await axiosInstance.post('/api/auth/register', userData);
    return data;
}

export const login = async (credentials) => {
    const { data } = await axiosInstance.post('/api/auth/login', credentials);
    return data;
}

export const logout = async () => {
    const { data } = await axiosInstance.get('/api/auth/logout');
    return data;
}

export const getCurrentUser = async () => {
    const { data } = await axiosInstance.get('/api/auth/me');
    return data;
}

export const checkUsernameAvailability = async (username) => {
    const { data } = await axiosInstance.get(`/api/auth/check/username/${username}`);
    return data;
}

export const checkEmailAvailability = async (email) => {
    const { data } = await axiosInstance.get(`/api/auth/check/email/${email}`);
    return data;
}