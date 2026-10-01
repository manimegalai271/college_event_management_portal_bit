import React, { useState, useEffect } from 'react';

import { apiService } from '../../services/api.js';

import {

  Star,

  MessageSquare,

  PlusCircle,

} from 'lucide-react';



export const FeedbackReview = () => {

  const [events, setEvents] = useState([]);

  const [selectedEventId, setSelectedEventId] = useState(null);

  const [feedbacks, setFeedbacks] = useState([]);



  const [customQuestions, setCustomQuestions] = useState([

    'Did the practical hands-on exercises match the syllabus?',

    'Was the campus auditorium / lab infrastructure satisfactory?',

    'Would you recommend this BIT technical event to junior peers?',

  ]);

  const [newQuestionText, setNewQuestionText] = useState('');

  const [showQuestionModal, setShowQuestionModal] = useState(false);



  useEffect(() => {

    const loadEvents = async () => {

      const list = await apiService.getAllEvents(true);

      setEvents(list);

      const completed = list.find(e => e.status === 'COMPLETED');

      if (completed) {

        setSelectedEventId(completed.id);

      } else if (list.length > 0) {

        setSelectedEventId(list[0].id);

      }

    };

    loadEvents();

  }, []);



  useEffect(() => {

    const loadFeedbacks = async () => {

      if (!selectedEventId) return;

      const fbs = await apiService.getEventFeedbacks(selectedEventId);

      setFeedbacks(fbs);

    };

    loadFeedbacks();

  }, [selectedEventId]);



  const selectedEvent = events.find(e => e.id === selectedEventId);



  const count = feedbacks.length;

  const avgOverall =

    count > 0

      ? (feedbacks.reduce((acc, f) => acc + f.ratings.overall, 0) / count).toFixed(1)

      : '0.0';

  const avgContent =

    count > 0

      ? (feedbacks.reduce((acc, f) => acc + f.ratings.contentQuality, 0) / count).toFixed(1)

      : '0.0';

  const avgOrg =

    count > 0

      ? (feedbacks.reduce((acc, f) => acc + f.ratings.organization, 0) / count).toFixed(1)

      : '0.0';

  const avgSpeaker =

    count > 0

      ? (feedbacks.reduce((acc, f) => acc + f.ratings.speakerEffectiveness, 0) / count).toFixed(1)

      : '0.0';



  const handleAddQuestion = (e) => {

    e.preventDefault();

    if (newQuestionText.trim()) {

      setCustomQuestions([...customQuestions, newQuestionText.trim()]);

      setNewQuestionText('');

      setShowQuestionModal(false);

    }

  };



  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">

        <div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">

            Student Feedback & Evaluation Analytics

          </h1>

          <p className="text-xs text-slate-500 mt-0.5">

            Review student satisfaction scores, technical takeaways, and configure survey parameters.

          </p>

        </div>



        <button

          onClick={() => setShowQuestionModal(true)}

          className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"

        >

          <PlusCircle className="w-4 h-4" />

          Survey Questions ({customQuestions.length})

        </button>

      </div>



      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <div className="flex items-center gap-2">

          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">

            Select Campus Event:

          </label>

          <select

            value={selectedEventId || ''}

            onChange={e => setSelectedEventId(Number(e.target.value))}

            className="text-xs px-3 py-2 rounded-lg border border-slate-300 font-semibold text-slate-800 bg-white focus:outline-none focus:border-amber-600"

          >

            {events.map(ev => (

              <option key={ev.id} value={ev.id}>

                {ev.title} ({ev.status})

              </option>

            ))}

          </select>

        </div>



        <div className="text-xs text-slate-500">

          Status:{' '}

          <strong className="text-slate-800">{selectedEvent?.status}</strong> · Venue:{' '}

          <span className="text-slate-700">{selectedEvent?.venue}</span>

        </div>

      </div>



      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl border border-slate-200">

          <div className="text-slate-500 text-xs font-medium">Overall Rating</div>

          <div className="mt-2 text-2xl font-bold text-amber-700 flex items-center gap-1.5 tabular-nums">

            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />

            {avgOverall}

            <span className="text-xs text-slate-400 font-normal">/ 5.0</span>

          </div>

          <div className="mt-1 text-[11px] text-slate-500">{count} submissions</div>

        </div>



        <div className="bg-white p-5 rounded-xl border border-slate-200">

          <div className="text-slate-500 text-xs font-medium">Content Depth</div>

          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">

            {avgContent} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>

          </div>

          <div className="mt-1 text-[11px] text-slate-500">Technical rigor</div>

        </div>



        <div className="bg-white p-5 rounded-xl border border-slate-200">

          <div className="text-slate-500 text-xs font-medium">Lab & Venue Org</div>

          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">

            {avgOrg} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>

          </div>

          <div className="mt-1 text-[11px] text-slate-500">Facility & logistics</div>

        </div>



        <div className="bg-white p-5 rounded-xl border border-slate-200">

          <div className="text-slate-500 text-xs font-medium">Speaker Rating</div>

          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">

            {avgSpeaker} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>

          </div>

          <div className="mt-1 text-[11px] text-slate-500">Clarity & delivery</div>

        </div>

      </div>



      <div className="space-y-4">

        <h3 className="text-base font-bold text-slate-900">

          Student Feedback Entries ({feedbacks.length})

        </h3>



        {feedbacks.length === 0 ? (

          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">

            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />

            <h4 className="font-bold text-slate-800 text-sm">No Student Feedback Yet</h4>

            <p className="mt-1 max-w-sm mx-auto">

              Students can submit their ratings and suggestions once this event is marked COMPLETED.

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {feedbacks.map(fb => (

              <div

                key={fb.id}

                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm"

              >

                <div className="flex items-center justify-between text-xs">

                  <div>

                    <span className="font-bold text-slate-900">{fb.userName}</span>

                    {fb.userRollNumber && (

                      <span className="text-slate-400 ml-1 font-mono text-[11px]">

                        ({fb.userRollNumber})

                      </span>

                    )}

                  </div>

                  <div className="flex items-center gap-1 font-bold text-amber-700">

                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />

                    <span className="tabular-nums">{fb.ratings.overall}/5</span>

                  </div>

                </div>



                <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-lg text-[11px] text-slate-600">

                  <div>

                    Content: <span className="font-bold text-slate-800">{fb.ratings.contentQuality}/5</span>

                  </div>

                  <div>

                    Org: <span className="font-bold text-slate-800">{fb.ratings.organization}/5</span>

                  </div>

                  <div>

                    Speaker: <span className="font-bold text-slate-800">{fb.ratings.speakerEffectiveness}/5</span>

                  </div>

                </div>



                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">

                  &ldquo;{fb.comments}&rdquo;

                </p>



                <div className="text-[10px] text-slate-400 text-right">

                  Submitted: {fb.submittedAt}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>



      {showQuestionModal && (

        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">

              <h3 className="text-base font-bold text-slate-900">

                Manage Event Feedback Questionnaire

              </h3>

              <button

                onClick={() => setShowQuestionModal(false)}

                className="text-slate-400 hover:text-slate-600"

              >

                ✕

              </button>

            </div>



            <p className="text-slate-500">

              These active questions are presented to Bannari Amman Institute of Technology students on their post-event evaluation portal:

            </p>



            <div className="space-y-2">

              {customQuestions.map((q, i) => (

                <div

                  key={i}

                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50"

                >

                  <span className="font-medium text-slate-800">

                    {i + 1}. {q}

                  </span>

                  <button

                    onClick={() => setCustomQuestions(customQuestions.filter((_, idx) => idx !== i))}

                    className="text-rose-600 hover:text-rose-800 ml-2"

                  >

                    Delete

                  </button>

                </div>

              ))}

            </div>



            <form onSubmit={handleAddQuestion} className="space-y-3 pt-2">

              <label className="block font-semibold text-slate-700">Add New Survey Question</label>

              <div className="flex gap-2">

                <input

                  type="text"

                  required

                  placeholder="e.g. How effective were the presentation slides?"

                  value={newQuestionText}

                  onChange={e => setNewQuestionText(e.target.value)}

                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600 text-xs"

                />

                <button

                  type="submit"

                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shrink-0"

                >

                  Add Question

                </button>

              </div>

            </form>



            <div className="flex justify-end pt-3 border-t border-slate-100">

              <button

                onClick={() => setShowQuestionModal(false)}

                className="px-4 py-2 text-slate-600 font-semibold"

              >

                Close

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};
