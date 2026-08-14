import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrash2, FiSearch, FiBriefcase, FiEdit3, FiPlus, FiAlertTriangle,
  FiX, FiRefreshCw, FiFilter, FiZap, FiMapPin, FiClock, FiChevronLeft,
  FiChevronRight, FiEye, FiDownload,
} from 'react-icons/fi';
import { MdDeleteSweep } from 'react-icons/md';
import { HiOutlineArrowUpTray } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import OpportunityFormModal from '../../components/opportunities/OpportunityFormModal';
import BulkImportModal from '../../components/opportunities/BulkImportModal';
import CompanyLogo from '../../components/common/CompanyLogo';

const CAT_STYLES = {
  job:          { bg: 'bg-[#1677D2] text-white', dot: 'bg-[#19D3AE]' },
  internship:   { bg: 'bg-[#E8FBF6] text-[#0C6B58]', dot: 'bg-[#19D3AE]' },
  freelancing:  { bg: 'bg-[#EBF3FA] text-[#123B73]', dot: 'bg-[#1677D2]' },
  hackathon:    { bg: 'bg-[#FFF8E6] text-[#B47D00]', dot: 'bg-[#F4B942]' },
  scholarship:  { bg: 'bg-[#EBFBF4] text-[#19A974]', dot: 'bg-[#19A974]' },
};

const CATEGORY_LABELS = [
  { type: 'job',         label: 'Jobs',          icon: '💼' },
  { type: 'internship',  label: 'Internships',   icon: '🎓' },
  { type: 'freelancing', label: 'Freelancing',   icon: '🚀' },
  { type: 'hackathon',   label: 'Hackathons',    icon: '⚡' },
  { type: 'scholarship', label: 'Scholarships',  icon: '🏆' },
];

const ConfirmDialog = ({ isOpen, title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 font-sans"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#D9E5EF]"
        >
          <div className="flex items-center gap-3.5 mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-100 text-[#E05252]' : 'bg-[#EBF3FA] text-[#1677D2]'}`}>
              <FiAlertTriangle className="text-2xl" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#102A43] font-display">{title}</h3>
              <p className="text-xs font-medium text-[#62748A] mt-0.5">{message}</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onCancel} className="btn-outline py-2 px-4 text-xs uppercase tracking-wider font-bold cursor-pointer">Cancel</button>
            <button
              onClick={onConfirm}
              className={`py-2 px-5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${danger
                ? 'bg-[#E05252] text-white hover:bg-red-700'
                : 'btn-primary'}`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-neutral-200 rounded-full" style={{ width: `${40 + i * 10}%` }} />
      </td>
    ))}
  </tr>
);

const EmptyState = ({ onAdd, onImport }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center font-sans">
    <div className="w-20 h-20 rounded-2xl bg-[#1677D2] flex items-center justify-center mb-5 shadow-lg">
      <FiBriefcase className="text-3xl text-[#19D3AE]" />
    </div>
    <h3 className="text-xl font-extrabold text-[#102A43] font-display mb-2">No Opportunities Yet</h3>
    <p className="text-sm font-medium text-[#62748A] max-w-sm mb-6 leading-relaxed">
      The database is currently empty. Add your first opportunity manually or use <strong>Bulk Import</strong> to upload a JSON/CSV file.
    </p>
    <div className="flex gap-3 flex-wrap justify-center">
      <button onClick={onAdd} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider cursor-pointer">
        <FiPlus size={16} /> Add Manually
      </button>
      <button onClick={onImport} className="btn-secondary flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider cursor-pointer">
        <HiOutlineArrowUpTray size={16} /> Bulk Import
      </button>
    </div>
  </div>
);

const CAT_FILTER_MAP = {
  job: 'Jobs', internship: 'Internships', freelancing: 'Freelancing',
  hackathon: 'Hackathons', scholarship: 'Scholarships',
};

const ManageOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [stats, setStats] = useState(null);
  const [bulkImportOpen,  setBulkImportOpen]  = useState(false);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [syncingGreenhouse, setSyncingGreenhouse] = useState(false);
  const [syncingMuse,       setSyncingMuse]       = useState(false);
  const [syncingRemotive,   setSyncingRemotive]   = useState(false);
  const [syncingDevpost,    setSyncingDevpost]    = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await api.get('/admin/stats');
      setStats(res.data.stats);
    } catch (_) {} finally { setStatsLoading(false); }
  }, []);

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      const allRes = await api.get('/opportunities?limit=10000');
      const allData = allRes.data.opportunities || [];
      setAllOpportunities(allData);

      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (categoryFilter) params.set('category', categoryFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (workModeFilter) params.set('workMode', workModeFilter);
      params.set('page', page);
      params.set('limit', 10);
      const res = await api.get(`/opportunities?${params.toString()}`);
      setOpportunities(res.data.opportunities || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (_) {
      toast.error('Failed to load opportunities');
    } finally { setLoading(false); }
  }, [debouncedSearch, categoryFilter, statusFilter, workModeFilter, page]);

  const getCategoryCount = (type) => {
    if (!allOpportunities || allOpportunities.length === 0) return 0;
    const targetCat = CAT_FILTER_MAP[type] || '';
    return allOpportunities.filter((opp) => {
      return (
        opp.type === type ||
        (targetCat && opp.category === targetCat)
      );
    }).length;
  };

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchOpportunities(); }, [fetchOpportunities]);

  const handleSyncGreenhouse = async () => {
    try {
      setSyncingGreenhouse(true);
      const res = await api.post('/jobs/greenhouse/sync', {}, { timeout: 60000 });
      const { fetched = 0, added = 0, skipped = 0, failed = 0 } = res.data || {};
      const failInfo = failed > 0 ? `, Failed ${failed}` : '';
      toast.success(`Greenhouse Sync completed! Fetched ${fetched}, Added ${added}, Skipped ${skipped}${failInfo}`);
      fetchOpportunities();
      fetchStats();
    } catch (err) {
      const msg = err.response?.data?.message || (err.message ? `Greenhouse sync failed: ${err.message}` : 'Greenhouse sync failed');
      toast.error(msg);
    } finally {
      setSyncingGreenhouse(false);
    }
  };

  const handleSyncMuse = async () => {
    try {
      setSyncingMuse(true);
      const res = await api.post('/internships/muse/sync', {}, { timeout: 60000 });
      const { fetched = 0, added = 0, skipped = 0, failed = 0 } = res.data || {};
      const failInfo = failed > 0 ? `, Failed ${failed}` : '';
      toast.success(`Muse Sync completed! Fetched ${fetched}, Added ${added}, Skipped ${skipped}${failInfo}`);
      fetchOpportunities();
      fetchStats();
    } catch (err) {
      const msg = err.response?.data?.message || (err.message ? `Muse sync failed: ${err.message}` : 'Muse sync failed');
      toast.error(msg);
    } finally {
      setSyncingMuse(false);
    }
  };

  const handleSyncRemotive = async () => {
    try {
      setSyncingRemotive(true);
      const res = await api.post('/freelancing/remotive/sync');
      toast.success(`Remotive Freelancing Sync completed! Fetched ${res.data.fetched || 0}, Added ${res.data.added || 0}, Skipped ${res.data.skipped || 0}`);
      fetchOpportunities();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Remotive sync failed');
    } finally {
      setSyncingRemotive(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/opportunities/${confirmDelete.id}`);
      toast.success('Opportunity deleted successfully');
      fetchOpportunities();
      fetchStats();
    } catch (_) { toast.error('Failed to delete opportunity'); }
    finally { setConfirmDelete(null); }
  };

  const handleDeleteAll = async () => {
    try {
      setDeleteAllLoading(true);
      const res = await api.delete('/admin/opportunities/all');
      toast.success(res.data.message || 'All opportunities deleted');
      fetchOpportunities();
      fetchStats();
    } catch (_) { toast.error('Failed to delete all opportunities'); }
    finally { setDeleteAllLoading(false); setConfirmDeleteAll(false); }
  };

  const handleExport = async (format) => {
    try {
      const res = await api.get('/opportunities?limit=10000');
      const opps = res.data.opportunities || [];
      if (opps.length === 0) { toast('No opportunities to export', { icon: 'ℹ️' }); return; }

      let content, mimeType, filename;
      if (format === 'json') {
        content  = JSON.stringify(opps, null, 2);
        mimeType = 'application/json';
        filename = `opportunities-${new Date().toISOString().slice(0,10)}.json`;
      } else {
        const fields = ['title','companyName','type','category','description','location','workMode',
          'salary','applicationDeadline','applyLink','contactEmail','status','isFeatured'];
        const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const rows   = [fields.join(','), ...opps.map((o) => fields.map((f) => escape(o[f])).join(','))];
        content  = rows.join('\n');
        mimeType = 'text/csv';
        filename = `opportunities-${new Date().toISOString().slice(0,10)}.csv`;
      }

      const blob = new Blob([content], { type: mimeType });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${opps.length} opportunities as ${format.toUpperCase()}`);
    } catch (_) { toast.error('Export failed'); }
  };

  const clearFilters = () => {
    setSearch(''); setCategoryFilter(''); setStatusFilter(''); setWorkModeFilter(''); setPage(1);
  };
  const hasFilters = search || categoryFilter || statusFilter || workModeFilter;

  return (
    <div className="page-enter max-w-7xl mx-auto pb-12 font-sans">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] font-display flex items-center gap-2">
            <FiBriefcase className="text-[#1677D2]" /> Manage Opportunities
          </h1>
          <p className="text-[#62748A] text-sm font-medium mt-1">
            Add, edit, publish, sync, and remove opportunities from database.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 font-sans">
          <button
            onClick={handleSyncMuse}
            disabled={syncingMuse}
            className="btn-secondary py-2.5 px-3.5 text-xs uppercase tracking-wider cursor-pointer"
            title="Sync internships from The Muse API"
          >
            <FiZap className={syncingMuse ? 'animate-spin text-[#1677D2]' : 'text-[#1677D2]'} />
            {syncingMuse ? 'Syncing...' : 'Sync Muse'}
          </button>

          <button
            onClick={handleSyncGreenhouse}
            disabled={syncingGreenhouse}
            className="btn-secondary py-2.5 px-3.5 text-xs uppercase tracking-wider cursor-pointer"
            title="Sync jobs from Greenhouse API"
          >
            <FiZap className={syncingGreenhouse ? 'animate-spin text-[#1677D2]' : 'text-[#1677D2]'} />
            {syncingGreenhouse ? 'Syncing...' : 'Sync Greenhouse'}
          </button>

          <button
            onClick={handleSyncRemotive}
            disabled={syncingRemotive}
            className="btn-secondary py-2.5 px-3.5 text-xs uppercase tracking-wider cursor-pointer"
            title="Sync freelancing opportunities from Remotive API"
          >
            <FiZap className={syncingRemotive ? 'animate-spin text-[#1677D2]' : 'text-[#1677D2]'} />
            {syncingRemotive ? 'Syncing...' : 'Sync Remotive'}
          </button>

          <button
            onClick={() => setBulkImportOpen(true)}
            className="btn-secondary py-2.5 px-3.5 text-xs uppercase tracking-wider cursor-pointer"
          >
            <HiOutlineArrowUpTray size={16} />
            Bulk Import
          </button>

          <div className="relative group">
            <button className="btn-outline py-2.5 px-3.5 text-xs uppercase tracking-wider font-extrabold cursor-pointer">
              <FiDownload size={14} /> Export
            </button>
            <div className="absolute right-0 top-full mt-1 w-36 bg-white text-[#102A43] rounded-xl shadow-xl border border-[#D9E5EF] overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 p-1">
              <button onClick={() => handleExport('json')} className="w-full text-left px-3 py-2 text-xs font-bold text-[#62748A] hover:text-white hover:bg-[#1677D2] rounded-lg transition-colors cursor-pointer">
                Export JSON
              </button>
              <button onClick={() => handleExport('csv')} className="w-full text-left px-3 py-2 text-xs font-bold text-[#62748A] hover:text-white hover:bg-[#1677D2] rounded-lg transition-colors cursor-pointer">
                Export CSV
              </button>
            </div>
          </div>

          <button
            onClick={() => setConfirmDeleteAll(true)}
            disabled={deleteAllLoading || total === 0}
            className="btn-danger py-2.5 px-3.5 text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {deleteAllLoading ? <FiRefreshCw className="animate-spin" /> : <MdDeleteSweep size={16} />}
            Delete All
          </button>

          <button
            onClick={() => { setSelectedOpportunity(null); setModalOpen(true); }}
            className="btn-primary py-2.5 px-4 text-xs uppercase tracking-wider font-bold cursor-pointer"
          >
            <FiPlus size={16} /> Add Opportunity
          </button>
        </div>
      </div>

      {/* Category Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6 font-sans">
        {CATEGORY_LABELS.map(({ type, label, icon }) => {
          const count = loading ? '—' : getCategoryCount(type);
          return (
            <motion.div
              key={type}
              whileHover={{ y: -2 }}
              onClick={() => {
                const catVal = CAT_FILTER_MAP[type] || '';
                setCategoryFilter((prev) => prev === catVal ? '' : catVal);
                setPage(1);
              }}
              className={`bg-white rounded-2xl border p-4 text-center cursor-pointer transition-all ${
                categoryFilter === CAT_FILTER_MAP[type]
                  ? 'border-[#1677D2] ring-2 ring-[#1677D2]'
                  : 'border-[#D9E5EF] hover:border-[#1677D2]'
              }`}
            >
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-lg font-extrabold text-[#102A43] font-display">{loading ? '—' : count}</div>
              <div className="text-[0.7rem] font-bold text-[#62748A] uppercase tracking-wider mt-0.5 font-sans">{label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Total Count */}
      <div className="mb-4 flex items-center justify-between font-sans">
        <div className="text-sm font-semibold text-[#62748A]">
          Showing <span className="font-extrabold text-[#102A43]">{total}</span> total opportunities in database
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-bold text-[#1677D2] hover:underline uppercase tracking-wider cursor-pointer border-none bg-none font-sans">
            <FiX size={14} /> Clear filters
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#D9E5EF] p-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap shadow-sm font-sans">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#62748A] text-sm" />
          <input
            type="text"
            placeholder="Search by title, company, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10 py-2.5 w-full text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#62748A] hover:text-[#102A43] border-none bg-none cursor-pointer">
              <FiX size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="form-input py-2.5 text-sm min-w-[130px] font-semibold">
            <option value="">All Categories</option>
            {['Jobs','Internships','Freelancing','Hackathons','Scholarships'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="form-input py-2.5 text-sm min-w-[110px] font-semibold">
            <option value="">All Status</option>
            <option>Active</option>
            <option>Expired</option>
          </select>

          <select value={workModeFilter} onChange={(e) => { setWorkModeFilter(e.target.value); setPage(1); }} className="form-input py-2.5 text-sm min-w-[120px] font-semibold">
            <option value="">All Work Modes</option>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>Onsite</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#D9E5EF] overflow-hidden shadow-sm font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1677D2] text-white border-b border-[#123B73]">
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider font-sans">Opportunity</th>
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider font-sans">Company</th>
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider font-sans">Type</th>
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider font-sans">Work Mode</th>
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E5EF]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : opportunities.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    {hasFilters ? (
                      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <FiSearch className="text-4xl text-[#94A3B8] mb-3" />
                        <h3 className="text-base font-extrabold text-[#102A43] mb-1 font-display">No matching opportunities</h3>
                        <p className="text-xs text-[#62748A] mb-4">Try adjusting your search or filter options.</p>
                        <button onClick={clearFilters} className="btn-outline text-xs py-2 px-4 uppercase tracking-wider font-bold cursor-pointer">Clear Filters</button>
                      </div>
                    ) : (
                      <EmptyState
                        onAdd={() => { setSelectedOpportunity(null); setModalOpen(true); }}
                        onImport={() => setBulkImportOpen(true)}
                      />
                    )}
                  </td>
                </tr>
              ) : (
                opportunities.map((opp, idx) => {
                  const style = CAT_STYLES[opp.type] || CAT_STYLES.job;
                  return (
                    <motion.tr
                      key={opp._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-[#F3F8FC] transition-colors group"
                    >
                      <td className="py-3.5 px-4 min-w-[240px] max-w-[320px]">
                        <div className="font-bold text-[#102A43] text-sm line-clamp-1 group-hover:text-[#1677D2] transition-colors font-sans">
                          {opp.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 text-[0.7rem] px-2 py-0.5 rounded-full font-bold ${opp.status === 'Active' ? 'bg-[#EBFBF4] text-[#19A974]' : 'bg-[#F0F6FC] text-[#62748A]'}`}>
                            {opp.status}
                          </span>
                          {opp.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-[0.7rem] px-2 py-0.5 rounded-full bg-[#1677D2] text-white font-bold">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 min-w-[160px]">
                        <div className="flex items-center gap-2.5">
                          <CompanyLogo opportunity={opp} className="w-8 h-8 rounded-lg" textClassName="text-[0.65rem]" />
                          <span className="text-xs font-bold text-[#102A43] truncate font-sans">{opp.companyName || '—'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold capitalize font-sans ${style.bg}`}>
                          {opp.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#62748A] font-sans">
                          <FiMapPin size={12} className="text-[#1677D2]" />
                          <span className="capitalize">{opp.workMode || opp.locationType || 'Remote'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex justify-end gap-1">
                          <a
                            href={`/opportunities/${opp._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-[#62748A] hover:bg-[#EBF3FA] hover:text-[#1677D2] transition-all"
                            title="Preview"
                          >
                            <FiEye size={15} />
                          </a>
                          <button
                            onClick={() => { setSelectedOpportunity(opp); setModalOpen(true); }}
                            className="p-2 rounded-lg text-[#62748A] hover:bg-[#EBF3FA] hover:text-[#1677D2] transition-all border-none bg-none cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit3 size={15} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete({ id: opp._id, title: opp.title })}
                            className="p-2 rounded-lg text-[#62748A] hover:bg-red-50 hover:text-[#E05252] transition-all border-none bg-none cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="py-3.5 px-4 border-t border-[#D9E5EF] flex items-center justify-between font-sans">
            <span className="text-xs font-semibold text-[#62748A]">
              Page {page} of {totalPages} &bull; {total} items
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 btn-outline py-1.5 px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <FiChevronLeft size={14} /> Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 btn-outline py-1.5 px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <OpportunityFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        opportunity={selectedOpportunity}
        onSaved={() => { fetchOpportunities(); fetchStats(); }}
      />

      <BulkImportModal
        isOpen={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
        onImported={() => { fetchOpportunities(); fetchStats(); }}
      />

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Opportunity"
        message={`Are you sure you want to delete "${confirmDelete?.title}"?`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      <ConfirmDialog
        isOpen={confirmDeleteAll}
        title="Delete ALL Opportunities"
        message={`This will permanently remove ALL ${total} opportunities from MongoDB database.`}
        confirmLabel={deleteAllLoading ? 'Deleting...' : `Delete All ${total} Opportunities`}
        danger
        onConfirm={handleDeleteAll}
        onCancel={() => setConfirmDeleteAll(false)}
      />
    </div>
  );
};

export default ManageOpportunities;
