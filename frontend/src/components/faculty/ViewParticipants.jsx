import React, { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext.jsx';

import { apiService } from '../../services/api.js';

import {

  Users,

  Search,

  Download,

} from 'lucide-react';



export const ViewParticipants = () => {

  const { selectedEventId, setSelectedEventId } = useAuth();

  const [events, setEvents] = useState([]);

  const [activeEventId, setActiveEventId] = useState(selectedEventId);

  const [participants, setParticipants] = useState([]);

  const [search, setSearch] = useState('');

  const [deptFilter, setDeptFilter] = useState('ALL');



  useEffect(() => {

    const loadEvents = async () => {

      const list = await apiService.getAllEvents(true);

      setEvents(list);

      if (list.length > 0 && !activeEventId) {

        setActiveEventId(list[0].id);

      }

    };

    loadEvents();

  }, []);



  useEffect(() => {

    const loadParticipants = async () => {

      if (!activeEventId) return;

      const regs = await apiService.getEventRegistrations(activeEventId);

      setParticipants(regs);

    };

    loadParticipants();

  }, [activeEventId]);



  const currentEvent = events.find(e => e.id === activeEventId);



  const filteredParticipants = participants.filter(p => {

    const matchesSearch =

      search === '' ||

      p.userName.toLowerCase().includes(search.toLowerCase()) ||

      p.userEmail.toLowerCase().includes(search.toLowerCase()) ||

      (p.userRollNumber && p.userRollNumber.toLowerCase().includes(search.toLowerCase())) ||

      (p.teamName && p.teamName.toLowerCase().includes(search.toLowerCase())) ||

      p.ticketCode.toLowerCase().includes(search.toLowerCase());



    const matchesDept = deptFilter === 'ALL' || p.userDepartment === deptFilter;

    return matchesSearch && matchesDept;

  });



  const exportToCSV = () => {

    if (!currentEvent || participants.length === 0) return;



    const headers = [

      'Ticket Code',

      'Student Name',

      'Roll Number',

      'Department',

      'Year',

      'Email',

      'Team Name',

      'Teammates',

      'Registered At',

    ];



    const rows = filteredParticipants.map(p => [

      `"${p.ticketCode}"`,

      `"${p.userName}"`,

      `"${p.userRollNumber || 'N/A'}"`,

      `"${p.userDepartment}"`,

      `"${p.userYear || 'N/A'}"`,

      `"${p.userEmail}"`,

      `"${p.teamName || 'Solo'}"`,

      `"${(p.teamMembers || []).join('; ')}"`,

      `"${p.registeredAt}"`,

    ]);



    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.setAttribute(

      'download',

      `BIT_Participants_${currentEvent.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`

    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };



  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">

        <div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">

            Event Participant Rosters

          </h1>

          <p className="text-xs text-slate-500 mt-0.5">

            Monitor registered student attendance, team configurations, and verified ticket passes.

          </p>

        </div>



        {participants.length > 0 && (

          <button

            onClick={exportToCSV}

            className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"

          >

            <Download className="w-4 h-4" />

            Export CSV

          </button>

        )}

      </div>



      <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">

        <div>

          <label className="block text-[11px] font-semibold text-slate-500 mb-1">

            Choose Campus Event

          </label>

          <select

            value={activeEventId || ''}

            onChange={e => {

              setActiveEventId(Number(e.target.value));

              setSelectedEventId(Number(e.target.value));

            }}

            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600 bg-white font-medium"

          >

            {events.map(ev => (

              <option key={ev.id} value={ev.id}>

                {ev.title} ({ev.registeredCount} registered)

              </option>

            ))}

          </select>

        </div>



        <div>

          <label className="block text-[11px] font-semibold text-slate-500 mb-1">

            Search Students

          </label>

          <div className="relative">

            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />

            <input

              type="text"

              placeholder="Search by name, roll, email, ticket..."

              value={search}

              onChange={e => setSearch(e.target.value)}

              className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"

            />

          </div>

        </div>



        <div>

          <label className="block text-[11px] font-semibold text-slate-500 mb-1">

            Department Filter

          </label>

          <select

            value={deptFilter}

            onChange={e => setDeptFilter(e.target.value)}

            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600 bg-white"

          >

            <option value="ALL">All Departments</option>

            <option value="Computer Science & Engineering">CSE</option>

            <option value="Information Technology">IT</option>

            <option value="Artificial Intelligence & Data Science">AI & DS</option>

            <option value="Electronics & Communication Engineering">ECE</option>

            <option value="Mechanical Engineering">Mechanical</option>

            <option value="Biotechnology">Biotechnology</option>

          </select>

        </div>

      </div>



      {currentEvent && (

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 px-1">

          <div>

            Active Roster for:{' '}

            <strong className="text-slate-900">{currentEvent.title}</strong> ·{' '}

            <span className="font-semibold text-amber-700">{currentEvent.venue}</span>

          </div>

          <div className="tabular-nums font-medium">

            Showing <strong>{filteredParticipants.length}</strong> of{' '}

            <strong>{participants.length}</strong> participants

          </div>

        </div>

      )}



      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

        {filteredParticipants.length === 0 ? (

          <div className="p-12 text-center text-xs text-slate-500">

            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />

            <p className="font-semibold text-slate-800 text-sm">No Registered Participants Found</p>

            <p className="mt-1">

              Either no students have registered for this event yet, or no records match your search filter.

            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs">

              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">

                <tr>

                  <th className="px-5 py-3.5">Ticket Pass</th>

                  <th className="px-5 py-3.5">Student Details</th>

                  <th className="px-5 py-3.5">Department & Year</th>

                  <th className="px-5 py-3.5">Team Info</th>

                  <th className="px-5 py-3.5">Registered At</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredParticipants.map(reg => (

                  <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">

                    <td className="px-5 py-4 font-mono font-bold text-slate-800">

                      {reg.ticketCode}

                    </td>



                    <td className="px-5 py-4">

                      <div className="font-bold text-slate-900 text-sm">{reg.userName}</div>

                      <div className="text-[11px] text-slate-500 font-mono">

                        {reg.userRollNumber || 'N/A'} · {reg.userEmail}

                      </div>

                    </td>



                    <td className="px-5 py-4 text-slate-700">

                      <div>{reg.userDepartment}</div>

                      <div className="text-[11px] text-slate-500">

                        {reg.userYear ? `Year ${reg.userYear}` : 'Student'}

                      </div>

                    </td>



                    <td className="px-5 py-4">

                      {reg.teamName ? (

                        <div>

                          <span className="font-bold text-slate-800">{reg.teamName}</span>

                          {reg.teamMembers && reg.teamMembers.length > 0 && (

                            <div className="text-[11px] text-slate-500 mt-0.5">

                              Teammates: {reg.teamMembers.join(', ')}

                            </div>

                          )}

                        </div>

                      ) : (

                        <span className="text-slate-400">Solo Participant</span>

                      )}

                    </td>



                    <td className="px-5 py-4 text-slate-600 font-mono tabular-nums text-[11px]">

                      {reg.registeredAt}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

};
