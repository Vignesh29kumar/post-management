import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form);
            navigate('/');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Email does not exist, Please register first.');
        }
        finally {

            setLoading(false);
        }
    };

    return(
<div className="auth-page">
        <div className="auth-card">
            <h1>Welcome back</h1>
            <form onSubmit={handleSubmit} className="form-stack">
                <label>Email address
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                </label>
                <label>Password
                    <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />
                </label>
                {error && <div className="alert-error">{error}</div>}
                <button className="primary-button full-button" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>
            <p className="auth-footer">Register here? <Link to="/register">Create an account</Link></p>
        </div>
    </div>
    )
    
}
