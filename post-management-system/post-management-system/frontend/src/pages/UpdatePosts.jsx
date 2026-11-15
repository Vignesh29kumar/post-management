import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../api/api';

export default function UpdatePosts() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();// Log the location for debugging
    const [form, setForm] = useState({
        title: '',
        description: ''
    });

    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load existing post
    useEffect(() => {
        const loadPost = async () => {
            try {
                let post = location.state?.post;

                if (!post) {
                    const response = await api.get(`/posts/${id}`);
                    post = response.data.data;
                }

                setForm({
                    title: post.title || '',
                    description: post.description || ''
                });

                setImages(post.images || []);

            } catch (error) {
                console.error('Unable to load post:', error);
            }
        };

        loadPost();
    }, [id, location.state]);

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
        setSelectedImages(Array.from(e.target.files));
    };

    // Submit updated post
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append('title', form.title);
            formData.append('description', form.description);

            selectedImages.forEach((image) => {
                formData.append('images', image);
            });

            await api.patch(`/posts/${location?.state?.post?._id}`, formData);

            alert('Post updated successfully!');

            navigate('/myposts');

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
                        Title

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter post title"
                            required
                        />
                    </label>

                    <label>
                        Description

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter post description"
                            rows="5"
                            required
                        />
                    </label>

                    {/* Existing images */}
                    {images?.length > 0 && (
                        <div>
                            <p>Existing Images</p>

                            <div className="post-images">
                                {images.map((image, index) => (
                                    <>
                                    <img
                                        key={index}
                                        src={image ? `http://localhost:8000/uploads/${image}` : "No Image"}
                                        alt={`Post image ${index + 1}`}
                                        className="post-image"
                                    />
</>
                                ))}
                            </div>
                        </div>
                    )}

                    <label>
                        Select New Images

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                    </label>

                    {selectedImages.length > 0 && (
                        <p className="muted">
                            {selectedImages.length} new image(s) selected
                        </p>
                    )}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => navigate('/posts')}
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

            </div>
        </div>
    );
}