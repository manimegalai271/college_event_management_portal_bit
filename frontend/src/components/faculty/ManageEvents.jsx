import React, { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext.jsx';

import { apiService } from '../../services/api.js';

import {

  Edit3,

  Trash2,

  PlusCircle,

  Search,

  X,

} from 'lucide-react';



export const ManageEvents = () => {

  const { setCurrentPage, setSelectedEventId } = useAuth();

  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState('ALL');



  const [editingEvent, setEditingEvent] = useState(null);

  const [editTitle, setEditTitle] = useState('');

  const [editVenue, setEditVenue] = useState('');

  const [editMaxSeats, setEditMaxSeats] = useState(100);

  const [editStatus, setEditStatus] = useState('UPCOMING');

  const [isSaving, setIsSaving] = useState(false);



  const fetchEvents = async () => {

    const list = await apiService.getAllEvents(true);

    setEvents(list);

  };



  useEffect(() => {

    fetchEvents();

  }, []);



  const handleQuickStatusChange = async (event, newStatus) => {

    await apiService.updateEvent(event.id, {

      status: newStatus,

      feedbackEnabled: newStatus === 'COMPLETED' ? true : event.feedbackEnabled,

    });

    await fetchEvents();

  };



  const handleDelete = async (id, title) => {

    if (window.confirm(`Are you sure you want to delete "${title}"? All associated registrations will also be removed.`)) {

      await apiService.deleteEvent(id);

      await fetchEvents();

    }

  };



  const openEditModal = (event) => {

    setEditingEvent(event);

    setEditTitle(event.title);

    setEditVenue(event.venue);

    setEditMaxSeats(event.maxSeats);

    setEditStatus(event.status);

  };



  const handleSaveEdit = async (e) => {

    e.preventDefault();

    if (!editingEvent) return;



    setIsSaving(true);

    try {

      await apiService.updateEvent(editingEvent.id, {

        title: editTitle.trim(),

        venue: editVenue.trim(),

        maxSeats: Number(editMaxSeats),

        status: editStatus,

        feedbackEnabled: editStatus === 'COMPLETED' ? true : editingEvent.feedbackEnabled,

      });

      setEditingEvent(null);

      await fetchEvents();

    } catch (err) {

      alert(err.message || 'Failed to update event');

    } finally {

      setIsSaving(false);

    }

  };



  const filtered = events.filter(e => {

    const matchesSearch =

      search === '' ||

      e.title.toLowerCase().includes(search.toLowerCase()) ||

      e.venue.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;

    return matchesSearch && matchesStatus;

  });



  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">

        <div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">

            Manage Campus Events

          </h1>

          <p className="text-xs text-slate-500 mt-0.5">

            Modify event details, toggle active statuses, monitor capacity, or remove past sessions.

          </p>

        </div>



        <button

          onClick={() => setCurrentPage('create-event')}

          className="self-start sm:self-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"

        >

          <PlusCircle className="w-4 h-4" />

          Create Event

        </button>

      </div>



      <div className="flex flex-col sm:flex-row gap-3">

        <div className="relative flex-1">

          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />

          <input

            type="text"

            placeholder="Search events by title or venue..."

            value={search}

            onChange={e => setSearch(e.target.value)}

            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-amber-600"

          />

        </div>



        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">

          {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'].map(status => (

            <button

              key={status}

              onClick={() => setStatusFilter(status)}

              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${

                statusFilter === status

                  ? 'bg-white text-slate-900 shadow-sm font-semibold'

                  : 'text-slate-600 hover:text-slate-900'

              }`}

            >

              {status === 'ALL' ? 'All' : status}

            </button>

          ))}

        </div>

      </div>



      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">

              <tr>

                <th className="px-5 py-3.5">Event Details</th>

                <th className="px-5 py-3.5">Department</th>

                <th className="px-5 py-3.5">Date & Venue</th>

                <th className="px-5 py-3.5">Capacity</th>

                <th className="px-5 py-3.5">Current Status</th>

                <th className="px-5 py-3.5 text-right">Actions</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filtered.map(event => (

                <tr key={event.id} className="hover:bg-slate-50/70 transition-colors">

                  <td className="px-5 py-4 max-w-sm">

                    <div className="font-bold text-slate-900 text-sm leading-snug">

                      {event.title}

                    </div>

                    <div className="text-[11px] text-amber-700 font-semibold mt-0.5">

                      {event.category} · Team: {event.minTeamSize}-{event.maxTeamSize}

                    </div>

                  </td>



                  <td className="px-5 py-4 text-slate-600 font-medium">

                    {event.department === 'All Departments' ? 'All Departments' : event.department}

                  </td>



                  <td className="px-5 py-4 text-slate-600 space-y-0.5">

                    <div className="font-mono tabular-nums font-semibold text-slate-800">

                      {event.startDate}

                    </div>

                    <div className="text-[11px] text-slate-500 truncate max-w-[180px]">

                      {event.venue}

                    </div>

                  </td>



                  <td className="px-5 py-4 font-mono tabular-nums">

                    <span className="font-bold text-slate-900">{event.registeredCount}</span>

                    <span className="text-slate-400"> / {event.maxSeats}</span>

                  </td>



                  <td className="px-5 py-4">

                    <select

                      value={event.status}

                      onChange={e => handleQuickStatusChange(event, e.target.value)}

                      className={`text-xs font-semibold px-2.5 py-1 rounded-md border focus:outline-none ${

                        event.status === 'COMPLETED'

                          ? 'bg-slate-100 text-slate-700 border-slate-300'

                          : event.status === 'ONGOING'

                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'

                          : 'bg-blue-50 text-blue-800 border-blue-300'

                      }`}

                    >

                      <option value="UPCOMING">UPCOMING</option>

                      <option value="ONGOING">ONGOING</option>

                      <option value="COMPLETED">COMPLETED</option>

                      <option value="CANCELLED">CANCELLED</option>

                    </select>

                  </td>



                  <td className="px-5 py-4 text-right">

                    <div className="flex items-center justify-end gap-2">

                      <button

                        onClick={() => openEditModal(event)}

                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"

                        title="Edit Event"

                      >

                        <Edit3 className="w-4 h-4" />

                      </button>

                      <button

                        onClick={() => handleDelete(event.id, event.title)}

                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors"

                        title="Delete Event"

                      >

                        <Trash2 className="w-4 h-4" />

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>



      {editingEvent && (

        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">

              <h3 className="text-base font-bold text-slate-900">Edit Event Details</h3>

              <button

                onClick={() => setEditingEvent(null)}

                className="text-slate-400 hover:text-slate-600 p-1"

              >

                <X className="w-4 h-4" />

              </button>

            </div>



            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">

              <div>

                <label className="block font-semibold text-slate-700 mb-1">Event Title</label>

                <input

                  type="text"

                  required

                  value={editTitle}

                  onChange={e => setEditTitle(e.target.value)}

                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-amber-600 focus:outline-none"

                />

              </div>



              <div>

                <label className="block font-semibold text-slate-700 mb-1">Campus Venue</label>

                <input

                  type="text"

                  required

                  value={editVenue}

                  onChange={e => setEditVenue(e.target.value)}

                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-amber-600 focus:outline-none"

                />

              </div>



              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block font-semibold text-slate-700 mb-1">Max Seats</label>

                  <input

                    type="number"

                    required

                    min={1}

                    value={editMaxSeats}

                    onChange={e => setEditMaxSeats(Number(e.target.value))}

                    className="w-full px-3 py-2 rounded-lg border border-slate-300"

                  />

                </div>



                <div>

                  <label className="block font-semibold text-slate-700 mb-1">Event Status</label>

                  <select

                    value={editStatus}

                    onChange={e => setEditStatus(e.target.value)}

                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"

                  >

                    <option value="UPCOMING">UPCOMING</option>

                    <option value="ONGOING">ONGOING</option>

                    <option value="COMPLETED">COMPLETED</option>

                    <option value="CANCELLED">CANCELLED</option>

                  </select>

                </div>

              </div>



              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-amber-900 text-[11px] leading-relaxed">

                <strong>Notice:</strong> Marking this event as <strong>COMPLETED</strong> immediately allows registered students to submit their post-event feedback and unlocks certificate issuance!

              </div>



              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">

                <button

                  type="button"

                  onClick={() => setEditingEvent(null)}

                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  disabled={isSaving}

                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-sm"

                >

                  {isSaving ? 'Saving...' : 'Save Changes'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

};
