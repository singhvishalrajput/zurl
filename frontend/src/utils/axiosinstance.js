import axios from 'axios'

// Use environment variable or fallback to localhost for development
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL,
    timeout : 10000,
    withCredentials: true, // Important for cookies
})

export default axiosInstance;