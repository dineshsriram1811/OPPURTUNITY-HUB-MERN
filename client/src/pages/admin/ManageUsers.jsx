import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch, FiShield, FiUserCheck, FiTrash2, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (_) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="page-enter max-w-6xl mx-auto pb-12 font-sans">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] font-display flex items-center gap-2">
            <FiUsers className="text-[#1677D2]" /> Manage Users
          </h1>
          <p className="text-[#62748A] text-sm font-medium mt-1">Review user accounts, assign admin roles, and manage permissions.</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl border border-[#D9E5EF] p-4 mb-6 flex flex-col sm:flex-row items-center gap-4 shadow-sm font-sans">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#62748A]" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input pl-10 py-2 w-full text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="form-input py-2 text-sm w-full sm:w-44 font-semibold"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#D9E5EF] overflow-hidden shadow-sm font-sans">
        {loading ? (
          <div className="py-16 flex justify-center"><LoadingSpinner size="lg" color="#1677D2" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1677D2] text-white border-b border-[#123B73]">
                  <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider font-sans">User</th>
                  <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider font-sans">Role</th>
                  <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider font-sans">Status</th>
                  <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider text-right font-sans">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E5EF]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-[#62748A]">
                      No users found
                    </td>
                  </tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#F3F8FC] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1677D2] text-[#19D3AE] font-extrabold flex items-center justify-center border border-[#19D3AE] text-sm overflow-hidden flex-shrink-0">
                          {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name?.[0]}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#102A43]">{user.name}</div>
                          <div className="text-xs text-[#62748A]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="bg-[#F3F8FC] border border-[#D9E5EF] text-[#102A43] text-xs font-bold py-1 px-2.5 rounded-lg outline-none cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="badge badge-green text-xs">Active</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 rounded-lg text-[#62748A] hover:bg-red-50 hover:text-[#E05252] transition-all border-none bg-none cursor-pointer"
                        title="Delete User"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
