import React, { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';

import { apiService } from '../../services/api';

import {

  ShieldCheck,

  CalendarCheck,

  Users,

  Award,

  AlertCircle,

  Building2,

  Megaphone,

} from 'lucide-react';



export const AdminExecutiveOverview = () => {

  const { setCurrentPage } = useAuth();

  const [events, setEvents] = useState([]);

  const [users, setUsers] = useState([]);

  const [registrations, setRegistrations] = useState([]);

  const [announcements, setAnnouncements] = useState([]);

  const [newNoticeTitle, setNewNoticeTitle] = useState('');

  const [newNoticeContent, setNewNoticeContent] = useState('');

  const [newNoticeAudience, setNewNoticeAudience] = useState('ALL');

  const [isPostingNotice, setIsPostingNotice] = useState(false);



  const loadData = async () => {

    const allEvents = await apiService.getAllEvents(true);

    const allUsers = await apiService.getAllUsers();

    const allRegs = await apiService.getAllRegistrations();

    const allAnnouncements = await apiService.getAnnouncements();



    setEvents(allEvents);

    setUsers(allUsers);

    setRegistrations(allRegs);

    setAnnouncements(allAnnouncements);

  };



  useEffect(() => {

    loadData();

  }, []);



  const pendingApprovals = events.filter(e => e.approvalStatus === 'PENDING');

  const facultyMembers = users.filter(u => u.role === 'FACULTY');



  // Department counts

  const departmentCounts = {};

  events.forEach(e => {

    const dept = e.department || 'All Departments';

    if (!departmentCounts[dept]) departmentCounts[dept] = { events: 0, registrations: 0 };

    departmentCounts[dept].events += 1;

    departmentCounts[dept].registrations += e.registeredCount || 0;

  });



  const handlePostAnnouncement = async (e) => {

    e.preventDefault();

    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;



    setIsPostingNotice(true);

    try {

      await apiService.createAnnouncement({

        title: newNoticeTitle.trim(),

        content: newNoticeContent.trim(),

        targetAudience: newNoticeAudience,

        postedBy: 'Office of the Principal & Academic Council',

        priority: 'NORMAL',

      });

      setNewNoticeTitle('');

      setNewNoticeContent('');

      await loadData();

    } finally {

      setIsPostingNotice(false);

    }

  };



  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Executive Institutional Header */}

      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div className="space-y-2">

            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-semibold">

              <ShieldCheck className="w-4 h-4 text-amber-400" />

              Institutional Administration · Chief Academic Officer

            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">

              Bannari Amman Institute of Technology — Event Governance

            </h1>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">

              Institutional dashboard overseeing department symposium proposals, venue scheduling, student participation audits, and academic NAAC/NBA event compliance.

            </p>

          </div>



          <div className="flex flex-wrap items-center gap-3">

            <button

              onClick={() => setCurrentPage('admin-event-approvals')}

              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors shadow-sm flex items-center gap-2"

            >

              <CalendarCheck className="w-4 h-4" />

              Pending Approvals ({pendingApprovals.length})

            </button>

            <button

              onClick={() => setCurrentPage('admin-user-management')}

              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm border border-white/20"

            >

              Manage Users & Faculty

            </button>

          </div>

        </div>

      </div>



      {/* Critical Approval Notice Ticker */}

      {pendingApprovals.length > 0 && (

        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">

          <div className="flex items-center gap-2.5 text-amber-950 font-medium">

            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />

            <span>

              <strong>{pendingApprovals.length} Event Proposal(s)</strong> submitted by Faculty Coordinators are awaiting administrative review and venue sanctioning.

            </span>

          </div>

          <button

            onClick={() => setCurrentPage('admin-event-approvals')}

            className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg shrink-0"

          >

            Review Proposals

          </button>

        </div>

      )}



      {/* High-Level Institutional Metrics */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl border border-slate-200">

          <div className="text-slate-500 text-xs font-medium">Total Campus Events</div>

          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">

            {events.length}

          </div>

          <div className="mt-1 text-[11px] text-slate-500">Across 10 academic depts</div>

        </div>



        <div className="bg-white p-5 rounded-xl border border-slate-200">

          <div className="text-slate-500 text-xs font-medium">Total Student Registrations</div>

          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">

            {registrations.length}

          </div>

          <div className="mt-1 text-[11px] text-slate-500">Live campus engagements</div>

        </div>



        <div className="bg-white p-5 rounded-xl border border-slate-200">

          <div className="text-slate-500 text-xs font-medium">Faculty Event Coordinators</div>

          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">

            {facultyMembers.length}

          </div>

          <div className="mt-1 text-[11px] text-slate-500">Active conveners</div>

        </div>



        <div className="bg-white p-5 rounded-xl border border-slate-200">

          <div className="text-slate-500 text-xs font-medium">Pending Approvals</div>

          <div className="mt-2 text-2xl font-bold text-amber-700 tabular-nums">

            {pendingApprovals.length}

          </div>

          <div className="mt-1 text-[11px] text-slate-500">Awaiting Dean signature</div>

        </div>

      </div>



      {/* Admin Action Shortcuts */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div

          onClick={() => setCurrentPage('admin-event-approvals')}

          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-2 group"

        >

          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">

            <CalendarCheck className="w-4 h-4" />

          </div>

          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700">

            Event Proposals & Approvals

          </h3>

          <p className="text-xs text-slate-500">

            Sanction dates, allocate auditoriums, verify budgets, and approve faculty proposals.

          </p>

        </div>



        <div

          onClick={() => setCurrentPage('admin-venue-schedule')}

          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-2 group"

        >

          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">

            <Building2 className="w-4 h-4" />

          </div>

          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700">

            Campus Venue Schedule

          </h3>

          <p className="text-xs text-slate-500">

            Prevent clashes across BIT Tech Park, Vedhayana, and Main Auditorium.

          </p>

        </div>



        <div

          onClick={() => setCurrentPage('admin-user-management')}

          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-2 group"

        >

          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">

            <Users className="w-4 h-4" />

          </div>

          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700">

            Faculty & User Governance

          </h3>

          <p className="text-xs text-slate-500">

            Manage roles, promote faculty coordinators, view roll rosters, and audit accounts.

          </p>

        </div>



        <div

          onClick={() => setCurrentPage('admin-accreditation-reports')}

          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-2 group"

        >

          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">

            <Award className="w-4 h-4" />

          </div>

          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700">

            Accreditation Reports (NAAC/NBA)

          </h3>

          <p className="text-xs text-slate-500">

            Generate audit sheets and NIRF metric reports for institutional documentation.

          </p>

        </div>

      </div>



      {/* Grid: Department Leaderboard & Campus Announcements */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Department Leaderboard (2 columns) */}

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">

            <div>

              <h3 className="text-base font-bold text-slate-900">

                Department Activity & Participation

              </h3>

              <p className="text-xs text-slate-500">

                Overview of events hosted and student turnout by department

              </p>

            </div>

            <span className="text-xs text-slate-400 font-mono">Bannari Amman Institute of Technology</span>

          </div>



          <div className="space-y-3 pt-2">

            {Object.entries(departmentCounts).map(([dept, data]) => (

              <div key={dept} className="space-y-1.5">

                <div className="flex items-center justify-between text-xs">

                  <span className="font-semibold text-slate-800">{dept}</span>

                  <span className="text-slate-500 tabular-nums">

                    <strong>{data.events}</strong> events ·{' '}

                    <strong>{data.registrations}</strong> students registered

                  </span>

                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">

                  <div

                    className="h-full bg-amber-600 rounded-full"

                    style={{

                      width: `${Math.min(100, (data.registrations / Math.max(1, registrations.length)) * 100)}%`,

                    }}

                  />

                </div>

              </div>

            ))}

          </div>

        </div>



        {/* College Announcements & Broadcast (1 column) */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">

          <div className="flex items-center gap-2">

            <Megaphone className="w-4 h-4 text-amber-600" />

            <h3 className="text-base font-bold text-slate-900">Campus Circulars</h3>

          </div>



          {/* Form to post new announcement */}

          <form onSubmit={handlePostAnnouncement} className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">

            <div className="font-semibold text-slate-700">Broadcast Official Notice</div>

            <input

              type="text"

              required

              placeholder="Circular Subject..."

              value={newNoticeTitle}

              onChange={e => setNewNoticeTitle(e.target.value)}

              className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 bg-white"

            />

            <textarea

              required

              rows={2}

              placeholder="Policy update or instruction..."

              value={newNoticeContent}

              onChange={e => setNewNoticeContent(e.target.value)}

              className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 bg-white"

            />

            <div className="flex items-center justify-between">

              <select

                value={newNoticeAudience}

                onChange={e => setNewNoticeAudience(e.target.value)}

                className="text-xs px-2 py-1 rounded border border-slate-300 bg-white"

              >

                <option value="ALL">Audience: All Campus</option>

                <option value="FACULTY">Audience: Faculty Only</option>

                <option value="STUDENTS">Audience: Students Only</option>

              </select>

              <button

                type="submit"

                disabled={isPostingNotice}

                className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 disabled:opacity-50"

              >

                {isPostingNotice ? 'Publishing...' : 'Publish'}

              </button>

            </div>

          </form>



          {/* Active announcements list */}

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">

            {announcements.map(notice => (

              <div key={notice.id} className="p-3 rounded-lg border border-slate-200 space-y-1 text-xs">

                <div className="flex items-center justify-between text-[11px]">

                  <span className="font-semibold text-amber-800">{notice.targetAudience}</span>

                  <span className="text-slate-400 font-mono tabular-nums">{notice.date}</span>

                </div>

                <div className="font-bold text-slate-900">{notice.title}</div>

                <p className="text-slate-600 text-[11px] leading-relaxed">{notice.content}</p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

};
