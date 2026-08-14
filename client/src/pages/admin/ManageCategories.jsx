import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiList, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/categories');
      setCategories(res.data.categories || []);
    } catch (_) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Category name is required');
    try {
      setSaving(true);
      await api.post('/admin/categories', { name, description });
      toast.success('Category created');
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="page-enter max-w-5xl mx-auto pb-12 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] font-display flex items-center gap-2">
          <FiList className="text-[#1677D2]" /> Manage Categories
        </h1>
        <p className="text-[#62748A] text-sm font-medium mt-1">Organize opportunity classifications and sector tags.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create Category Form */}
        <div className="bg-white rounded-2xl border border-[#D9E5EF] p-6 shadow-sm h-fit">
          <h2 className="text-lg font-extrabold text-[#102A43] font-display mb-4 pb-2 border-b border-[#D9E5EF]">
            Add New Category
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="form-label">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="form-input"
                placeholder="e.g. Software Engineering"
                required
              />
            </div>
            <div>
              <label className="form-label">Description (Optional)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="form-input resize-none"
                rows="3"
                placeholder="Short description of this category..."
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider justify-center cursor-pointer"
            >
              {saving ? <LoadingSpinner size="sm" color="#FFFFFF" /> : <FiPlus size={16} />}
              {saving ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-[#D9E5EF] p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#102A43] font-display mb-4 pb-2 border-b border-[#D9E5EF]">
            Existing Categories ({categories.length})
          </h2>
          {loading ? (
            <div className="py-12 flex justify-center"><LoadingSpinner size="lg" color="#1677D2" /></div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-[#62748A] text-sm">No categories added yet.</div>
          ) : (
            <div className="divide-y divide-[#D9E5EF]">
              {categories.map(cat => (
                <div key={cat._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-sm text-[#102A43]">{cat.name}</div>
                    {cat.description && <div className="text-xs text-[#62748A] mt-0.5">{cat.description}</div>}
                  </div>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 rounded-lg text-[#62748A] hover:bg-red-50 hover:text-[#E05252] transition-all border-none bg-none cursor-pointer"
                    title="Delete Category"
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

export default ManageCategories;
