import React, { useState } from 'react';

import { useAuth } from '../../context/AuthContext.jsx';

import { apiService } from '../../services/api.js';

import { PlusCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';



const DEPARTMENTS = [

  'All Departments',

  'Computer Science & Engineering',

  'Information Technology',

  'Artificial Intelligence & Data Science',

  'Electronics & Communication Engineering',

  'Electrical & Electronics Engineering',

  'Mechanical Engineering',

  'Mechatronics',

  'Biotechnology',

  'Civil Engineering',

  'Management Studies (MBA)',

];



const CATEGORIES = [

  'Hackathon',

  'Technical Workshop',

  'National Symposium',

  'Guest Lecture',

  'Paper Presentation',

  'Cultural Fest',

  'Sports Meet',

];



export const CreateEvent = () => {

  const { setCurrentPage } = useAuth();



  const [title, setTitle] = useState('');

  const [description, setDescription] = useState('');

  const [venue, setVenue] = useState('BIT Tech Park - Seminar Hall 1');

  const [startDate, setStartDate] = useState('2026-11-10');

  const [endDate, setEndDate] = useState('2026-11-11');

  const [startTime, setStartTime] = useState('09:30');

  const [endTime, setEndTime] = useState('16:30');

  const [registrationDeadline, setRegistrationDeadline] = useState('2026-11-08T23:59');

  const [department, setDepartment] = useState('Computer Science & Engineering');

  const [category, setCategory] = useState('Hackathon');

  const [minTeamSize, setMinTeamSize] = useState(1);

  const [maxTeamSize, setMaxTeamSize] = useState(3);

  const [maxSeats, setMaxSeats] = useState(100);

  const [coordinatorName, setCoordinatorName] = useState('Dr. S. R. Vignesh (CSE)');

  const [coordinatorContact, setCoordinatorContact] = useState('+91 94421 88123');



  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);

  const [successMsg, setSuccessMsg] = useState(null);



  const handleSubmit = async (e) => {

    e.preventDefault();

    setErrorMsg(null);

    setSuccessMsg(null);



    if (!title.trim() || !description.trim() || !venue.trim()) {

      setErrorMsg('Please complete all required fields.');

      return;

    }



    if (new Date(startDate) > new Date(endDate)) {

      setErrorMsg('Start date cannot be after end date.');

      return;

    }



    if (minTeamSize > maxTeamSize) {

      setErrorMsg('Minimum team size cannot exceed maximum team size.');

      return;

    }



    setIsSubmitting(true);

    try {

      await apiService.createEvent({

        title: title.trim(),

        description: description.trim(),

        venue: venue.trim(),

        startDate,

        endDate,

        startTime,

        endTime,

        registrationDeadline,

        department,

        category,

        minTeamSize: Number(minTeamSize),

        maxTeamSize: Number(maxTeamSize),

        maxSeats: Number(maxSeats),

        status: 'UPCOMING',

        approvalStatus: 'APPROVED',

        coordinatorName: coordinatorName.trim() || 'BIT Event Committee',

        coordinatorContact: coordinatorContact.trim() || '+91 4295 226000',

        bannerGradient: 'from-blue-700 to-indigo-900',

        feedbackEnabled: false,

        certificatesEnabled: false,

      });



      setSuccessMsg('Event created and published successfully to the BIT portal!');

      setTimeout(() => {

        setCurrentPage('manage-events');

      }, 1200);

    } catch (err) {

      setErrorMsg(err.message || 'Failed to create event');

    } finally {

      setIsSubmitting(false);

    }

  };



  return (

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex items-center justify-between border-b border-slate-200 pb-5">

        <div>

          <button

            onClick={() => setCurrentPage('manage-events')}

            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-2"

          >

            <ArrowLeft className="w-4 h-4" /> Back to Dashboard

          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">

            Create Campus Event

          </h1>

          <p className="text-xs text-slate-500 mt-0.5">

            Publish a new symposium, workshop, or hackathon for Bannari Amman Institute of Technology students.

          </p>

        </div>

      </div>



      {errorMsg && (

        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">

          {errorMsg}

        </div>

      )}



      {successMsg && (

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">

          <CheckCircle2 className="w-4 h-4 text-emerald-600" />

          {successMsg}

        </div>

      )}



      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">

        <div className="space-y-1.5">

          <label className="block text-xs font-semibold text-slate-700">

            Event Title <span className="text-rose-600">*</span>

          </label>

          <input

            type="text"

            required

            placeholder="e.g. NextGen Web3 & AI HackFest 2026"

            value={title}

            onChange={e => setTitle(e.target.value)}

            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"

          />

        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="space-y-1.5">

            <label className="block text-xs font-semibold text-slate-700">

              Event Category <span className="text-rose-600">*</span>

            </label>

            <select

              value={category}

              onChange={e => setCategory(e.target.value)}

              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600 bg-white"

            >

              {CATEGORIES.map(c => (

                <option key={c} value={c}>

                  {c}

                </option>

              ))}

            </select>

          </div>



          <div className="space-y-1.5">

            <label className="block text-xs font-semibold text-slate-700">

              Host Department (Optional)

            </label>

            <select

              value={department}

              onChange={e => setDepartment(e.target.value)}

              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600 bg-white"

            >

              {DEPARTMENTS.map(d => (

                <option key={d} value={d}>

                  {d}

                </option>

              ))}

            </select>

          </div>

        </div>



        <div className="space-y-1.5">

          <label className="block text-xs font-semibold text-slate-700">

            Event Description & Problem Statements <span className="text-rose-600">*</span>

          </label>

          <textarea

            required

            rows={4}

            placeholder="Provide event objectives, eligibility criteria, schedule breakdown, and prerequisites..."

            value={description}

            onChange={e => setDescription(e.target.value)}

            className="w-full text-xs p-3.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600 leading-relaxed"

          />

        </div>



        <div className="space-y-1.5">

          <label className="block text-xs font-semibold text-slate-700">

            Campus Venue <span className="text-rose-600">*</span>

          </label>

          <input

            type="text"

            required

            placeholder="e.g. BIT Tech Park Seminar Hall 1, Vedhayana Complex, Mechanical CAD Lab"

            value={venue}

            onChange={e => setVenue(e.target.value)}

            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"

          />

        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">

          <div className="space-y-1">

            <label className="block text-[11px] font-semibold text-slate-600">Start Date</label>

            <input

              type="date"

              required

              value={startDate}

              onChange={e => setStartDate(e.target.value)}

              className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 bg-white"

            />

          </div>



          <div className="space-y-1">

            <label className="block text-[11px] font-semibold text-slate-600">End Date</label>

            <input

              type="date"

              required

              value={endDate}

              onChange={e => setEndDate(e.target.value)}

              className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 bg-white"

            />

          </div>



          <div className="space-y-1">

            <label className="block text-[11px] font-semibold text-slate-600">Start Time</label>

            <input

              type="time"

              required

              value={startTime}

              onChange={e => setStartTime(e.target.value)}

              className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 bg-white"

            />

          </div>



          <div className="space-y-1">

            <label className="block text-[11px] font-semibold text-slate-600">End Time</label>

            <input

              type="time"

              required

              value={endTime}

              onChange={e => setEndTime(e.target.value)}

              className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 bg-white"

            />

          </div>

        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="sm:col-span-2 space-y-1.5">

            <label className="block text-xs font-semibold text-slate-700">

              Registration Deadline <span className="text-rose-600">*</span>

            </label>

            <input

              type="datetime-local"

              required

              value={registrationDeadline}

              onChange={e => setRegistrationDeadline(e.target.value)}

              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"

            />

          </div>



          <div className="space-y-1.5">

            <label className="block text-xs font-semibold text-slate-700">Min Team Size</label>

            <input

              type="number"

              min={1}

              max={10}

              required

              value={minTeamSize}

              onChange={e => setMinTeamSize(Number(e.target.value))}

              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300"

            />

          </div>



          <div className="space-y-1.5">

            <label className="block text-xs font-semibold text-slate-700">Max Team Size</label>

            <input

              type="number"

              min={1}

              max={10}

              required

              value={maxTeamSize}

              onChange={e => setMaxTeamSize(Number(e.target.value))}

              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300"

            />

          </div>

        </div>



        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="space-y-1.5">

            <label className="block text-xs font-semibold text-slate-700">Max Student Capacity</label>

            <input

              type="number"

              min={5}

              max={1000}

              required

              value={maxSeats}

              onChange={e => setMaxSeats(Number(e.target.value))}

              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300"

            />

          </div>



          <div className="space-y-1.5">

            <label className="block text-xs font-semibold text-slate-700">Faculty Coordinator</label>

            <input

              type="text"

              required

              value={coordinatorName}

              onChange={e => setCoordinatorName(e.target.value)}

              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300"

            />

          </div>



          <div className="space-y-1.5">

            <label className="block text-xs font-semibold text-slate-700">Coordinator Contact</label>

            <input

              type="text"

              required

              value={coordinatorContact}

              onChange={e => setCoordinatorContact(e.target.value)}

              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300"

            />

          </div>

        </div>



        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">

          <button

            type="button"

            onClick={() => setCurrentPage('manage-events')}

            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"

          >

            Cancel

          </button>

          <button

            type="submit"

            disabled={isSubmitting}

            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"

          >

            <PlusCircle className="w-4 h-4" />

            {isSubmitting ? 'Creating...' : 'Publish Campus Event'}

          </button>

        </div>

      </form>

    </div>

  );

};
