import React, { useState, useEffect } from 'react';

import { apiService } from '../../services/api.js';

import {

  Award,

  CheckCircle2,

  AlertCircle,

} from 'lucide-react';



export const CertificateManagement = () => {

  const [events, setEvents] = useState([]);

  const [selectedEventId, setSelectedEventId] = useState(null);

  const [participants, setParticipants] = useState([]);

  const [certificates, setCertificates] = useState([]);

  const [isGenerating, setIsGenerating] = useState(false);

  const [message, setMessage] = useState(null);



  const loadData = async () => {

    const evs = await apiService.getAllEvents(true);

    setEvents(evs);



    const completed = evs.find(e => e.status === 'COMPLETED');

    const initialId = completed ? completed.id : evs.length > 0 ? evs[0].id : null;

    setSelectedEventId(prev => prev || initialId);



    const allCerts = await apiService.getAllCertificates();

    setCertificates(allCerts);

  };



  useEffect(() => {

    loadData();

  }, []);



  useEffect(() => {

    const loadParticipants = async () => {

      if (!selectedEventId) return;

      const regs = await apiService.getEventRegistrations(selectedEventId);

      setParticipants(regs);

    };

    loadParticipants();

  }, [selectedEventId]);



  const selectedEvent = events.find(e => e.id === selectedEventId);

  const isCompleted = selectedEvent?.status === 'COMPLETED';



  const issuedUserIds = certificates

    .filter(c => c.eventId === selectedEventId)

    .map(c => c.userId);



  const pendingCount = participants.filter(p => !issuedUserIds.includes(p.userId)).length;



  const handleGenerateCertificates = async () => {

    if (!selectedEventId) return;

    setIsGenerating(true);

    setMessage(null);



    try {

      const count = await apiService.generateCertificatesForEvent(selectedEventId);

      setMessage({

        text: `Successfully generated and issued ${count} certificates with BIT institutional credentials!`,

        type: 'success',

      });

      await loadData();

    } catch (err) {

      setMessage({

        text: err.message || 'Failed to generate certificates',

        type: 'error',

      });

    } finally {

      setIsGenerating(false);

    }

  };



  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="border-b border-slate-200 pb-5">

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">

          Certificate Issuance & Credentials Management

        </h1>

        <p className="text-xs text-slate-500 mt-0.5">

          Generate official Bannari Amman Institute of Technology participation certificates for verified event attendees.

        </p>

      </div>



      {message && (

        <div

          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${

            message.type === 'success'

              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'

              : 'bg-rose-50 text-rose-800 border border-rose-200'

          }`}

        >

          {message.type === 'success' ? (

            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

          ) : (

            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />

          )}

          <span>{message.text}</span>

        </div>

      )}



      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="space-y-1">

            <label className="block text-xs font-semibold text-slate-700">

              Select Completed Campus Event:

            </label>

            <select

              value={selectedEventId || ''}

              onChange={e => {

                setSelectedEventId(Number(e.target.value));

                setMessage(null);

              }}

              className="text-xs px-3.5 py-2 rounded-lg border border-slate-300 font-semibold text-slate-800 bg-white focus:outline-none focus:border-amber-600"

            >

              {events.map(ev => (

                <option key={ev.id} value={ev.id}>

                  {ev.title} ({ev.status})

                </option>

              ))}

            </select>

          </div>



          <div className="flex items-center gap-3">

            {isCompleted ? (

              <button

                onClick={handleGenerateCertificates}

                disabled={isGenerating || participants.length === 0 || pendingCount === 0}

                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

              >

                <Award className="w-4 h-4" />

                {isGenerating

                  ? 'Generating Certificates...'

                  : pendingCount === 0

                  ? 'All Certificates Issued'

                  : `Batch Issue Certificates (${pendingCount} Pending)`}

              </button>

            ) : (

              <div className="text-xs text-amber-800 bg-amber-50 px-3.5 py-2 rounded-lg border border-amber-200">

                Mark event as &ldquo;COMPLETED&rdquo; in Manage Events to enable certificates.

              </div>

            )}

          </div>

        </div>



        {selectedEvent && (

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">

            <div>

              <span className="text-slate-400">Total Registered:</span>{' '}

              <strong className="text-slate-800 font-mono tabular-nums">{participants.length}</strong>

            </div>

            <div>

              <span className="text-slate-400">Certificates Issued:</span>{' '}

              <strong className="text-emerald-700 font-mono tabular-nums">{issuedUserIds.length}</strong>

            </div>

            <div>

              <span className="text-slate-400">Pending Issuance:</span>{' '}

              <strong className="text-amber-800 font-mono tabular-nums">{pendingCount}</strong>

            </div>

          </div>

        )}

      </div>



      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

        <div className="p-5 border-b border-slate-200 flex items-center justify-between">

          <h3 className="text-base font-bold text-slate-900">

            Participant Certificate Registry

          </h3>

          <span className="text-xs text-slate-500">

            College: Bannari Amman Institute of Technology

          </span>

        </div>



        {participants.length === 0 ? (

          <div className="p-12 text-center text-xs text-slate-500">

            No participants registered for this event.

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs">

              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">

                <tr>

                  <th className="px-5 py-3.5">Student Name</th>

                  <th className="px-5 py-3.5">Roll Number</th>

                  <th className="px-5 py-3.5">Department</th>

                  <th className="px-5 py-3.5">Ticket Code</th>

                  <th className="px-5 py-3.5">Certificate Status</th>

                  <th className="px-5 py-3.5 text-right">Serial ID</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {participants.map(p => {

                  const cert = certificates.find(

                    c => c.eventId === selectedEventId && c.userId === p.userId

                  );

                  const isIssued = !!cert;



                  return (

                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">

                      <td className="px-5 py-4 font-bold text-slate-900">{p.userName}</td>

                      <td className="px-5 py-4 font-mono text-slate-700">

                        {p.userRollNumber || 'N/A'}

                      </td>

                      <td className="px-5 py-4 text-slate-600">{p.userDepartment}</td>

                      <td className="px-5 py-4 font-mono text-slate-600">{p.ticketCode}</td>

                      <td className="px-5 py-4">

                        {isIssued ? (

                          <span className="text-emerald-700 font-semibold flex items-center gap-1">

                            <CheckCircle2 className="w-3.5 h-3.5" /> Issued

                          </span>

                        ) : (

                          <span className="text-amber-800 font-semibold">Ready to Generate</span>

                        )}

                      </td>

                      <td className="px-5 py-4 text-right font-mono text-[11px] text-slate-500">

                        {cert?.certificateNumber || '—'}

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

};
