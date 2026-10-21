import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiPlus, FiTrash2, FiClock } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { timeAgo } from '../../utils/helpers';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/announcements');
      setAnnouncements(res.data.announcements || []);
    } catch (_) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return toast.error('Title and message are required');
    try {
      setSaving(true);
      await api.post('/admin/announcements', { title, message });
      toast.success('Announcement broadcasted');
      setTitle('');
      setMessage('');
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.delete(`/admin/announcements/${id}`);
      toast.success('Announcement removed');
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  return (
    <div className="page-enter max-w-5xl mx-auto pb-12 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] font-display flex items-center gap-2">
          <FiZap className="text-[#1677D2]" /> Manage Announcements
        </h1>
        <p className="text-[#62748A] text-sm font-medium mt-1">Broadcast platform notices and career updates to all users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Post Announcement Form */}
        <div className="bg-white rounded-2xl border border-[#D9E5EF] p-6 shadow-sm h-fit">
          <h2 className="text-lg font-extrabold text-[#102A43] font-display mb-4 pb-2 border-b border-[#D9E5EF]">
            New Announcement
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="form-label">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="form-input"
                placeholder="e.g. Summer Internship Fair 2026"
                required
              />
            </div>
            <div>
              <label className="form-label">Message Content</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="form-input resize-none"
                rows="4"
                placeholder="Write your announcement details here..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider justify-center cursor-pointer"
            >
              {saving ? <LoadingSpinner size="sm" color="#FFFFFF" /> : <FiPlus size={16} />}
              {saving ? 'Posting...' : 'Broadcast Announcement'}
            </button>
          </form>
        </div>

        {/* Announcements List */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-[#D9E5EF] p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#102A43] font-display mb-4 pb-2 border-b border-[#D9E5EF]">
            Past Broadcasts ({announcements.length})
          </h2>
          {loading ? (
            <div className="py-12 flex justify-center"><LoadingSpinner size="lg" color="#1677D2" /></div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12 text-[#62748A] text-sm">No announcements broadcast yet.</div>
          ) : (
            <div className="divide-y divide-[#D9E5EF]">
              {announcements.map(item => (
                <div key={item._id} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-[#102A43]">{item.title}</h3>
                    <p className="text-xs text-[#62748A] mt-1 leading-relaxed">{item.message}</p>
                    <div className="text-[0.6875rem] text-[#94A3B8] mt-1.5 flex items-center gap-1 font-medium">
                      <FiClock size={12} /> Posted {timeAgo(item.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg text-[#62748A] hover:bg-red-50 hover:text-[#E05252] transition-all border-none bg-none cursor-pointer flex-shrink-0"
                    title="Delete Announcement"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAnnouncements;
