import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';

// Auth Pages
import { LoginPage } from './components/auth/LoginPage.jsx';
import { SignupPage } from './components/auth/SignupPage.jsx';

// Student Pages
import { StudentDashboard } from './components/student/StudentDashboard.jsx';
import { MyRegistrations } from './components/student/MyRegistrations.jsx';
import { StudentFeedback } from './components/student/StudentFeedback.jsx';
import { CertificatePage } from './components/student/CertificatePage.jsx';

// Faculty Pages
import { FacultyDashboard } from './components/faculty/FacultyDashboard.jsx';
import { CreateEvent } from './components/faculty/CreateEvent.jsx';
import { ManageEvents } from './components/faculty/ManageEvents.jsx';
import { ViewParticipants } from './components/faculty/ViewParticipants.jsx';
import { FeedbackReview } from './components/faculty/FeedbackReview.jsx';
import { CertificateManagement } from './components/faculty/CertificateManagement.jsx';

// Admin Pages
import { AdminExecutiveOverview } from './components/admin/AdminExecutiveOverview.jsx';
import { AdminEventApprovals } from './components/admin/AdminEventApprovals.jsx';
import { AdminUserManagement } from './components/admin/AdminUserManagement.jsx';
import { AdminVenueSchedule } from './components/admin/AdminVenueSchedule.jsx';
import { AdminAccreditationReports } from './components/admin/AdminAccreditationReports.jsx';

// Events Pages
import { EventsList } from './components/events/EventsList.jsx';
import { EventDetails } from './components/events/EventDetails.jsx';

// Common / Developer
import { SpringBootCode } from './components/common/SpringBootCode.jsx';

const MainAppContent = () => {
  const { user, currentPage } = useAuth();

  const renderCurrentPage = () => {
    // If not logged in and not explicitly on signup or public events or spring-boot-code
    if (!user) {
      if (currentPage === 'signup') return <SignupPage />;
      if (currentPage === 'events') return <EventsList />;
      if (currentPage === 'event-details') return <EventDetails />;
      if (currentPage === 'spring-boot-code') return <SpringBootCode />;
      return <LoginPage />;
    }

    // Authenticated routes
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;

      // Student Routes
      case 'dashboard':
        return <StudentDashboard />;
      case 'my-registrations':
        return <MyRegistrations />;
      case 'feedback':
        return <StudentFeedback />;
      case 'certificates':
        return <CertificatePage />;

      // Faculty Routes
      case 'faculty-dashboard':
        return <FacultyDashboard />;
      case 'create-event':
        return <CreateEvent />;
      case 'manage-events':
        return <ManageEvents />;
      case 'participants':
        return <ViewParticipants />;
      case 'feedback-review':
        return <FeedbackReview />;
      case 'certificate-management':
        return <CertificateManagement />;

      // Admin Routes
      case 'admin-executive-overview':
        return <AdminExecutiveOverview />;
      case 'admin-event-approvals':
        return <AdminEventApprovals />;
      case 'admin-user-management':
        return <AdminUserManagement />;
      case 'admin-venue-schedule':
        return <AdminVenueSchedule />;
      case 'admin-accreditation-reports':
        return <AdminAccreditationReports />;

      // Events Routes
      case 'events':
        return <EventsList />;
      case 'event-details':
        return <EventDetails />;

      // Common / Spring Boot Code
      case 'spring-boot-code':
        return <SpringBootCode />;

      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
