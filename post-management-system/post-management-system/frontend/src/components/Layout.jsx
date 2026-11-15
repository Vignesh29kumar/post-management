import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const { user, logout } = useAuth();
    console.log('User data in Layout:', user); // Log the user data for debugging
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    const handleUpdateRegister = async () => {
        navigate('/updateuser', { state: { currentUser: user } });
    };
    return <div className="app-shell">
        <aside className="sidebar">
            <div className="brand"><span>PostSpace</span></div>
            <div className="sidebar-label">Panel</div>
            <nav className="side-nav">
                <NavLink to="/" end> <span>Dashboard</span></NavLink>
                {user?.role === 'user' && <NavLink to="/posts"><span>Posts</span></NavLink>}
                {user?.role === 'admin' && <NavLink to="/users"><span>Users</span></NavLink>}
                {user?.role === 'user' && <NavLink to="/myposts" ><span>My Posts</span></NavLink>}
                {/* {user?.role === 'user' && <NavLink to="/updateposts" ><span>Update Posts</span></NavLink>} */}


            </nav>
            <div className="sidebar-bottom">
                <div className="avatar">
                    {/* {user?.name?.charAt(0)?.toUpperCase()} */}
                    <img src={user?.image ? `http://localhost:8000/uploads/${user?.image}` : user?.name?.charAt(0)?.toUpperCase()} alt="User Avatar" onClick={handleUpdateRegister} />
                </div>
                <div className="user-info">
                </div>
                <div className="user-mini">
                    <strong>{user?.name}</strong>
                    <small>{user?.role}</small>
                </div><button className="icon-button" title="Logout" onClick={handleLogout}>Logout</button>
            </div>
        </aside>
        <main className="main-area">
                <div className="content"><Outlet /></div>
                </main>
    </div>;
}
