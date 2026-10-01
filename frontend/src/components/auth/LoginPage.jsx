import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ArrowRight,
  Lock,
  Mail,
  GraduationCap,
  Layers,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react';

export const LoginPage = () => {
  const { login, switchDemoUser, setCurrentPage } = useAuth();
  const [selectedRoleTab, setSelectedRoleTab] = useState('STUDENT');
  const [email, setEmail] = useState('karthikraja.cs22@bitsathy.ac.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const demoAccounts = {
    STUDENT: {
      email: 'karthikraja.cs22@bitsathy.ac.in',
      name: 'Karthik Raja M (Student)',
      dept: 'B.E. Computer Science & Engg - Year 3',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      activeColor: 'border-blue-600 bg-blue-50/80 text-blue-900',
    },
    FACULTY: {
      email: 'vigneshsr@bitsathy.ac.in',
      name: 'Dr. S. R. Vignesh (Faculty Convener)',
      dept: 'Associate Professor & Dept Coordinator',
      icon: Layers,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      activeColor: 'border-amber-600 bg-amber-50/80 text-amber-900',
    },
    ADMIN: {
      email: 'principal@bitsathy.ac.in',
      name: 'Dr. K. Saravanan (Principal / Admin)',
      dept: 'Institutional Governance & NAAC Dean',
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      activeColor: 'border-purple-600 bg-purple-50/80 text-purple-900',
    },
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRoleTab(roleKey);
    setEmail(demoAccounts[roleKey].email);
    setPassword('password123');
    setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      await login(email.trim(), password);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemoLogin = (roleKey) => {
    switchDemoUser(roleKey);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5">
        {/* Left Side Hero Banner (2 columns on md screens) */}
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-amber-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xl flex items-center justify-center shadow-md">
                B
              </div>
              <div>
                <h3 className="font-bold text-base text-white leading-tight">BIT Events</h3>
                <span className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase">Campus Portal</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> NAAC 'A+' Institution
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Manage & Experience Campus Events.
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seamless registrations, instant pass generation, faculty event approvals, and NAAC verified certificates.
              </p>
            </div>

            <div className="space-y-2.5 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Real-time event schedules & venue booking</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Instant QR pass & team registrations</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Official digitally verified certificates</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Bannari Amman Inst. of Tech</span>
            <span>Est. 1996</span>
          </div>

          {/* Decorative glow */}
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Right Side Form (3 columns on md screens) */}
        <div className="md:col-span-3 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
                <p className="text-xs text-slate-500 mt-0.5">Please sign in to access your workspace</p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage('signup')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </div>

            {/* Role Select Tabs */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(demoAccounts).map(([key, data]) => {
                  const Icon = data.icon;
                  const isSelected = selectedRoleTab === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleRoleSelect(key)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-center sm:items-start gap-1.5 ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/70 text-amber-950 shadow-xs ring-1 ring-amber-500'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 text-slate-700'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold capitalize">{key.toLowerCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1-Click Instant Login Banner */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-semibold text-slate-900 block">{demoAccounts[selectedRoleTab].name}</span>
                <span className="text-[11px] text-slate-500">{demoAccounts[selectedRoleTab].dept}</span>
              </div>
              <button
                type="button"
                onClick={() => handleInstantDemoLogin(selectedRoleTab)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
              >
                Instant 1-Click Login →
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  BIT Campus Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name.dept@bitsathy.ac.in"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <span className="text-[11px] text-slate-400">Default: password123</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => setCurrentPage('signup')}
              className="font-bold text-amber-700 hover:text-amber-800"
            >
              Create an Account Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
