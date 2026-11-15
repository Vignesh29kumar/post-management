import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '',image:'' });
    console.log('RegisterForm:', form); // Log the form state for debugging
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    console.log('Register form state:', form, register); // Log the form state for debugging
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
        const formData = new FormData();

        formData.append('name', form.name);
        formData.append('email', form.email);
        formData.append('password', form.password);

        if (form.image) {
            formData.append('image', form.image);
        }

        console.log('Submitting registration form:', formData);
        console.log('2. Before register API');

        const data = await register(formData);

        console.log('Registration data:', data.data);

        setSuccess('Account created. You can now sign in.');

        setTimeout(() => navigate('/login'), 900);
    }
    catch (err) {
        console.log('4. API Error:', err, err.response?.data?.message);
        console.log('5. Error Status:', err.response?.status);
        console.log('6. Error Data:', err.response?.data);

        setError(err.response?.data?.message || err.message || 'Registration failed');
    }
    finally {
        setLoading(false);
    }
};
    return(
         <div className="auth-page">
        <div className="auth-card">
            <h1>Create account</h1>
            <form onSubmit={handleSubmit} className="form-stack">
                <label>Full name
                    <input required maxLength="80" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                </label>
                <label>Email address
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                </label>
                <label>Password
                    <input type="password" required minLength="8" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" />
                </label>
                <label>Profile Image
                    <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                </label>
                {error && <div className="alert-error">{error}</div>}
                {success && <div className="alert-success">{success}</div>}
                <button className="primary-button full-button" disabled={loading}>
                    {loading ? 'Creating...' : 'Create account'}
                </button>
            </form>
            <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
        </div>
    </div>)
}
