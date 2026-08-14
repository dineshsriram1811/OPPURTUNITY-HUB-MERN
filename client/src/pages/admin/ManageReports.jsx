import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiAlertTriangle, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { timeAgo } from '../../utils/helpers';

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reports');
      setReports(res.data.reports || []);
    } catch (_) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id, status) => {
    try {
      await api.put(`/admin/reports/${id}`, { status });
      toast.success(`Report marked as ${status}`);
      fetchReports();
    } catch (err) {
      toast.error('Failed to update report status');
    }
  };

  return (
    <div className="page-enter max-w-5xl mx-auto pb-12 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] font-display flex items-center gap-2">
          <FiShield className="text-[#1677D2]" /> Manage Reports
        </h1>
        <p className="text-[#62748A] text-sm font-medium mt-1">Review flagged opportunities reported by students.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#D9E5EF] overflow-hidden shadow-sm font-sans">
        {loading ? (
          <div className="py-16 flex justify-center"><LoadingSpinner size="lg" color="#1677D2" /></div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center text-[#62748A]">
            <FiShield size={36} className="mx-auto mb-3 text-[#94A3B8] block" />
            <p className="m-0 text-sm font-semibold">No flagged reports found</p>
          </div>
        ) : (
          <div className="divide-y divide-[#D9E5EF]">
            {reports.map((report) => (
              <div key={report._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8E6] text-[#B47D00] flex items-center justify-center flex-shrink-0 border border-[#F4B942]">
                    <FiAlertTriangle size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#102A43]">{report.opportunity?.title || 'Reported Item'}</h3>
                    <p className="text-xs text-[#62748A] mt-0.5">{report.reason}</p>
                    <div className="text-[0.6875rem] text-[#94A3B8] mt-1 font-medium">
                      Reported by {report.user?.name || 'User'} &bull; {timeAgo(report.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {report.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleResolve(report._id, 'resolved')}
                        className="btn-primary py-1.5 px-3 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        <FiCheck size={14} /> Resolve
                      </button>
                      <button
                        onClick={() => handleResolve(report._id, 'dismissed')}
                        className="btn-outline py-1.5 px-3 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        <FiX size={14} /> Dismiss
                      </button>
                    </>
                  ) : (
                    <span className={`badge ${report.status === 'resolved' ? 'badge-green' : 'badge-gray'} text-xs capitalize`}>
                      {report.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReports;
