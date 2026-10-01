import React, { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';

import { apiService } from '../../services/api';

import {

  CalendarCheck,

  CheckCircle,

  XCircle,

  Search,

  ArrowLeft,

} from 'lucide-react';



export const AdminEventApprovals = () => {

  const { setCurrentPage } = useAuth();

  const [events, setEvents] = useState([]);

  const [filter, setFilter] = useState('PENDING');

  const [search, setSearch] = useState('');

  const [actionEvent, setActionEvent] = useState(null);

  const [rejectionReason, setRejectionReason] = useState('');

  const [showRejectModal, setShowRejectModal] = useState(false);

  const [successMsg, setSuccessMsg] = useState(null);



  const loadEvents = async () => {

    const list = await apiService.getAllEvents(true);

    setEvents(list);

  };



  useEffect(() => {

    loadEvents();

  }, []);



  const handleApprove = async (eventId, title) => {

    await apiService.approveEvent(eventId, true);

    setSuccessMsg(`"${title}" has been approved! It is now published live on the BIT student portal.`);

    setTimeout(() => setSuccessMsg(null), 3500);

    await loadEvents();

  };



  const handleConfirmReject = async (e) => {

    e.preventDefault();

    if (!actionEvent) return;



    await apiService.approveEvent(actionEvent.id, false, rejectionReason.trim() || 'Proposal does not satisfy college criteria');

    setShowRejectModal(false);

    setActionEvent(null);

    setRejectionReason('');

    setSuccessMsg(`"${actionEvent.title}" proposal was declined.`);

    setTimeout(() => setSuccessMsg(null), 3500);

    await loadEvents();

  };



  const filtered = events.filter(e => {

    const matchesFilter = filter === 'ALL' || e.approvalStatus === filter;

    const matchesSearch =

      search === '' ||

      e.title.toLowerCase().includes(search.toLowerCase()) ||

      e.venue.toLowerCase().includes(search.toLowerCase()) ||

      (e.department && e.department.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;

  });



  const pendingCount = events.filter(e => e.approvalStatus === 'PENDING').length;



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

            Event Approval & Academic Clearance

          </h1>

          <p className="text-xs text-slate-500 mt-0.5">

            Review event proposals submitted by Faculty Event Coordinators before releasing registrations to students.

          </p>

        </div>

      </div>



      {successMsg && (

        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">

          <CheckCircle className="w-4 h-4 text-emerald-600" />

          {successMsg}

        </div>

      )}



      {/* Filter and Search Bar */}

      <div className="flex flex-col sm:flex-row gap-3">

        <div className="relative flex-1">

          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />

          <input

            type="text"

            placeholder="Search proposals by title, venue, or department..."

            value={search}

            onChange={e => setSearch(e.target.value)}

            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-amber-600"

          />

        </div>



        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">

          {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(st => (

            <button

              key={st}

              onClick={() => setFilter(st)}

              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${

                filter === st

                  ? 'bg-white text-slate-900 shadow-sm font-semibold'

                  : 'text-slate-600 hover:text-slate-900'

              }`}

            >

              {st === 'PENDING' ? `Pending (${pendingCount})` : st.charAt(0) + st.slice(1).toLowerCase()}

            </button>

          ))}

        </div>

      </div>



      {/* Proposals Grid */}

      {filtered.length === 0 ? (

        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">

          <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />

          <p className="font-bold text-slate-800 text-sm">No Event Proposals Found</p>

          <p className="mt-1">

            {filter === 'PENDING'

              ? 'All faculty event submissions have been evaluated. No pending items.'

              : 'No proposals match the current filter selection.'}

          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {filtered.map(event => {

            const isPending = event.approvalStatus === 'PENDING';

            const isApproved = event.approvalStatus === 'APPROVED';



            return (

              <div

                key={event.id}

                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-slate-300 transition-all shadow-2xs"

              >

                <div className="space-y-3 flex-1">

                  <div className="flex flex-wrap items-center gap-2 text-xs">

                    <span className="font-semibold text-amber-700">{event.category}</span>

                    <span aria-hidden="true" className="text-slate-300">·</span>

                    <span className="text-slate-600">{event.department}</span>

                    <span aria-hidden="true" className="text-slate-300">·</span>

                    <span

                      className={`font-semibold ${

                        isPending

                          ? 'text-amber-800'

                          : isApproved

                          ? 'text-emerald-700'

                          : 'text-rose-700'

                      }`}

                    >

                      {event.approvalStatus}

                    </span>

                  </div>



                  <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>



                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">

                    {event.description}

                  </p>



                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">

                    <div>

                      <span className="text-slate-400">Venue:</span>{' '}

                      <strong className="text-slate-800">{event.venue}</strong>

                    </div>

                    <div>

                      <span className="text-slate-400">Date & Time:</span>{' '}

                      <strong className="text-slate-800 font-mono tabular-nums">{event.startDate} ({event.startTime})</strong>

                    </div>

                    <div>

                      <span className="text-slate-400">Max Capacity:</span>{' '}

                      <strong className="text-slate-800 tabular-nums">{event.maxSeats} Students</strong>

                    </div>

                  </div>



                  <div className="text-[11px] text-slate-500">

                    Proposed by Coordinator:{' '}

                    <strong>{event.coordinatorName}</strong> · Contact:{' '}

                    <span className="font-mono">{event.coordinatorContact}</span>

                  </div>



                  {event.rejectionReason && (

                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">

                      <strong>Declined Reason:</strong> {event.rejectionReason}

                    </div>

                  )}

                </div>



                {/* Action Buttons */}

                <div className="flex flex-row lg:flex-col items-center justify-end gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">

                  {isPending ? (

                    <>

                      <button

                        onClick={() => handleApprove(event.id, event.title)}

                        className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"

                      >

                        <CheckCircle className="w-4 h-4" />

                        Approve Proposal

                      </button>

                      <button

                        onClick={() => {

                          setActionEvent(event);

                          setShowRejectModal(true);

                        }}

                        className="w-full px-4 py-2 bg-white hover:bg-rose-50 border border-slate-200 text-rose-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"

                      >

                        <XCircle className="w-4 h-4" />

                        Decline

                      </button>

                    </>

                  ) : isApproved ? (

                    <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">

                      <CheckCircle className="w-4 h-4" /> Sanctioned & Published

                    </div>

                  ) : (

                    <button

                      onClick={() => handleApprove(event.id, event.title)}

                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"

                    >

                      Re-Approve Event

                    </button>

                  )}

                </div>

              </div>

            );

          })}

        </div>

      )}



      {/* Reject Reason Modal */}

      {showRejectModal && actionEvent && (

        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">

            <h3 className="text-base font-bold text-slate-900">

              Decline Event Proposal

            </h3>

            <p className="text-slate-500">

              Provide feedback to <strong>{actionEvent.coordinatorName}</strong> explaining why &ldquo;{actionEvent.title}&rdquo; cannot be scheduled at this time.

            </p>



            <form onSubmit={handleConfirmReject} className="space-y-4">

              <textarea

                required

                rows={3}

                placeholder="e.g. Venue is reserved for Anna University Zone Sports Meet; please reschedule to next weekend..."

                value={rejectionReason}

                onChange={e => setRejectionReason(e.target.value)}

                className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"

              />



              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">

                <button

                  type="button"

                  onClick={() => setShowRejectModal(false)}

                  className="px-4 py-2 text-slate-600 font-medium"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm"

                >

                  Confirm Decline

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

};
