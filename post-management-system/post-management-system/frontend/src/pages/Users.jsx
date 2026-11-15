import { useEffect, useState } from 'react';
import api from '../api/api';
import {  useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Users() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    console.log("users_Forms", users);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const [error, setError] = useState('');
    const loadUsers = async () => {
        try {
            const response = await api.get('/users', { params: { search, role, status, page, limit: 8 } });
            setUsers(response.data.data.users);
            setPagination(response.data.data);
            setError('');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Unable to load users');
        }
    };
    useEffect(() => {
        const timer = setTimeout(loadUsers, 250);
        return () => clearTimeout(timer);
    }, [search, role, status, page]);
    const updateUser = async (id, data, action) => {
        console.log('Updating user with ID:', id, 'Data:', data, 'Action:', action); // Log the update operation for debugging
        try {
            if(action === "activate" && !window.confirm(`Are you sure you want to ${data.isActive ? 'deactivate' : 'activate'} this user?`)) return;
            if (action === "rolechange" && !window.confirm('Are you sure you want to update this role?')) return;
            // await api.patch(`/users/${id}`, data);
    const response = await api.post('/users/updateuser', {id: id, ...data });

             loadUsers();
        }
        catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };
    const userPostsLists = async (id) => {
        try {
            console.log('Navigating to user posts with ID:', id); // Log the user ID for debugging
            navigate('/posts', { state: { userId: id } });
        }
        catch (err) {
            alert(err.response?.data?.message || 'Unable to load user posts');
        }
    };
    return (

        <div>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">{user?.role === 'admin' ? 'ADMINISTRATION' : 'USER'}</p>
                    <h1>User management</h1>
                    <p className="muted">Post members, roles and account status.</p>
                </div>
            </div>
            <section className="panel">
                <div className="filter-row">
                    <input className="search-input" placeholder="Search name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                    <select value={role} onChange={e => { setRole(e.target.value); setPage(1); }}>
                        <option value="">All roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                {error && <div className="alert-error">{error}</div>}
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>USER</th>
                                <th>ROLE</th>
                                <th>STATUS</th>
                                <th>JOINED</th>
                                <th>ACTIONS</th>
                                <th>POSTS</th>

                            </tr>
                        </thead>
                        <tbody>
                            {users?.map(item => (
                                <tr key={item._id}>
                                    <td>
                                        <div className="table-user">
                                            <div className="avatar avatar-small">{item.name.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <strong>{item.name}</strong>
                                                <small>{item.email}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <select className="table-select" value={item.role} onChange={e => updateUser(item._id, { role: e.target.value }, "rolechange")}>
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <span className={item.isActive ? 'status active' : 'status inactive'}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button className="text-button" onClick={() => updateUser(item._id, { isActive: !item.isActive },"activate")}>
                                            {item.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                    <td>
                                        <button className="text-button" onClick={() => userPostsLists(item._id)}>
                                            View Posts
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!users.length && (
                        <div className="empty-state">No users match your filters.</div>
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
            </section>
        </div>
    )
}
