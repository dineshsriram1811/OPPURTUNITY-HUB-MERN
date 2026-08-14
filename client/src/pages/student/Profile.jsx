import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUpload, FiPlus, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { getMe } from '../../store/slices/authSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    phone: '',
    githubUrl: '',
    linkedinUrl: '',
    skills: [],
    interests: [],
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        skills: user.skills || [],
        interests: user.preferredRoles || [],
      });
    }
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('avatar', file);

    setUploading(true);
    try {
      await api.post('/users/avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Profile picture updated!');
      dispatch(getMe());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData({ ...formData, interests: [...formData.interests, interestInput.trim()] });
      setInterestInput('');
    }
  };

  const removeInterest = (interest) => {
    setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put('/users/profile', {
        ...formData,
        preferredRoles: formData.interests
      });
      toast.success(response.data?.message || 'Profile updated successfully!');
      dispatch(getMe());
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message ||
        'Failed to update profile';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <LoadingSpinner color="#1677D2" />;

  return (
    <div className="page-enter max-w-4xl mx-auto pb-12 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] font-display mb-1">
          Student Profile
        </h1>
        <p className="text-[#62748A] text-sm font-medium">Manage your personal information, skills, links, and career goals.</p>
      </div>

      {/* User Header Card */}
      <div className="bg-gradient-to-r from-[#123B73] via-[#1677D2] to-[#1E88E5] text-white rounded-2xl p-6 mb-8 border border-[#0E2E5B] shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#123B73] border-2 border-[#19D3AE] flex items-center justify-center">
              {uploading ? (
                <LoadingSpinner size="sm" color="#19D3AE" />
              ) : user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-extrabold text-[#19D3AE] font-display">{user.name.charAt(0)}</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#19D3AE] text-[#102A43] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-emerald-300 transition-colors">
              <FiUpload size={14} />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display mb-1">{user.name}</h2>
            <p className="text-blue-100 text-sm mb-3 font-sans">{user.email}</p>
            <span className="inline-block px-3 py-1 bg-white/20 text-[#19D3AE] border border-[#19D3AE]/40 rounded-full text-xs font-bold uppercase tracking-wider font-sans">
              Profile Completeness: {user.profileCompletion || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#D9E5EF] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
          </div>
          <div>
            <label className="form-label">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" placeholder="e.g. New York, NY" />
          </div>
          <div>
            <label className="form-label">Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="e.g. +1 234 567 890" />
          </div>
          <div>
            <label className="form-label">GitHub URL</label>
            <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="form-input" placeholder="https://github.com/username" />
          </div>
          <div>
            <label className="form-label">LinkedIn URL</label>
            <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="form-input" placeholder="https://linkedin.com/in/username" />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} className="form-input resize-none" rows="3" placeholder="Tell us about your background, career interests, and goals..."></textarea>
          </div>
        </div>

        <hr className="border-[#D9E5EF]" />

        {/* Skills */}
        <div>
          <label className="form-label">Technical Skills</label>
          <div className="flex gap-2 mb-3">
            <input 
              type="text" 
              value={skillInput} 
              onChange={(e) => setSkillInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className="form-input" 
              placeholder="e.g. React, Node.js, Python, Data Science" 
            />
            <button type="button" onClick={addSkill} className="btn-secondary px-4 py-3 cursor-pointer"><FiPlus size={18} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1677D2] text-white font-bold text-xs rounded-xl font-sans">
                {skill}
                <FiX className="cursor-pointer text-[#19D3AE] hover:text-red-300" onClick={() => removeSkill(skill)} />
              </span>
            ))}
          </div>
        </div>

        <hr className="border-[#D9E5EF]" />

        {/* Interests */}
        <div>
          <label className="form-label">Career Interests & Preferred Roles</label>
          <div className="flex gap-2 mb-3">
            <input 
              type="text" 
              value={interestInput} 
              onChange={(e) => setInterestInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              className="form-input" 
              placeholder="e.g. Full Stack Developer, AI Researcher" 
            />
            <button type="button" onClick={addInterest} className="btn-secondary px-4 py-3 cursor-pointer"><FiPlus size={18} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest, index) => (
              <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8FBF6] text-[#0C6B58] border border-[#19D3AE] font-bold text-xs rounded-xl font-sans">
                {interest}
                <FiX className="cursor-pointer hover:text-red-600" onClick={() => removeInterest(interest)} />
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="btn-primary py-3.5 px-8 text-xs font-bold uppercase tracking-wider cursor-pointer" disabled={saving}>
            {saving ? <LoadingSpinner size="sm" color="#FFFFFF" /> : <FiSave size={16} />}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
