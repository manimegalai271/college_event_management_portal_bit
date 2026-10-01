import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiService } from '../../services/api.js';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Ticket,
  Printer,
  ArrowLeft,
  Users,
  AlertCircle,
  ExternalLink,
  QrCode
} from 'lucide-react';

export const MyRegistrations = () => {
  const { user, setCurrentPage, setSelectedEventId } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [eventsMap, setEventsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const loadRegistrations = async () => {
      setLoading(true);
      try {
        const [allEvents, userRegs] = await Promise.all([
          apiService.getAllEvents(true),
          user?.id ? apiService.getUserRegistrations(user.id) : [],
        ]);

        const map = {};
        allEvents.forEach(e => { map[e.id] = e; });
        setEventsMap(map);
        setRegistrations(userRegs);
      } catch (err) {
        console.error('Failed to load user registrations', err);
      } finally {
        setLoading(false);
      }
    };
    loadRegistrations();
  }, [user]);

  const handlePrintTicket = (reg) => {
    setSelectedTicket(reg);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Event Registrations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your confirmed event passes, QR verification codes, and team details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('events')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            Browse More Events
          </button>
        </div>
      </div>

      {/* Registrations List */}
      {registrations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Registrations Yet</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            You haven't registered for any events yet. Check out the active workshops, seminars, and hackathons open for registration.
          </p>
          <button
            onClick={() => setCurrentPage('events')}
            className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Explore Events Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {registrations.map((reg) => {
            const event = eventsMap[reg.eventId] || {
              title: `Event #${reg.eventId}`,
              startDate: 'TBD',
              venue: 'Campus Venue',
              category: 'EVENT',
              department: 'General'
            };

            return (
              <div
                key={reg.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Ticket Top Header */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-300 tracking-wider uppercase">Official Event Pass</span>
                      <h3 className="font-bold text-sm tracking-wide font-mono">{reg.ticketCode}</h3>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMED
                  </span>
                </div>

                {/* Ticket Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
                      <span className="bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 uppercase text-[10px]">
                        {event.category}
                      </span>
                      <span>•</span>
                      <span>{event.department}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 leading-snug">{event.title}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[11px] block">Date & Time</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {event.startDate}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[11px] block">Venue</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {event.venue}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[11px] block">Participant</span>
                      <span className="font-semibold text-slate-800">{reg.userName}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[11px] block">Roll Number</span>
                      <span className="font-mono font-semibold text-slate-800">{reg.userRollNumber || 'N/A'}</span>
                    </div>
                  </div>

                  {reg.teamName && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700">Team: {reg.teamName}</span>
                      {reg.teamMembers?.length > 0 && (
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Members: {reg.teamMembers.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Ticket Footer Actions */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500">
                    Booked on {reg.registeredAt}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrintTicket(reg)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print E-Pass
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEventId(reg.eventId);
                        setCurrentPage('events');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-colors"
                    >
                      Event Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
