import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiService } from '../../services/api.js';
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  Tag,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

const DEPARTMENTS = [
  'All Departments',
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Mechatronics',
  'Biotechnology',
  'Civil Engineering',
  'Management Studies (MBA)',
];

const CATEGORIES = [
  'All Types',
  'Hackathon',
  'Technical Workshop',
  'National Symposium',
  'Guest Lecture',
  'Paper Presentation',
  'Cultural Fest',
  'Sports Meet',
];

export const EventsList = () => {
  const { setCurrentPage, setSelectedEventId } = useAuth();
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedCategory, setSelectedCategory] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('All Departments');
    setSelectedCategory('All Types');
    setSelectedStatus('ALL');
    setCurrentPageNum(1);
  };

  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      event.title?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.venue?.toLowerCase().includes(query) ||
      event.department?.toLowerCase().includes(query);

    const matchesDept =
      selectedDept === 'All Departments' ||
      event.department === selectedDept ||
      (selectedDept.includes('(') && event.department?.includes(selectedDept.split('(')[0].trim()));

    const matchesCategory =
      selectedCategory === 'All Types' ||
      event.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus =
      selectedStatus === 'ALL' ||
      (event.status && event.status.toUpperCase() === selectedStatus);

    return matchesSearch && matchesDept && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
  const paginatedEvents = filteredEvents.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPageNum(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
    setCurrentPage('event-details');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Explore College Events</h1>
          <p className="text-xs text-slate-500 mt-1">
            Discover workshops, hackathons, symposiums, and cultural events across departments.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start md:self-auto border border-slate-200">
          {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setCurrentPageNum(1);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedStatus === status
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'ALL' ? 'All Status' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by title, topic, or venue..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPageNum(1);
            }}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
          />
        </div>

        <div>
          <select
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPageNum(1);
            }}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPageNum(1);
            }}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Stats & Reset */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredEvents.length}</strong> events
          {selectedDept !== 'All Departments' && ` in ${selectedDept}`}
        </span>
        {(searchQuery ||
          selectedDept !== 'All Departments' ||
          selectedCategory !== 'All Types' ||
          selectedStatus !== 'ALL') && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}
      </div>

      {/* Events Grid */}
      {paginatedEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No events matched your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search keyword or filters.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((event) => {
            const capacityPercent = Math.min(
              100,
              Math.round(((event.registeredCount || 0) / (event.maxCapacity || 100)) * 100)
            );

            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group"
              >
                <div className="p-5">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {event.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        event.status === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-600'
                          : event.status === 'ONGOING'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {event.status || 'UPCOMING'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => handleEventClick(event.id)}
                    className="font-bold text-slate-900 text-base group-hover:text-amber-700 transition-colors cursor-pointer line-clamp-2 leading-snug"
                  >
                    {event.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">
                    {event.department}
                  </p>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Meta Details */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{event.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3 text-slate-400" /> Registrations
                      </span>
                      <span className="font-bold text-slate-700">
                        {event.registeredCount || 0} / {event.maxCapacity || 'Unlimited'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          capacityPercent >= 90 ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${capacityPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Fee</span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {event.registrationFee === 0 || !event.registrationFee
                        ? 'FREE'
                        : `₹${event.registrationFee}`}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEventClick(event.id)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(currentPageNum - 1)}
            disabled={currentPageNum === 1}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                currentPageNum === p
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPageNum + 1)}
            disabled={currentPageNum === totalPages}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
