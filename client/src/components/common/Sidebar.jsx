import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiZap, FiHome, FiUser, FiFileText, FiCpu,
  FiBriefcase, FiUsers, FiBarChart2,
  FiShield, FiSettings, FiLogOut, FiX, FiCalendar,
} from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import { setSidebarMobile } from '../../store/slices/uiSlice';

const studentLinks = [
  { to: '/student/dashboard',     icon: FiHome,      label: 'Dashboard' },
  { to: '/student/profile',       icon: FiUser,      label: 'My Profile' },
  { to: '/student/opportunities', icon: FiBriefcase, label: 'Opportunities' },
  { to: '/student/applications',  icon: FiFileText,  label: 'Tracker' },
  { to: '/student/calendar',      icon: FiCalendar,  label: 'Calendar' },
];

const adminLinks = [
  { to: '/admin/dashboard',      icon: FiBarChart2,  label: 'Dashboard' },
  { to: '/admin/opportunities',  icon: FiBriefcase,  label: 'Opportunities' },
  { to: '/admin/categories',     icon: FiCpu,        label: 'Categories' },
  { to: '/admin/users',          icon: FiUsers,      label: 'Users' },
  { to: '/admin/reports',        icon: FiShield,     label: 'Reports' },
  { to: '/admin/announcements',  icon: FiZap,        label: 'Announcements' },
  { to: '/admin/settings',       icon: FiSettings,   label: 'Settings' },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { sidebarOpen, sidebarMobile } = useSelector(state => state.ui);

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const handleLogout = () => {
    dispatch(setSidebarMobile(false));
    dispatch(logout());
    navigate('/login');
  };

  const closeMobile = () => dispatch(setSidebarMobile(false));

  return (
    <>
      {/* ── Desktop Fixed Persistent Sidebar ─────────────────────────── */}
      <aside
        style={{
          width: sidebarOpen ? '260px' : '76px',
          minWidth: sidebarOpen ? '260px' : '76px',
          height: '100vh',
          background: '#FFFFFF',
          borderRight: '1px solid #D9E5EF',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 30,
          transition: 'width 0.25s ease, min-width 0.25s ease',
        }}
        className="hidden lg:flex flex-col overflow-y-auto overflow-x-hidden shadow-sm"
      >
        {/* Brand Logo */}
        <div style={{ padding: sidebarOpen ? '1.25rem 1.25rem 0.75rem' : '1.25rem 0.75rem 0.75rem', display: 'flex', items: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#1677D2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiZap size={20} color="#19D3AE" />
            </div>
            {sidebarOpen && (
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#102A43', fontFamily: '"Forum", serif', lineHeight: 1, whiteSpace: 'nowrap' }}>
                  Opportunity<span style={{ color: '#1677D2' }}>Hub</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Card */}
        <div style={{ margin: sidebarOpen ? '0.75rem 1rem' : '0.75rem 0.5rem', padding: sidebarOpen ? '0.875rem' : '0.5rem', background: '#F3F8FC', borderRadius: '1rem', border: '1px solid #D9E5EF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1677D2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: '2px solid #19D3AE' }}>
              {user?.avatar
                ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#FFFFFF', fontWeight: '800', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>{user?.name?.[0]?.toUpperCase()}</span>}
            </div>
            {sidebarOpen && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#102A43', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>{user?.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#123B73', fontWeight: '800', textTransform: 'uppercase', marginTop: '1px', fontFamily: 'Inter, sans-serif' }}>{user?.role}</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation links */}
        <nav style={{ padding: '0 0.625rem', flex: 1 }}>
          {sidebarOpen && (
            <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#62748A', letterSpacing: '1.2px', textTransform: 'uppercase', padding: '0 0.625rem', marginBottom: '0.5rem', marginTop: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
              Navigation
            </div>
          )}
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              title={!sidebarOpen ? link.label : undefined}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                padding: sidebarOpen ? '0.75rem 1rem' : '0.75rem 0',
                marginBottom: '0.35rem',
                borderRadius: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                position: 'relative',
                overflow: 'hidden',
                ...(isActive
                  ? { color: '#FFFFFF', background: '#1677D2', fontWeight: '700' }
                  : { color: '#62748A' }),
              })}
            >
              {({ isActive }) => (
                <>
                  {/* Mint Indicator Accent for Active Link */}
                  {isActive && (
                    <span style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '4px', background: '#19D3AE', borderRadius: '0 4px 4px 0' }} />
                  )}
                  <link.icon size={19} />
                  {sidebarOpen && <span style={{ fontSize: '0.9375rem', whiteSpace: 'nowrap' }}>{link.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sign Out */}
        <div style={{ padding: '0.75rem 0.625rem', borderTop: '1px solid #D9E5EF', marginTop: 'auto' }}>
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Sign Out' : undefined}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: '0.75rem', width: '100%', padding: sidebarOpen ? '0.75rem 1rem' : '0.75rem 0',
              borderRadius: '0.875rem', color: '#E05252', background: 'rgba(224, 82, 82, 0.08)',
              border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.875rem', transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(224, 82, 82, 0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(224, 82, 82, 0.08)'}
          >
            <FiLogOut size={19} /> {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Mobile Slide-in Drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarMobile && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            style={{
              width: '260px',
              height: '100vh',
              background: '#FFFFFF',
              borderRight: '1px solid #D9E5EF',
              display: 'flex',
              flexDirection: 'column',
              position: 'fixed',
              left: 0,
              top: 0,
              zIndex: 50,
              overflowY: 'auto',
            }}
            className="lg:hidden shadow-2xl"
          >
            {/* Header + Close */}
            <div style={{ padding: '1.25rem 1.25rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#1677D2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiZap size={20} color="#19D3AE" />
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#102A43', fontFamily: '"Forum", serif', lineHeight: 1 }}>
                    Opportunity<span style={{ color: '#1677D2' }}>Hub</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeMobile}
                style={{ padding: '0.5rem', borderRadius: '0.625rem', border: '1px solid #D9E5EF', background: '#F3F8FC', cursor: 'pointer', color: '#62748A' }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* User Profile Card */}
            <div style={{ margin: '0.75rem 1rem', padding: '0.875rem', background: '#F3F8FC', borderRadius: '1rem', border: '1px solid #D9E5EF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1677D2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: '2px solid #19D3AE' }}>
                  {user?.avatar
                    ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#FFFFFF', fontWeight: '800', fontSize: '1rem', fontFamily: 'Inter, sans-serif' }}>{user?.name?.[0]?.toUpperCase()}</span>}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#102A43', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#123B73', fontWeight: '800', textTransform: 'uppercase', marginTop: '2px', fontFamily: 'Inter, sans-serif' }}>{user?.role}</div>
                </div>
              </div>
            </div>

            {/* Nav links */}
            <nav style={{ padding: '0 0.75rem', flex: 1 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#62748A', letterSpacing: '1.2px', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.5rem', marginTop: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                Navigation
              </div>
              {links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeMobile}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    marginBottom: '0.35rem',
                    fontFamily: 'Inter, sans-serif',
                    position: 'relative',
                    ...(isActive ? { color: '#FFFFFF', background: '#1677D2', fontWeight: '700' } : { color: '#62748A' }),
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '4px', background: '#19D3AE', borderRadius: '0 4px 4px 0' }} />
                      )}
                      <link.icon size={18} />
                      <span style={{ fontSize: '0.9375rem' }}>{link.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Sign Out */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid #D9E5EF', marginTop: 'auto' }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem',
                  borderRadius: '0.875rem', color: '#E05252', background: 'rgba(224, 82, 82, 0.08)',
                  border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif'
                }}
              >
                <FiLogOut size={18} /> Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
