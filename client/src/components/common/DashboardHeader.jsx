import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiBell, FiCheck, FiSearch } from 'react-icons/fi';
import { toggleSidebar, toggleSidebarMobile } from '../../store/slices/uiSlice';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../store/slices/notificationSlice';
import { timeAgo } from '../../utils/helpers';
import useOutsideClick from '../../hooks/useOutsideClick';

const DashboardHeader = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { sidebarMobile } = useSelector(state => state.ui);
  const { list: notifications, unreadCount } = useSelector(state => state.notifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useOutsideClick(notifRef, () => setNotifOpen(false));

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      dispatch(toggleSidebarMobile());
    } else {
      dispatch(toggleSidebar());
    }
  };

  return (
    <header className="bg-[#F3F8FC] border-b border-[#D9E5EF] px-6 h-16 flex items-center gap-4 flex-shrink-0 font-sans">
      <button
        onClick={handleToggle}
        aria-label="Toggle sidebar"
        className="p-2 rounded-xl border border-[#D9E5EF] bg-white text-[#62748A] hover:bg-[#1677D2] hover:text-white cursor-pointer transition-colors"
      >
        <FiMenu size={18} />
      </button>

      {/* Minimal Top Bar Search */}
      <div className="hidden md:flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-[#D9E5EF] w-64">
        <FiSearch size={15} className="text-[#62748A]" />
        <input
          type="text"
          placeholder="Search opportunities..."
          className="bg-transparent border-none outline-none text-xs text-[#102A43] placeholder-[#62748A] w-full font-sans"
        />
      </div>

      <div className="flex-1" />

      {/* Notification bell */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setNotifOpen(o => !o)}
          className="relative p-2 rounded-xl border border-[#D9E5EF] bg-white text-[#102A43] hover:border-[#1677D2] cursor-pointer flex transition-all"
        >
          <FiBell size={18} className={unreadCount > 0 ? 'bell-ring' : ''} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#19D3AE] text-[#102A43] text-[0.65rem] font-extrabold rounded-full px-1.5 min-w-[18px] text-center leading-4 shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#D9E5EF] rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden flex flex-col font-sans"
            >
              <div className="p-3.5 border-b border-[#D9E5EF] flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#102A43] font-display">
                  Notifications {unreadCount > 0 && <span className="text-[#1677D2]">({unreadCount})</span>}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllNotificationsRead())}
                    className="flex items-center gap-1 text-[#1677D2] text-xs font-bold bg-none border-none cursor-pointer hover:underline"
                  >
                    <FiCheck size={12} /> Mark all read
                  </button>
                )}
              </div>

              <div className="overflow-y-auto scrollbar-thin">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-[#62748A]">
                    <FiBell size={28} className="mx-auto mb-2 block text-[#94A3B8]" />
                    <p className="m-0 text-xs font-medium">No notifications yet</p>
                  </div>
                ) : notifications.slice(0, 10).map(n => (
                  <div
                    key={n._id}
                    onClick={() => dispatch(markNotificationRead(n._id))}
                    className={`p-3.5 border-b border-[#D9E5EF] cursor-pointer transition-colors ${
                      n.isRead ? 'bg-transparent hover:bg-[#F3F8FC]' : 'bg-[#EBF3FA] hover:bg-[#D4E6F6]'
                    }`}
                  >
                    <div className="flex gap-2.5 items-start">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.isRead ? 'bg-[#94A3B8]' : 'bg-[#19D3AE]'}`} />
                      <div>
                        <div className="font-bold text-xs text-[#102A43] mb-0.5">{n.title}</div>
                        <div className="text-xs text-[#62748A] leading-normal">{n.message}</div>
                        <div className="text-[0.6875rem] text-[#94A3B8] mt-1">{timeAgo(n.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Avatar badge */}
      <div className="flex items-center gap-2.5 p-1.5 pr-3 bg-white rounded-full border border-[#D9E5EF] shadow-sm">
        <div className="w-7 h-7 rounded-full bg-[#1677D2] flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0 overflow-hidden border border-[#19D3AE]">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <span>{user?.name?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <span className="text-xs font-bold text-[#102A43] hidden sm:block font-sans">
          {user?.name?.split(' ')[0]}
        </span>
      </div>
    </header>
  );
};

export default DashboardHeader;
