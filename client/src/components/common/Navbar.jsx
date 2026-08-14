import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiGrid } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import useOutsideClick from '../../hooks/useOutsideClick';

const Navbar = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useOutsideClick(profileRef, () => setProfileOpen(false));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { to: '/opportunities', label: 'Opportunities' },
  ];

  return (
    <nav className="bg-white border-b border-[#DDE5EA] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#1677C8] flex items-center justify-center shadow-md shadow-blue-500/20">
            <FiZap size={20} className="text-[#18E0C0]" />
          </div>
          <span className="text-xl font-extrabold text-[#111827] tracking-tight font-display">
            Opportunity<span className="text-[#1677C8]">Hub</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1 ml-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 rounded-lg text-[#475569] hover:text-[#1677C8] hover:bg-[#F7FAFC] font-semibold text-[0.9375rem] transition-all no-underline"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Dashboard link */}
              <Link
                to={`/${user.role}/dashboard`}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#EBF5FF] text-[#1677C8] hover:bg-[#D6ECFF] border border-[#B3D9FF] rounded-xl font-bold text-sm no-underline transition-all"
              >
                <FiGrid size={15} /> Dashboard
              </Link>

              {/* Profile dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(p => !p)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 bg-[#F7FAFC] border border-[#DDE5EA] hover:border-[#1677C8] rounded-full cursor-pointer transition-all"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1677C8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.name?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-[#111827] max-w-[120px] truncate hidden sm:block">
                    {user.name}
                  </span>
                  <FiChevronDown size={14} className={`text-[#475569] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#DDE5EA] rounded-2xl shadow-2xl p-2 z-50"
                    >
                      <div className="p-3 border-b border-[#DDE5EA] mb-1">
                        <div className="font-bold text-sm text-[#111827] truncate">{user.name}</div>
                        <div className="text-xs text-[#475569] truncate mt-0.5">{user.email}</div>
                        <span className="inline-block mt-2 px-2.5 py-0.5 bg-[#D9FFF8] text-[#075E54] font-extrabold text-[0.7rem] uppercase rounded-full">
                          {user.role}
                        </span>
                      </div>
                      {[
                        { to: `/${user.role}/dashboard`, icon: FiGrid, label: 'Dashboard' },
                        { to: `/${user.role}/profile`,   icon: FiUser, label: 'Profile' },
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#475569] hover:text-[#1677C8] hover:bg-[#EBF5FF] text-sm font-semibold no-underline transition-all"
                        >
                          <item.icon size={16} /> {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[#E53935] hover:bg-red-50 text-sm font-bold cursor-pointer mt-1 border-t border-[#DDE5EA] transition-all"
                      >
                        <FiLogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-[#1677C8] hover:text-[#0B5FA5] font-bold text-sm no-underline border border-[#DDE5EA] rounded-xl hover:bg-[#EBF5FF] transition-all"
              >
                Sign In
              </Link>
              <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                Get Started
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-xl border border-[#DDE5EA] bg-[#F7FAFC] text-[#475569] hover:text-[#1677C8] cursor-pointer"
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#DDE5EA] bg-white px-4 py-4 flex flex-col gap-2"
          >
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-[#475569] hover:text-[#1677C8] hover:bg-[#F7FAFC] font-semibold text-sm no-underline"
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#DDE5EA]">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 text-center text-[#1677C8] border border-[#DDE5EA] rounded-xl font-bold text-sm no-underline"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center py-3"
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
