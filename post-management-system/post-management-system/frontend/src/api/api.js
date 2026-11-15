import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api'
});

// Get JWT and send it to backend
api.interceptors.request.use((config) => {

    const token = localStorage.getItem('token');

    config.headers.Authorization = `Bearer ${token}`;

    return config;
});

export default api;