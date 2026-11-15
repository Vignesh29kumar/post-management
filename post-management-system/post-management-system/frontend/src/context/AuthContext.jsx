import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getCurrentUser = async () => {
        try {
            const response = await api.get('/auth/me');
            console.log('Current user response:', response.data); // Log the response for debugging
            setUser(response.data.data);
        }
        catch (error) {
            setUser(null);
        }

        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getCurrentUser();
    }, []);

    const login = async (formData) => {
        const response = await api.post('/auth/login', formData);
        console.log('Login response:', response.data); // Log the response for debugging
        const { token, ...userData } = response.data.data;

        localStorage.setItem('token', token);
        setUser(userData);
        return response.data;
    };
    const register = async (formData) => {
        console.log('API function started', formData, api);

        const response = await api.post('/auth/register', formData);

        console.log('API function completed:', response.status);

        return response;
    };
    const updateregister = async (formData) => {
        console.log('API function started', formData, api);

        const response = await api.post('/users/updateuser', formData);

        console.log('API function completed:', response.status);

        return response;
    };
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        }
        finally {
            setUser(null);
        }
    };
    return <AuthContext.Provider value={{ user, loading, login, register, updateregister, logout, refreshUser: getCurrentUser }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
