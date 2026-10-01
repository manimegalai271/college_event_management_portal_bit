import React, { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext.jsx';

import { apiService } from '../../services/api.js';

import {

  Calendar,

  Users,

  MessageSquare,

  Award,

  PlusCircle,

  ArrowRight,

  AlertCircle,

} from 'lucide-react';



export const FacultyDashboard = () => {

  const { user, setCurrentPage, setSelectedEventId } = useAuth();

  const [events, setEvents] = useState([]);

  const [registrations, setRegistrations] = useState([]);

  const [feedbacks, setFeedbacks] = useState([]);

  const [certificates, setCertificates] = useState([]);



  useEffect(() => {

    const load = async () => {

      const evs = await apiService.getAllEvents(true);

      const fbs = await apiService.getEventFeedbacks();

      const certs = await apiService.getAllCertificates();

      const allRegs = await apiService.getAllRegistrations();



      setEvents(evs);

      setRegistrations(allRegs);

      setFeedbacks(fbs);

      setCertificates(certs);

    };

    load();

  }, []);



  const upcomingCount = events.filter(e => e.status === 'UPCOMING').length;

  const completedCount = events.filter(e => e.status === 'COMPLETED').length;

  const pendingApprovals = events.filter(e => e.approvalStatus === 'PENDING');



  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Faculty Header */}

      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div className="space-y-2">

            <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold">

              Faculty Event Convener Portal · Bannari Amman Institute of Technology

            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">

              Welcome, {user?.name || 'Faculty Member'}!

            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">

              <span>{user?.designation || 'Associate Professor'}</span>

              <span aria-hidden="true">·</span>

              <span>{user?.department}</span>

              <span aria-hidden="true">·</span>

              <span>Employee ID: {user?.employeeId || 'BIT-FAC-2018'}</span>

            </div>

          </div>



          <div className="flex flex-wrap items-center gap-3">

            <button

              onClick={() => setCurrentPage('create-event')}

              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"

            >

              <PlusCircle className="w-4 h-4" />

              Propose New Event

            </button>

            <button

              onClick={() => setCurrentPage('manage-events')}

              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm border border-white/20"

            >

              Manage Events ({events.length})

            </button>

          </div>

        </div>

      </div>



      {pendingApprovals.length > 0 && (

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">

          <div className="flex items-center gap-2">

            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />

            <span>

              You have <strong>{pendingApprovals.length} event proposal(s)</strong> awaiting administrative review by the Principal & Academic Council.

            </span>

          </div>

          <button

            onClick={() => setCurrentPage('manage-events')}

            className="font-bold underline hover:text-amber-950 ml-2 shrink-0"

          >

            Check Status

          </button>

        </div>

      )}



      {/* Key Metric Indicators */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl border border-slate-200">

          <div className="text-slate-500 text-xs font-medium">Department Events</div>

          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">

            {events.length}

          </div>

          <div className="mt-1 text-[11px] text-slate-500">

            {upcomingCount} upcoming · {completedCount} completed

          </div>

        </div>



        <div className="bg-white p-5 rounded-xl border border-slate-200">

          <div className="text-slate-500 text-xs font-medium">Student Participants</div>

          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">

            {registrations.length}

          </div>

          <div className="mt-1 text-[11px] text-slate-500">Registered across sessions</div>

        </div>



        <div className="bg-white p-5 rounded-xl border border-slate-200">

          <div className="text-slate-500 text-xs font-medium">Feedbacks Received</div>

          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">

            {feedbacks.length}

          </div>

          <div className="mt-1 text-[11px] text-slate-500">Student evaluations</div>

        </div>



        <div className="bg-white p-5 rounded-xl border border-slate-200">

          <div className="text-slate-500 text-xs font-medium">Certificates Issued</div>

          <div className="mt-2 text-2xl font-bold text-amber-700 tabular-nums">

            {certificates.length}

          </div>

          <div className="mt-1 text-[11px] text-slate-500">Authorized credentials</div>

        </div>

      </div>



      {/* Navigation Shortcut Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div

          onClick={() => setCurrentPage('manage-events')}

          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-3 group"

        >

          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">

            <Calendar className="w-5 h-5" />

          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">

            Manage Event Lifecycle

          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">

            Update venue arrangements, modify capacities, or mark events completed to enable feedback & certificates.

          </p>

          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 pt-1">

            Open Event Manager <ArrowRight className="w-3.5 h-3.5" />

          </div>

        </div>



        <div

          onClick={() => setCurrentPage('participants')}

          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-3 group"

        >

          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">

            <Users className="w-5 h-5" />

          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">

            Participant Rosters & Attendance

          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">

            Inspect registered students by event, verify QR ticket passes, and download attendance lists as CSV.

          </p>

          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 pt-1">

            View Participants <ArrowRight className="w-3.5 h-3.5" />

          </div>

        </div>



        <div

          onClick={() => setCurrentPage('certificate-management')}

          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-3 group"

        >

          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">

            <Award className="w-5 h-5" />

          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">

            Batch Issue Certificates

          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">

            Generate official Bannari Amman Institute of Technology participation credentials for completed events.

          </p>

          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 pt-1">

            Issue Certificates <ArrowRight className="w-3.5 h-3.5" />

          </div>

        </div>

      </div>



      {/* Events Quick Overview Table */}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

        <div className="p-5 border-b border-slate-200 flex items-center justify-between">

          <div>

            <h3 className="text-base font-bold text-slate-900">Department Event Schedule</h3>

            <p className="text-xs text-slate-500">Live registrations and approval statuses</p>

          </div>

          <button

            onClick={() => setCurrentPage('manage-events')}

            className="text-xs font-semibold text-amber-700 hover:text-amber-800"

          >

            Manage All

          </button>

        </div>



        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">

              <tr>

                <th className="px-5 py-3">Event Title</th>

                <th className="px-5 py-3">Approval</th>

                <th className="px-5 py-3">Date</th>

                <th className="px-5 py-3">Status</th>

                <th className="px-5 py-3 text-right">Registrations</th>

                <th className="px-5 py-3 text-right">Actions</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {events.slice(0, 5).map(event => (

                <tr key={event.id} className="hover:bg-slate-50/70 transition-colors">

                  <td className="px-5 py-3.5 font-bold text-slate-900 max-w-xs truncate">

                    {event.title}

                  </td>

                  <td className="px-5 py-3.5">

                    <span

                      className={`font-semibold text-[11px] ${

                        event.approvalStatus === 'APPROVED'

                          ? 'text-emerald-700'

                          : event.approvalStatus === 'PENDING'

                          ? 'text-amber-800'

                          : 'text-rose-700'

                      }`}

                    >

                      {event.approvalStatus}

                    </span>

                  </td>

                  <td className="px-5 py-3.5 text-slate-600 font-mono tabular-nums">

                    {event.startDate}

                  </td>

                  <td className="px-5 py-3.5">

                    <span

                      className={`font-semibold text-[11px] ${

                        event.status === 'COMPLETED'

                          ? 'text-slate-500'

                          : event.status === 'ONGOING'

                          ? 'text-emerald-700'

                          : 'text-blue-700'

                      }`}

                    >

                      {event.status}

                    </span>

                  </td>

                  <td className="px-5 py-3.5 text-right font-mono tabular-nums font-semibold text-slate-800">

                    {event.registeredCount} / {event.maxSeats}

                  </td>

                  <td className="px-5 py-3.5 text-right">

                    <button

                      onClick={() => {

                        setSelectedEventId(event.id);

                        setCurrentPage('manage-events');

                      }}

                      className="text-amber-700 hover:text-amber-800 font-semibold"

                    >

                      Configure

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

};
