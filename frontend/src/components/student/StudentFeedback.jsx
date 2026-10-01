import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiService } from '../../services/api.js';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  Calendar,
  Send,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';

export const StudentFeedback = () => {
  const { user, setCurrentPage } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [rating, setRating] = useState(5);
  const [organizationRating, setOrganizationRating] = useState(5);
  const [contentRating, setContentRating] = useState(5);
  const [comments, setComments] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [pastFeedbacks, setPastFeedbacks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allEvents, allFeedbacks] = await Promise.all([
          apiService.getAllEvents(true),
          apiService.getEventFeedbacks(),
        ]);
        setEvents(allEvents);
        if (allEvents.length > 0) setSelectedEventId(allEvents[0].id);

        const myFeedbacks = allFeedbacks.filter(f => f.userEmail === user?.email || f.userName === user?.name);
        setPastFeedbacks(myFeedbacks);
      } catch (err) {
        console.error('Failed to load feedback data', err);
      }
    };
    loadData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventId) return;

    setSubmitting(true);
    setSuccessMsg('');

    try {
      const selectedEvent = events.find(ev => Number(ev.id) === Number(selectedEventId));
      const newFeedback = await apiService.submitFeedback({
        eventId: Number(selectedEventId),
        eventTitle: selectedEvent?.title || 'Campus Event',
        userId: user?.id || Date.now(),
        userName: user?.name || 'Student Participant',
        userEmail: user?.email || 'student@bitsathy.ac.in',
        userDepartment: user?.department || 'CSE',
        rating: Number(rating),
        organizationRating: Number(organizationRating),
        contentRating: Number(contentRating),
        comments,
        suggestions,
      });

      setPastFeedbacks([newFeedback, ...pastFeedbacks]);
      setSuccessMsg('Thank you! Your feedback has been submitted successfully.');
      setComments('');
      setSuggestions('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error submitting feedback', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Event Feedback & Rating</h1>
        <p className="text-xs text-slate-500 mt-1">
          Help us improve future college events by providing your candid thoughts and ratings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Event
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs text-slate-900 bg-white"
                required
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.department}) - {evt.startDate}
                  </option>
                ))}
              </select>
            </div>

            {/* Ratings row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5">{rating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Organization
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setOrganizationRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= organizationRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5">{organizationRating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Quality of Content
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setContentRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= contentRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5">{contentRating}/5</span>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                What did you like most about the event?
              </label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your highlights, learnings, and key takeaways..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs text-slate-900 bg-white"
                required
              />
            </div>

            {/* Suggestions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Suggestions for Future Editions (Optional)
              </label>
              <textarea
                rows={2}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="Any recommendations regarding venue, scheduling, speakers, or topics?"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs text-slate-900 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Submitting Feedback...' : 'Submit Event Feedback'}
            </button>
          </form>
        </div>

        {/* Previous Feedback Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600" /> My Submissions
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your previously submitted feedback entries.
            </p>

            {pastFeedbacks.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No past feedback records found.
              </div>
            ) : (
              <div className="space-y-3">
                {pastFeedbacks.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 line-clamp-1">{item.eventTitle}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-700 text-[11px]">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 italic line-clamp-2">"{item.comments}"</p>
                    <span className="text-[10px] text-slate-400 block">{item.submittedAt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs space-y-2 text-slate-700">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> NAAC Quality Assurance
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Student feedback is compiled anonymously into the Institutional Internal Quality Assurance Cell (IQAC) accreditation reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
