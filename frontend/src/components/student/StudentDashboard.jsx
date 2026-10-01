import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiService } from '../../services/api.js';
import {
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Bell,
  Sparkles,
  TrendingUp,
  Tag,
  ExternalLink,
  BookOpen,
  Compass
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user, setCurrentPage, setSelectedEventId } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [allEvents, userRegs, userCerts, allNotices] = await Promise.all([
          apiService.getAllEvents(),
          user?.id ? apiService.getUserRegistrations(user.id) : [],
          user?.id ? apiService.getUserCertificates(user.id) : [],
          apiService.getAnnouncements(),
        ]);

        setUpcomingEvents(allEvents.slice(0, 4));
        setMyRegistrations(userRegs);
        setCertificates(userCerts);
        setAnnouncements(allNotices || []);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [user]);

  const handleViewEvent = (eventId) => {
    setSelectedEventId(eventId);
    setCurrentPage('events');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-amber-950 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Student Portal Active
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
              {user?.department} • Year {user?.year || 'III'} • Roll No: {user?.rollNumber || '7376222CS101'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentPage('events')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              <Compass className="w-4 h-4" /> Explore Events
            </button>
            <button
              onClick={() => setCurrentPage('my-registrations')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> My Passes ({myRegistrations.length})
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Events</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{myRegistrations.length}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Confirmed</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Active registrations for college events</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certificates</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{certificates.length}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Verified</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Verified completion certificates ready to print</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Events</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{upcomingEvents.length}+</span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">Open</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Workshops, Hackathons & Symposiums</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus Activity</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">98%</span>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">Participation</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Institution-wide NAAC event engagement</p>
        </div>
      </div>

      {/* Announcements & Highlights */}
      {announcements.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-500 text-white shadow-sm">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Campus Notices & Deadlines</h3>
              <p className="text-xs text-slate-600">Official updates from Department Heads and Event Coordinators</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.slice(0, 2).map((notice) => (
              <div key={notice.id} className="bg-white rounded-xl p-4 border border-amber-200/70 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded">{notice.department}</span>
                  <span>{notice.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{notice.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notice.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid: Featured Events + My Passes Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Featured Events */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Featured & Trending Events</h2>
              <p className="text-xs text-slate-500">Upcoming opportunities across departments</p>
            </div>
            <button
              onClick={() => setCurrentPage('events')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              View All Events <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {evt.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{evt.department}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-700 transition-colors line-clamp-2">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {evt.startDate}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {evt.venue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                      {evt.registrationFee === 0 || !evt.registrationFee ? 'Free Entry' : `₹${evt.registrationFee}`}
                    </span>
                    <button
                      onClick={() => handleViewEvent(evt.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-colors"
                    >
                      View & Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Recent Pass / Registrations & Quick Links */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">My Active Passes</h3>
              <button
                onClick={() => setCurrentPage('my-registrations')}
                className="text-xs font-bold text-amber-700 hover:underline"
              >
                View All
              </button>
            </div>

            {myRegistrations.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No active registrations</p>
                <p className="text-[11px] text-slate-500 mt-1">Explore upcoming events and reserve your spot!</p>
                <button
                  onClick={() => setCurrentPage('events')}
                  className="mt-4 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myRegistrations.slice(0, 3).map((reg) => (
                  <div
                    key={reg.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-200/70 px-2 py-0.5 rounded">
                        {reg.ticketCode}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Confirmed
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs mt-2 truncate">
                      Event #{reg.eventId} - {reg.userName}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Registered on {reg.registeredAt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Student Actions
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Download participation certificates, share feedback, or review event guidelines.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setCurrentPage('certificates')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                <span>Download Certificates</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <button
                onClick={() => setCurrentPage('feedback')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                <span>Submit Event Feedback</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <button
                onClick={() => setCurrentPage('events')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-semibold text-amber-300 border border-amber-500/30 transition-colors"
              >
                <span>Browse All College Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
