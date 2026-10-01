import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  GraduationCap,
  Layers,
  ShieldCheck,
  Building,
  Phone,
  Hash,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const DEPARTMENTS = [
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

export const SignupPage = () => {
  const { signup, setCurrentPage } = useAuth();
  const [role, setRole] = useState('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [rollNumber, setRollNumber] = useState('');
  const [year, setYear] = useState('3');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        department,
        rollNumber: role === 'STUDENT' ? (rollNumber.trim() || '221CS999') : undefined,
        year: role === 'STUDENT' ? Number(year) : undefined,
        designation: role === 'FACULTY' ? designation : undefined,
        employeeId: role === 'FACULTY' ? `BIT-FAC-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
        phone: phone.trim() || '+91 98765 43210',
      });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5">
        {/* Left Hero Panel */}
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-amber-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xl flex items-center justify-center shadow-md">
                B
              </div>
              <div>
                <h3 className="font-bold text-base text-white leading-tight">BIT Events</h3>
                <span className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase">Onboarding</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Quick Student / Faculty Access
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Join 5,000+ Students & Faculty Members.
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Create your verified profile to participate in hackathons, coordinate symposiums, and claim verified digital certificates.
              </p>
            </div>

            <div className="space-y-2.5 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero registration fee for department events</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Automated IQAC & NAAC report logging</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Instant e-pass downloads on your phone</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Bannari Amman Inst. of Tech</span>
            <span>Est. 1996</span>
          </div>

          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-3 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create Account</h2>
                <p className="text-xs text-slate-500 mt-0.5">Register for campus event access</p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage('login')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign In
              </button>
            </div>

            {/* Role Switcher */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    role === 'STUDENT'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-950 shadow-xs ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  <GraduationCap className={`w-5 h-5 ${role === 'STUDENT' ? 'text-amber-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs font-bold block">Student Account</span>
                    <span className="text-[10px] text-slate-500">Event Participant</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('FACULTY')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    role === 'FACULTY'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-950 shadow-xs ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  <Layers className={`w-5 h-5 ${role === 'FACULTY' ? 'text-amber-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs font-bold block">Faculty Account</span>
                    <span className="text-[10px] text-slate-500">Event Coordinator</span>
                  </div>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Preethi S"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campus Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student.cs@bitsathy.ac.in"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {role === 'STUDENT' ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Roll / Reg Number
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value)}
                          placeholder="e.g. 221CS199"
                          className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current Year
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900"
                      >
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year (Final)</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Associate Professor"
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 94421 00000"
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 bg-white"
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
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
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration & Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setCurrentPage('login')}
              className="font-bold text-amber-700 hover:text-amber-800"
            >
              Sign In Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
