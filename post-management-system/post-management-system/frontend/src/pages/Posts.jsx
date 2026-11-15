
import { useEffect, useState } from 'react';
import api from '../api/api';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function Posts() {
    const { user } = useAuth();
    const location = useLocation();
    console.log('Location state:', location,location.state, user); // Log the location state for debugging
    const userId = location?.state?.userId !== undefined ? location.state.userId : null;
    console.log('User data:', userId); // Log the user data for debugging
    const [posts, setPosts] = useState([]);
    console.log("posts_Forms", posts);
    const [form, setForm] = useState({ title: '', description: '' });
    const [images, setImages] = useState([]);
    console.log("images", images);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

    // Get posts
    const loadPosts = async () => {
        try {
            let response = (userId !== null || location?.state?.role === "user") ? await api.get('/posts', {
                params: { search, page, limit: 10, userId: userId }
            }) : await api.get('/posts', {
                params: { search, page, limit: 10 }
            });
            // response = await api.get('/posts', {
            //     params: { search, limit: 30, userId: userId }
            // });
            console.log('Posts response:', response.data); // Log the response for debugging
            setPosts(response.data.data.posts);
            setPagination(response.data.data);
        } catch (err) {
            setError('Unable to load posts');
        }
    };

    useEffect(() => {
        const timer = setTimeout(loadPosts, 250);

        return () => clearTimeout(timer);
    }, [search, page]);

    // Create post
    const createPost = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const formData = new FormData();

            formData.append('title', form.title);
            formData.append('description', form.description);

            // Add images
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }

            await api.post('/posts', formData);

            setForm({ title: '', description: '' });
            setImages([]);

            e.target.reset();

            await loadPosts();

        } catch (err) {
            setError(err.response?.data?.message || 'Unable to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">CONTENT</p>
                    <h1>Posts</h1>
                </div>
            </div>

            {user?.role === "user" && (
                <section className="create-panel panel">
                    <h2>Create a post</h2>

                    <form onSubmit={createPost} className="form-stack">

                        <input
                            required
                            maxLength="140"
                            placeholder="Post title"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />

                        <textarea
                            required
                            maxLength="5000"
                            rows="3"
                            placeholder="What's on your mind?"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />

                        {/* Image upload */}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={e => setImages(Array.from(e.target.files))}
                        />

                        {error && <div className="alert-error">{error}</div>}

                        <div className="form-actions">

                            <button className="primary-button" disabled={loading}>
                                {loading ? 'Publishing...' : '＋ Publish post'}
                            </button>
                        </div>

                    </form>
                </section>)}

            <div className="section-toolbar">
                <h2>Latest posts</h2>

                <input
                    className="search-input"
                    placeholder="Search posts..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="posts-list">
                {posts.length ? (
                    posts.map(post => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onChange={loadPosts}
                        />
                    ))
                ) : (
                    <div className="panel empty-state">
                        No posts found. Be the first to publish something.
                    </div>
                )}
            </div>
            <div className="pagination">
                <span>Page {page} of {Math.max(1, pagination.totalPages)}</span>
                <div>
                    <button className="secondary-button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                        Previous
                    </button>
                    <button className="secondary-button" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
