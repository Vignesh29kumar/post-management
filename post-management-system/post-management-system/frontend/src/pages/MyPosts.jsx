
import { useEffect, useState } from 'react';
import api from '../api/api';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';

export default function MyPosts() {
    const { user } = useAuth();
    console.log('User data:', user); // Log the user data for debugging
    const [posts, setPosts] = useState([]);
    console.log("posts_Forms", posts);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

    // Get posts
    const loadPosts = async () => {
        try {
            let response = await api.get('/posts', {
                params: { search, page, limit: 10, userId: user?.id }
            })
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

    return (
        <div>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">CONTENT</p>
                    <h1>My Posts</h1>
                </div>
                 <div className="section-toolbar">

                <input
                    className="search-input"
                    placeholder="Search posts..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            </div>
            <div className="posts-list">
                {posts?.length ? (
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
