import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiSave, FiLock, FiGlobe, FiBell } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Settings = () => {
  const [siteName, setSiteName] = useState('OpportunityHub');
  const [supportEmail, setSupportEmail] = useState('support@opportunityhub.com');
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('System settings updated successfully!');
    }, 600);
  };

  return (
    <div className="page-enter max-w-4xl mx-auto pb-12 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] font-display flex items-center gap-2">
          <FiSettings className="text-[#1677D2]" /> Platform Settings
        </h1>
        <p className="text-[#62748A] text-sm font-medium mt-1">Configure global application parameters, email settings, and registration rules.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#D9E5EF] p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-[#102A43] font-display mb-4 pb-2 border-b border-[#D9E5EF] flex items-center gap-2">
            <FiGlobe className="text-[#1677D2]" /> General Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Platform Name</label>
              <input
                type="text"
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        <hr className="border-[#D9E5EF]" />

        <div>
          <h2 className="text-lg font-extrabold text-[#102A43] font-display mb-4 pb-2 border-b border-[#D9E5EF] flex items-center gap-2">
            <FiLock className="text-[#1677D2]" /> Security & Access
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-[#F3F8FC] rounded-xl border border-[#D9E5EF] cursor-pointer">
              <div>
                <div className="font-bold text-sm text-[#102A43]">Allow Student Registration</div>
                <div className="text-xs text-[#62748A]">Enable public sign up for new student accounts</div>
              </div>
              <input
                type="checkbox"
                checked={allowRegistration}
                onChange={e => setAllowRegistration(e.target.checked)}
                className="w-5 h-5 rounded text-[#1677D2] focus:ring-[#1677D2] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-[#F3F8FC] rounded-xl border border-[#D9E5EF] cursor-pointer">
              <div>
                <div className="font-bold text-sm text-[#102A43]">System Email Notifications</div>
                <div className="text-xs text-[#62748A]">Send automated application updates and deadline alerts via email</div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={e => setEmailNotifications(e.target.checked)}
                className="w-5 h-5 rounded text-[#1677D2] focus:ring-[#1677D2] cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary py-3.5 px-8 text-xs font-bold uppercase tracking-wider cursor-pointer">
            <FiSave size={16} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
