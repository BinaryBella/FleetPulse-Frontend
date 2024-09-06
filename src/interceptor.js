// api.js
import axios from 'axios';

// Create a function to get the auth token
const getAuthToken = () => localStorage.getItem('Token');

// Create the Axios instance
const createAxiosInstance = (baseURL) => {
    const instance = axios.create({
        baseURL: baseURL || 'https://localhost:7265api/', // Use provided baseURL or default
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config) => {
            const token = getAuthToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                // Handle unauthorized error (e.g., redirect to login)
                // You might want to refresh the token here if you have a refresh mechanism
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

// Create a default instance
const axiosApi = createAxiosInstance();

export { createAxiosInstance, axiosApi };
