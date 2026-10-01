import React, { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext.jsx';

import { apiService } from '../../services/api.js';

import {

  Calendar,

  Clock,

  MapPin,

  Users,

  ArrowLeft,

  CheckCircle,

  Phone,

} from 'lucide-react';



export const EventDetails = () => {

  const { user, role, selectedEventId, setCurrentPage } = useAuth();

  const [event, setEvent] = useState(null);

  const [isRegistered, setIsRegistered] = useState(false);

  const [registration, setRegistration] = useState(null);

  const [teamName, setTeamName] = useState('');

  const [teamMembers, setTeamMembers] = useState(['']);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const [successMessage, setSuccessMessage] = useState(null);



  useEffect(() => {

    const loadDetails = async () => {

      if (!selectedEventId) return;

      const found = await apiService.getEventById(selectedEventId);

      if (found) {

        setEvent(found);

      }



      if (user) {

        const userRegs = await apiService.getUserRegistrations(user.id);

        const existing = userRegs.find(r => r.eventId === selectedEventId);

        if (existing) {

          setIsRegistered(true);

          setRegistration(existing);

        }

      }

    };

    loadDetails();

  }, [selectedEventId, user]);



  if (!event) {

    return (

      <div className="max-w-4xl mx-auto px-4 py-16 text-center">

        <p className="text-slate-500 text-sm">Event not found.</p>

        <button

          onClick={() => setCurrentPage('events')}

          className="mt-4 text-xs font-semibold text-amber-700 hover:underline inline-flex items-center gap-1"

        >

          <ArrowLeft className="w-3.5 h-3.5" /> Back to Events

        </button>

      </div>

    );

  }



  const isDeadlinePassed = new Date(event.registrationDeadline).getTime() < Date.now();

  const isFull = event.registeredCount >= event.maxSeats;

  const isCompleted = event.status === 'COMPLETED';



  const handleAddTeammate = () => {

    if (teamMembers.length < event.maxTeamSize - 1) {

      setTeamMembers([...teamMembers, '']);

    }

  };



  const handleUpdateTeammate = (index, val) => {

    const updated = [...teamMembers];

    updated[index] = val;

    setTeamMembers(updated);

  };



  const handleRemoveTeammate = (index) => {

    setTeamMembers(teamMembers.filter((_, i) => i !== index));

  };



  const handleRegister = async (e) => {

    e.preventDefault();

    if (!user) {

      setCurrentPage('login');

      return;

    }



    setErrorMessage(null);

    setSuccessMessage(null);

    setIsSubmitting(true);



    try {

      const filteredMembers = teamMembers.map(m => m.trim()).filter(Boolean);

      const reg = await apiService.registerForEvent({

        eventId: event.id,

        user,

        teamName: teamName.trim() || undefined,

        teamMembers: filteredMembers.length > 0 ? filteredMembers : undefined,

      });



      setIsRegistered(true);

      setRegistration(reg);

      setSuccessMessage('Registration confirmed! You can view your entry pass in My Registrations.');



      const updated = await apiService.getEventById(event.id);

      if (updated) setEvent(updated);

    } catch (err) {

      setErrorMessage(err.message || 'Registration failed');

    } finally {

      setIsSubmitting(false);

    }

  };



  return (

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div>

        <button

          onClick={() => setCurrentPage('events')}

          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"

        >

          <ArrowLeft className="w-4 h-4" /> Back to All Events

        </button>

      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">

            <div className="space-y-2">

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">

                <span className="font-semibold text-amber-700">{event.category}</span>

                <span aria-hidden="true">·</span>

                <span>{event.department}</span>

                <span aria-hidden="true">·</span>

                <span className={`font-semibold ${

                  isCompleted ? 'text-slate-500' : 'text-emerald-700'

                }`}>

                  Status: {event.status}

                </span>

              </div>



              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">

                {event.title}

              </h1>

            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">

              <div className="space-y-1">

                <div className="text-slate-500 font-medium flex items-center gap-1.5">

                  <Calendar className="w-3.5 h-3.5 text-amber-600" /> Date & Schedule

                </div>

                <div className="font-semibold text-slate-800">

                  {event.startDate} {event.startDate !== event.endDate ? `to ${event.endDate}` : ''}

                </div>

                <div className="text-slate-500 font-mono tabular-nums">

                  {event.startTime} - {event.endTime}

                </div>

              </div>



              <div className="space-y-1">

                <div className="text-slate-500 font-medium flex items-center gap-1.5">

                  <MapPin className="w-3.5 h-3.5 text-amber-600" /> Campus Venue

                </div>

                <div className="font-semibold text-slate-800">{event.venue}</div>

                <div className="text-slate-500">Bannari Amman Institute of Technology</div>

              </div>



              <div className="space-y-1 pt-2 sm:pt-0 sm:border-t-0 border-t border-slate-200">

                <div className="text-slate-500 font-medium flex items-center gap-1.5">

                  <Users className="w-3.5 h-3.5 text-amber-600" /> Team Size

                </div>

                <div className="font-semibold text-slate-800">

                  {event.minTeamSize === event.maxTeamSize

                    ? `${event.minTeamSize} Student (Solo)`

                    : `${event.minTeamSize} to ${event.maxTeamSize} Students per Team`}

                </div>

              </div>



              <div className="space-y-1 pt-2 sm:pt-0 sm:border-t-0 border-t border-slate-200">

                <div className="text-slate-500 font-medium flex items-center gap-1.5">

                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Registration Deadline

                </div>

                <div className="font-semibold text-slate-800">

                  {new Date(event.registrationDeadline).toLocaleString('en-IN', {

                    dateStyle: 'medium',

                    timeStyle: 'short',

                  })}

                </div>

                {isDeadlinePassed && (

                  <div className="text-rose-600 font-semibold">Deadline passed</div>

                )}

              </div>

            </div>



            <div className="space-y-3">

              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">

                About The Event

              </h2>

              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">

                {event.description}

              </p>

            </div>



            <div className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">

              <div className="font-semibold text-slate-800">Faculty Coordinator:</div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-600">

                <span>{event.coordinatorName}</span>

                <span className="font-mono tabular-nums flex items-center gap-1 text-slate-700">

                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {event.coordinatorContact}

                </span>

              </div>

            </div>



            {isCompleted && (

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">

                <div className="font-bold flex items-center gap-1.5 text-amber-900">

                  <CheckCircle className="w-4 h-4 text-amber-700" /> Event Completed

                </div>

                <p>

                  This event concluded. If you registered and attended, please navigate to the{' '}

                  <button

                    onClick={() => setCurrentPage('feedback')}

                    className="font-bold underline hover:text-amber-950"

                  >

                    Feedback Page

                  </button>{' '}

                  to evaluate the sessions, then download your official Bannari Amman Institute of Technology certificate on the{' '}

                  <button

                    onClick={() => setCurrentPage('certificates')}

                    className="font-bold underline hover:text-amber-950"

                  >

                    Certificates Page

                  </button>

                  .

                </p>

              </div>

            )}

          </div>

        </div>



        <div className="space-y-6">

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">

            <div>

              <h3 className="text-base font-bold text-slate-900">Event Registration</h3>

              <p className="text-xs text-slate-500 mt-0.5">

                Seat availability & registration details

              </p>

            </div>



            <div className="space-y-2">

              <div className="flex items-center justify-between text-xs text-slate-600">

                <span>Registered Students</span>

                <span className="font-bold tabular-nums">

                  {event.registeredCount} / {event.maxSeats}

                </span>

              </div>

              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">

                <div

                  className="h-full bg-amber-600 rounded-full transition-all"

                  style={{

                    width: `${Math.min(100, (event.registeredCount / event.maxSeats) * 100)}%`,

                  }}

                />

              </div>

              <div className="text-[11px] text-slate-400">

                {Math.max(0, event.maxSeats - event.registeredCount)} seats remaining

              </div>

            </div>



            {errorMessage && (

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">

                {errorMessage}

              </div>

            )}



            {successMessage && (

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700">

                {successMessage}

              </div>

            )}



            {isRegistered ? (

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-xs">

                <div className="flex items-center gap-2 font-bold text-emerald-800">

                  <CheckCircle className="w-4 h-4 text-emerald-600" /> You Are Registered!

                </div>

                <div className="text-slate-600">

                  Ticket Code:{' '}

                  <span className="font-mono font-bold text-slate-900">

                    {registration?.ticketCode}

                  </span>

                </div>

                <button

                  onClick={() => setCurrentPage('my-registrations')}

                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors"

                >

                  View Ticket & Pass

                </button>

              </div>

            ) : isCompleted ? (

              <div className="p-4 bg-slate-100 rounded-xl text-center text-xs text-slate-600">

                This event has already ended. Registrations are closed.

              </div>

            ) : isDeadlinePassed ? (

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-700">

                The registration deadline for this event has passed.

              </div>

            ) : isFull ? (

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-800">

                All seats for this event are fully booked.

              </div>

            ) : role !== 'STUDENT' ? (

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">

                <div className="font-semibold text-slate-800">{role} Mode Active</div>

                <p className="text-slate-600">

                  You are logged in as {role}. To register as a student, switch your role in the top header.

                </p>

                <button

                  onClick={() => setCurrentPage('manage-events')}

                  className="w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold"

                >

                  Manage This Event

                </button>

              </div>

            ) : (

              <form onSubmit={handleRegister} className="space-y-4">

                <div className="text-xs text-slate-600 space-y-1 border-b border-slate-100 pb-3">

                  <div>

                    Registering as: <strong>{user?.name}</strong>

                  </div>

                  <div>

                    Roll Number: <span className="font-mono">{user?.rollNumber || 'N/A'}</span>

                  </div>

                  <div>Department: {user?.department}</div>

                </div>



                {event.maxTeamSize > 1 && (

                  <div className="space-y-3 pt-1">

                    <div>

                      <label className="block text-xs font-semibold text-slate-700 mb-1">

                        Team Name (Optional)

                      </label>

                      <input

                        type="text"

                        placeholder="e.g. CodeWarriors"

                        value={teamName}

                        onChange={e => setTeamName(e.target.value)}

                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-amber-600 focus:outline-none"

                      />

                    </div>



                    <div className="space-y-2">

                      <label className="block text-xs font-semibold text-slate-700">

                        Teammates (Up to {event.maxTeamSize - 1} additional)

                      </label>

                      {teamMembers.map((member, idx) => (

                        <div key={idx} className="flex items-center gap-2">

                          <input

                            type="text"

                            placeholder={`Member ${idx + 2} Name & Roll (e.g. Vignesh - 221CS199)`}

                            value={member}

                            onChange={e => handleUpdateTeammate(idx, e.target.value)}

                            className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:border-amber-600 focus:outline-none"

                          />

                          {teamMembers.length > 1 && (

                            <button

                              type="button"

                              onClick={() => handleRemoveTeammate(idx)}

                              className="text-xs text-rose-600 hover:text-rose-800 px-1"

                            >

                              ✕

                            </button>

                          )}

                        </div>

                      ))}



                      {teamMembers.length < event.maxTeamSize - 1 && (

                        <button

                          type="button"

                          onClick={handleAddTeammate}

                          className="text-xs text-amber-700 hover:text-amber-800 font-semibold"

                        >

                          + Add Another Teammate

                        </button>

                      )}

                    </div>

                  </div>

                )}



                <button

                  type="submit"

                  disabled={isSubmitting}

                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"

                >

                  {isSubmitting ? 'Registering...' : 'Confirm Registration'}

                </button>

              </form>

            )}

          </div>

        </div>

      </div>

    </div>

  );

};
