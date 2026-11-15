
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Users from './pages/Users';
import MyPosts from './pages/MyPosts';
import UpdatePosts from './pages/UpdatePosts';
import UpdateUser from './pages/UpdateUser';
// import UsersPostLists from './pages/Users';

import './styles/global.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* Public pages */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* <Route path="/userpostlists" element={<UserPostLists />} /> */}

                    {/* Protected pages */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>

                            <Route path="/" element={<Dashboard />} />
                            <Route path="/posts" element={<Posts />} />
                            <Route path="/myposts" element={<MyPosts />} />
                            <Route path="/updateposts" element={<UpdatePosts />} />
                            <Route path="/updateuser" element={<UpdateUser />} />


                            {/* Admin page */}
                            <Route element={<ProtectedRoute adminOnly />}>
                                <Route path="/users" element={<Users />} />
                            </Route>

                        </Route>
                    </Route>

                    {/* Invalid URL */}
                    <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
