import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
    const [data, setData] = useState({ postCount: 0, likes: 0, views: 0, topPosts: [], recentPosts: [] });
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    console.log('Location state in Dashboard:', location.state); // Log the location state for debugging
    const { user } = useAuth();
    const loadAnalytics = async () => {
         try {
             const response = await api.get('/analytics');
              setData(response?.data?.data); 
            
            }
             catch (error) {
                 console.error(error); 
                } finally {
                     setLoading(false); 
                    } 
                };
    useEffect(() => {
         loadAnalytics(); 
        }, []);
    const maxLikes = Math.max(1, ...data.topPosts.map(post => post.likes?.length || 0));
    if (loading)
         return <div className="page-loader">Loading analytics...</div>;
    return (
    <div>
        <div className="page-heading">
            <div>
                <p className="eyebrow">Welcome</p>
                <h1>{user?.role === 'admin' ? 'Admin dashboard' : 'Your dashboard'}</h1>
                </div>
                </div>
        <section className="stats-grid">
            <div className="stat-card">
           
                <span>Total posts</span>
                <strong>{data.postCount}</strong>
                <small>Published posts</small>
                </div>
                <div className="stat-card">
               
                    <span>Total likes</span>
                    <strong>{data.likes}</strong>
                    <small>Likes received</small>
                </div>
                <div className="stat-card">
                    
                    <span>Total views</span>
                    <strong>{data.views}</strong>
                    <small>Unique viewers per post</small>
                </div>
            </section>
        <section className="dashboard-grid">
            <div className="panel">
                <div className="panel-heading">
                    <div>
                        <h2>Top performing posts</h2>
                        <p className="muted">Ranked by total likes</p>
                    </div>
                </div>
                {data && data?.topPosts?.length ? (
                    <div className="chart-list">
                        {data.topPosts.map(post => (
                            <div className="chart-row" key={post._id}>
                                <div className="chart-label" title={post.title}>
                                    {post.title}
                                </div>
                                <div className="bar-track">
                                    <div
                                        className="bar-fill"
                                        style={{ width: `${(post.likes.length / maxLikes) * 100}%` }}
                                    />
                                </div>
                                <strong>{post.likes.length}</strong>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">No post analytics yet. Create your first post.</div>
                )}
            </div>
            <div className="panel">
                <div className="panel-heading">
                    <div>
                        <h2>Recent posts</h2>
                        <p className="muted">Latest content in your workspace</p>
                    </div>
                </div>
                {data?.recentPosts.length ? (
                    <div className="recent-list">
                        {data.recentPosts.map(post => (
                            <div className="recent-item" key={post._id}>
                                <div className="recent-dot"/>
                                <div>
                                    <strong>{post.title}</strong>
                                    <small>{post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}</small>
                                </div>
                                <span className="recent-likes">♥ {post.likes.length}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">No posts available.</div>
                )}
            </div>
        </section>
    </div>)
}
