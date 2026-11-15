import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import api from '../api/api';

export default function UpdateUser() {
    const { id } = useParams();
    const { updateregister } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();// Log the location for debugging
    console.log('Location state in UpdateUser:', location.state); // Log the location state for debugging
    const [form, setForm] = useState({
        name: '',
        image: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                let user = location.state?.currentUser;
                if (user) {
                    setForm({
                        name: user.name || '',
                        image: user.image || '',
                        email: user.email || '',
                    });
                }
            } catch (error) {
                console.error('Unable to load user:', error);
            }
        };

        loadUser();
    }, [location.state]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };

    // Handle image selection
    const handleImageChange = (e) => {
        setForm({
            ...form,
            image: e.target.files[0]
        });
    };
console.log('Form data:', form); // Log the form data for debugging
    // Submit updated post
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const id = location.state?.currentUser?._id || location.state?.currentUser?.id;
            const formData = new FormData();

            formData.append('name', form.name);
            formData.append('image', form.image);
            formData.append('role', location.state?.currentUser?.role || 'user');
            formData.append('id', id || '');

        const data = await updateregister(formData);

            alert('User updated successfully!');
            navigate('/dashboard');
            window.location.reload(); // Reload the page to reflect changes

        } catch (error) {
            console.error(
                error.response?.data?.message || 'Update failed'
            );

            alert(error.response?.data?.message || 'Unable to update post');

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="content">

            <div className="page-heading">
                <div>
                    <h1>Update Post</h1>
                    <p className="muted">Edit your post details</p>
                </div>
            </div>

            <div className="panel">

                <form className="form-stack" onSubmit={handleSubmit}>

                    <label>
                        Name

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter user name"
                            required
                        />
                    </label>

                    <label>
                        Email

                        <input
                            type="text"
                            name="email"
                            value={form.email}
                            placeholder="Enter user email"
                            disabled
                        />
                    </label>

                    {/* Existing images */}

                    <div>
                      <label>  Profile Image </label> 

                        <div className="post-images">

                            <img
                                src={form.image && typeof form.image === 'string' ? `http://localhost:8000/uploads/${form.image}` : form.image ? URL.createObjectURL(form.image) : "No Image"}
                                alt={`Post image 1`}
                                className="post-image"
                            />

                    </div>
            </div>

            <label>
                Select New Images

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                />
            </label>

                <p className="muted">
                    {form?.image ? 1 : 0} new image selected
                </p>

            <div className="form-actions">

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => navigate('/dashboard')}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Submit Update'}
                </button>

            </div>

        </form>

            </div >
        </div >
    );
}