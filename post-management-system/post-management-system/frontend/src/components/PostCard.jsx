
import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import UpdatePosts from '../pages/UpdatePosts';

export default function PostCard({ post, onChange }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isMyPosts = location.pathname.toLowerCase().includes('myposts');
    console.log('Locatiohihiustate:', post, user, location, location.state, isMyPosts); // Log the location state for debugging
    const [busy, setBusy] = useState(false);
    const [viewCount, setViewCount] = useState(post.viewedBy?.length || 0);

    const userId = user?._id || user?.id;

    // Check whether current user liked the post
    const liked = post.likes?.some(
        id => String(id) === String(userId)
    );

    // Check whether current user can delete the post
    const canManage =
        user?.role === 'admin' ||
        String(post?.author?._id) === String(userId);

    // Record post view
    useEffect(() => {
        console.log('Current pathname:', location.pathname);
        console.log('Post ID:', post._id);

        if (location.pathname === '/myposts') {
            console.log('My Posts page: View API skipped');
            return;
        }
        let active = true;

        const recordView = async () => {
            try {
                const response = await api.post(`/posts/${post._id}/view`);

                if (active) {
                    setViewCount(response.data.data.viewsCount);
                }
            } catch (error) {
                console.error('Unable to record view:', error);
            }
        };

        recordView();

        return () => {
            active = false;
        };
    }, [post._id, location.pathname]);

    // Like post
    const handleLike = async () => {
        try {
            setBusy(true);
            await api.post(`/posts/${post._id}/like`);
            onChange();
        } catch (error) {
            alert(error.response?.data?.message || 'Unable to like post');
        } finally {
            setBusy(false);
        }
    };

    // Delete post
    const handleDelete = async () => {
        if (!window.confirm('Delete this post?')) return;

        try {
            await api.delete(`/posts/${post?._id}`);
            onChange();
        } catch (error) {
            alert(error.response?.data?.message || 'Unable to delete post');
        }
    };
    const handleUpdate = async () => {
        try {
            navigate(`/updateposts`, { state: { post } });
        } catch (error) {
            alert(error.response?.data?.message || 'Update failed');
        }
    };

    return (
        <article className="post-card">
            {/* <UpdatePosts post={post} /> */}
            <div className="post-head">
                <div className="avatar avatar-small">
                    {post.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <div className="post-author">
                    {/* <strong>{post.author?.name || 'User'}</strong> */}
                    {user._id == post.author?._id ? "Me" : <strong>{post.title}</strong>}

                    <small>
                        {new Date(post.createdAt).toLocaleString()}
                    </small>
                </div>

                {canManage && user?.role === 'user' && (
                    <>
                        <button
                            className="text-button danger-text"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                        <button
                            className="text-button danger-text"
                            onClick={handleUpdate}
                        >
                            Update
                        </button>
                    </>
                )}
            </div>

            {/* Post content */}
            <h3>{post.title}</h3>
            <p className="post-description">{post.description}</p>

            {/* Post images */}
            {post?.images?.length > 0 && (
                <div className="post-images">
                    {post.images.map((image, index) => {
                        const imageUrl = `http://localhost:8000/uploads/${image}`;

                        console.log('Image value:', image);
                        console.log('Image URL:', imageUrl);

                        return (
                            <img
                                key={index}
                                src={imageUrl}
                                alt={`Post image ${index + 1}`}

                                className="post-image"
                                onClick={() => window.open(imageUrl, '_blank')}

                                onError={() => console.log('Image loading failed:', imageUrl)}
                            />
                        );
                    })}
                </div>
            )}

            {/* Post actions */}
            <div className="post-actions">
                <button
                    className={liked ? 'like-button liked' : 'like-button'}
                    disabled={busy}
                    onClick={handleLike}
                >
                    {liked ? '♥ Liked' : '♡ Like'}
                    <span>{post.likes?.length || 0}</span>
                </button>

                <span className="post-stat">
                    ◉ {viewCount} views
                </span>
            </div>

        </article>
    );
}
