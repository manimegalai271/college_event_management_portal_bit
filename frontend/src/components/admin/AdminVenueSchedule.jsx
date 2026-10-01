import React, { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';

import { apiService } from '../../services/api';

import {

  Calendar,

  Clock,

  AlertTriangle,

  ArrowLeft,

  CheckCircle2,

  MapPin,

  Users,

} from 'lucide-react';



export const AdminVenueSchedule = () => {

  const { setCurrentPage } = useAuth();

  const [events, setEvents] = useState([]);

  const [selectedVenue, setSelectedVenue] = useState('ALL');



  useEffect(() => {

    const load = async () => {

      const all = await apiService.getAllEvents(true);

      setEvents(all);

    };

    load();

  }, []);



  // Distinct venues

  const venues = Array.from(new Set(events.map(e => e.venue)));



  // Detect clashes: two events in same venue with overlapping dates

  const clashEventIds = new Set();

  for (let i = 0; i < events.length; i++) {

    for (let j = i + 1; j < events.length; j++) {

      const e1 = events[i];

      const e2 = events[j];

      if (e1.venue === e2.venue && e1.status !== 'CANCELLED' && e2.status !== 'CANCELLED') {

        const start1 = new Date(e1.startDate).getTime();

        const end1 = new Date(e1.endDate).getTime();

        const start2 = new Date(e2.startDate).getTime();

        const end2 = new Date(e2.endDate).getTime();



        if (start1 <= end2 && start2 <= end1) {

          clashEventIds.add(e1.id);

          clashEventIds.add(e2.id);

        }

      }

    }

  }



  const filteredEvents = events.filter(e => {

    return selectedVenue === 'ALL' || e.venue === selectedVenue;

  });



  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">

        <div>

          <button

            onClick={() => setCurrentPage('admin-executive-overview')}

            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-2"

          >

            <ArrowLeft className="w-4 h-4" /> Back to Executive Console

          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">

            Campus Venue Timetable & Clash Detector

          </h1>

          <p className="text-xs text-slate-500 mt-0.5">

            Audit venue occupancy across Bannari Amman Institute of Technology auditoriums and research centers.

          </p>

        </div>



        <div className="flex items-center gap-2">

          {clashEventIds.size > 0 ? (

            <div className="px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">

              <AlertTriangle className="w-4 h-4 text-rose-600" />

              {clashEventIds.size} Conflicting Booking Detected!

            </div>

          ) : (

            <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">

              <CheckCircle2 className="w-4 h-4 text-emerald-600" />

              No Venue Clashes Detected

            </div>

          )}

        </div>

      </div>



      {/* Venue Filter Bar */}

      <div className="flex items-center gap-2 overflow-x-auto pb-2">

        <button

          onClick={() => setSelectedVenue('ALL')}

          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${

            selectedVenue === 'ALL'

              ? 'bg-amber-600 text-white border-amber-600'

              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'

          }`}

        >

          All Campus Venues ({events.length} Bookings)

        </button>

        {venues.map(v => (

          <button

            key={v}

            onClick={() => setSelectedVenue(v)}

            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${

              selectedVenue === v

                ? 'bg-amber-600 text-white border-amber-600'

                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'

            }`}

          >

            {v.split(' - ')[0]}

          </button>

        ))}

      </div>



      {/* Schedule Roster */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {filteredEvents.map(event => {

          const isClashing = clashEventIds.has(event.id);



          return (

            <div

              key={event.id}

              className={`bg-white rounded-2xl border p-5 space-y-3 transition-all ${

                isClashing

                  ? 'border-rose-300 bg-rose-50/20'

                  : 'border-slate-200'

              }`}

            >

              <div className="flex items-center justify-between text-xs">

                <span className="font-semibold text-amber-700">{event.category}</span>

                <span

                  className={`font-semibold ${

                    isClashing ? 'text-rose-700' : 'text-slate-500'

                  }`}

                >

                  {isClashing ? '⚠️ Venue Conflict' : event.status}

                </span>

              </div>



              <h3 className="font-bold text-slate-900 text-sm">{event.title}</h3>



              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2">

                <div className="flex items-center gap-1.5">

                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />

                  <span className="font-semibold text-slate-800 truncate">{event.venue}</span>

                </div>

                <div className="flex items-center gap-1.5 font-mono tabular-nums text-slate-700">

                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                  <span>{event.startDate} to {event.endDate}</span>

                </div>

                <div className="flex items-center gap-1.5 font-mono tabular-nums text-slate-600">

                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                  <span>{event.startTime} - {event.endTime}</span>

                </div>

                <div className="flex items-center gap-1.5 text-slate-600">

                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                  <span>Expected Attendees: <strong>{event.maxSeats}</strong></span>

                </div>

              </div>



              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">

                Department: {event.department} · Coordinator: {event.coordinatorName}

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

};
