import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Code2,
  LogOut,
  ChevronDown,
  Layers,
  Settings,
  ShieldCheck,
  GraduationCap,
  LogIn,
  UserPlus,
  User as UserIcon
} from 'lucide-react';
import { getApiConfig, setApiConfig, apiService } from '../../services/api.js';

export const Navbar = () => {
  const { user, role, logout, currentPage, setCurrentPage } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [apiConfigState, setApiConfigState] = useState(getApiConfig());
  const [healthStatus, setHealthStatus] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const studentLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'events', label: 'Events' },
    { id: 'my-registrations', label: 'My Registrations' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'certificates', label: 'Certificates' },
  ];

  const facultyLinks = [
    { id: 'faculty-dashboard', label: 'Faculty Overview' },
    { id: 'create-event', label: 'Create Event' },
    { id: 'manage-events', label: 'Manage' },
    { id: 'participants', label: 'Participants' },
    { id: 'feedback-review', label: 'Feedback' },
    { id: 'certificate-management', label: 'Certificates' },
  ];

  const adminLinks = [
    { id: 'admin-executive-overview', label: 'Overview' },
    { id: 'admin-event-approvals', label: 'Approvals' },
    { id: 'admin-user-management', label: 'Users & Roles' },
    { id: 'admin-venue-schedule', label: 'Venue Timetable' },
    { id: 'admin-accreditation-reports', label: 'NAAC Reports' },
  ];

  const activeLinks = user
    ? role === 'ADMIN'
      ? adminLinks
      : role === 'FACULTY'
      ? facultyLinks
      : studentLinks
    : [
        { id: 'events', label: 'Explore Events' },
      ];

  const handleTestHealth = async () => {
    setIsCheckingHealth(true);
    setHealthStatus(null);
    const res = await apiService.checkLiveBackendHealth();
    setHealthStatus(res.message);
    setIsCheckingHealth(false);
  };

  const handleSaveApiSettings = () => {
    setApiConfig(apiConfigState.baseUrl, apiConfigState.useLiveApi);
    setShowSettingsModal(false);
    window.location.reload();
  };

  const getRoleLandingPage = () => {
    if (!user) return 'login';
    if (role === 'ADMIN') return 'admin-executive-overview';
    if (role === 'FACULTY') return 'faculty-dashboard';
    return 'dashboard';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentPage(getRoleLandingPage())}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                B
              </div>
              <div className="leading-tight">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg block">
                  BIT Events Portal
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Bannari Amman Institute of Technology
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {activeLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id)}
                  className={`transition-colors whitespace-nowrap py-1 ${
                    isActive
                      ? 'text-amber-700 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2 sm:gap-3">

            {user ? (
              /* Authenticated User Menu */
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="font-bold text-slate-900 leading-tight">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-amber-700 font-semibold uppercase">{role}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showRoleMenu && (
                  <div
                    className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setShowRoleMenu(false)}
                  >
                    <div className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                      <p className="font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-100/70 text-amber-900 text-[10px] font-bold uppercase">
                        {role === 'STUDENT' ? <GraduationCap className="w-3 h-3" /> : role === 'FACULTY' ? <Layers className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                        <span>{role} Account</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setShowSettingsModal(true);
                          setShowRoleMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2 font-medium"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        API / Backend Settings
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setShowRoleMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-700 flex items-center gap-2 font-bold"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Actions: Sign In & Sign Up */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('login')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === 'login'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => setCurrentPage('signup')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors ${
                    currentPage === 'signup'
                      ? 'bg-amber-700 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Backend Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">API Connection Settings</h3>
            <p className="text-xs text-slate-500 mt-1">
              Connect this frontend to your live Spring Boot application running in IntelliJ.
            </p>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Spring Boot Base URL</label>
                <input
                  type="text"
                  value={apiConfigState.baseUrl}
                  onChange={(e) => setApiConfigState({ ...apiConfigState, baseUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useLiveApi"
                  checked={apiConfigState.useLiveApi}
                  onChange={(e) => setApiConfigState({ ...apiConfigState, useLiveApi: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <label htmlFor="useLiveApi" className="font-medium text-slate-800">
                  Enable Live REST API Mode (Port 8088)
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestHealth}
                  disabled={isCheckingHealth}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  {isCheckingHealth ? 'Pinging backend...' : 'Test Backend Connection'}
                </button>
                {healthStatus && (
                  <p className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                    {healthStatus}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveApiSettings}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
