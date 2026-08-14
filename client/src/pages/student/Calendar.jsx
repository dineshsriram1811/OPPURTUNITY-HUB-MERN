import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, bookRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/opportunities/bookmarks'),
        ]);
        
        const apps = (appRes.data.applications || [])
          .map(a => (a.opportunity ? { ...a.opportunity, typeContext: 'applied' } : null))
          .filter(Boolean);
        const books = (bookRes.data.bookmarks || [])
          .map(b => (b.opportunity ? { ...b.opportunity, typeContext: 'saved' } : null))
          .filter(Boolean);
        
        const map = new Map();
        [...apps, ...books].forEach(item => {
          const deadline = item.applicationDeadline || item.deadline;
          if (item && deadline && !map.has(item._id)) {
            map.set(item._id, { ...item, deadline });
          }
        });
        
        const sortedEvents = Array.from(map.values()).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setEvents(sortedEvents);
      } catch (err) {
        console.error('Failed to fetch calendar events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" color="#1677D2" /></div>;

  return (
    <div className="page-enter max-w-4xl mx-auto pb-12 font-sans">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] font-display flex items-center gap-3">
          <FiCalendar className="text-[#1677D2]" /> Opportunity Calendar
        </h1>
        <p className="text-[#62748A] text-sm font-medium mt-1 font-sans">Upcoming deadlines for your saved and applied opportunities.</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#D9E5EF] shadow-sm p-8 font-sans">
          <FiCalendar className="mx-auto text-4xl text-[#94A3B8] mb-4 block" />
          <h3 className="text-xl font-extrabold text-[#102A43] font-display mb-2">No upcoming deadlines</h3>
          <p className="text-[#62748A] text-sm max-w-md mx-auto mb-6">You have no saved or applied opportunities with upcoming deadlines.</p>
          <Link to="/student/opportunities" className="btn-primary py-3 px-6 text-xs uppercase tracking-wider">
            Browse Opportunities
          </Link>
        </div>
      ) : (
        <div className="space-y-4 font-sans">
          {events.map((event, i) => {
            const deadlineDate = new Date(event.deadline);
            const isPast = deadlineDate < new Date();
            
            return (
              <motion.div 
                key={event._id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-2xl border p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm hover:shadow-md transition-all ${
                  isPast ? 'border-[#D9E5EF] border-l-4 border-l-neutral-400' : 'border-[#D9E5EF] border-l-4 border-l-[#19D3AE]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 ${
                    isPast ? 'bg-[#F0F6FC] text-[#62748A]' : 'bg-[#1677D2] text-[#19D3AE]'
                  }`}>
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider font-sans">{deadlineDate.toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-xl font-extrabold leading-none font-display">{deadlineDate.getDate()}</span>
                  </div>
                  <div>
                    <h3 className={`font-bold text-base font-sans ${isPast ? 'text-neutral-400 line-through' : 'text-[#102A43]'}`}>
                      {event.title}
                    </h3>
                    <div className="text-xs font-medium text-[#62748A] mt-1 font-sans">
                      {event.companyName} &bull; <span className="capitalize">{event.type}</span> &bull; {event.typeContext === 'applied' ? 'Applied' : 'Saved'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${isPast ? 'text-[#E05252]' : 'text-[#62748A]'}`}>
                    <FiClock size={14} /> {isPast ? 'Expired' : 'Due by 11:59 PM'}
                  </div>
                  <Link to={`/student/opportunities/${event._id}`} className="btn-outline px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex-shrink-0">
                    Details <FiExternalLink size={13} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;
