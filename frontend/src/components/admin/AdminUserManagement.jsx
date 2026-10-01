import React, { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';

import { apiService } from '../../services/api';

import {

  Search,

  ArrowLeft,

  CheckCircle,

} from 'lucide-react';



export const AdminUserManagement = () => {

  const { setCurrentPage } = useAuth();

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState('');

  const [roleFilter, setRoleFilter] = useState('ALL');

  const [deptFilter, setDeptFilter] = useState('ALL');

  const [successMsg, setSuccessMsg] = useState(null);



  const loadUsers = async () => {

    const list = await apiService.getAllUsers();

    setUsers(list);

  };



  useEffect(() => {

    loadUsers();

  }, []);



  const handleRoleChange = async (userId, newRole) => {

    await apiService.updateUserRole(userId, newRole);

    setSuccessMsg(`User role updated to ${newRole}`);

    setTimeout(() => setSuccessMsg(null), 3000);

    await loadUsers();

  };



  const handleToggleStatus = async (userId) => {

    await apiService.toggleUserStatus(userId);

    await loadUsers();

  };



  const filteredUsers = users.filter(u => {

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    const matchesDept = deptFilter === 'ALL' || u.department === deptFilter;

    const matchesSearch =

      search === '' ||

      u.name.toLowerCase().includes(search.toLowerCase()) ||

      u.email.toLowerCase().includes(search.toLowerCase()) ||

      (u.rollNumber && u.rollNumber.toLowerCase().includes(search.toLowerCase())) ||

      (u.employeeId && u.employeeId.toLowerCase().includes(search.toLowerCase()));

    return matchesRole && matchesDept && matchesSearch;

  });



  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">

        <div>

          <button

            onClick={() => setCurrentPage('admin-executive-overview')}

            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-2"

          >

            <ArrowLeft className="w-4 h-4" /> Back to Executive Console

          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">

            Campus User & Role Governance

          </h1>

          <p className="text-xs text-slate-500 mt-0.5">

            Manage academic accounts for students, faculty conveners, and administrative officers across BIT.

          </p>

        </div>

      </div>



      {successMsg && (

        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">

          <CheckCircle className="w-4 h-4 text-emerald-600" />

          {successMsg}

        </div>

      )}



      {/* Filters Bar */}

      <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">

        {/* Search */}

        <div className="relative">

          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />

          <input

            type="text"

            placeholder="Search by name, roll, emp ID, or email..."

            value={search}

            onChange={e => setSearch(e.target.value)}

            className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"

          />

        </div>



        {/* Role Filter */}

        <div>

          <select

            value={roleFilter}

            onChange={e => setRoleFilter(e.target.value)}

            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"

          >

            <option value="ALL">All Roles ({users.length})</option>

            <option value="STUDENT">Students ({users.filter(u => u.role === 'STUDENT').length})</option>

            <option value="FACULTY">Faculty Coordinators ({users.filter(u => u.role === 'FACULTY').length})</option>

            <option value="ADMIN">Institutional Admins ({users.filter(u => u.role === 'ADMIN').length})</option>

          </select>

        </div>



        {/* Dept Filter */}

        <div>

          <select

            value={deptFilter}

            onChange={e => setDeptFilter(e.target.value)}

            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"

          >

            <option value="ALL">All Departments</option>

            <option value="Computer Science & Engineering">CSE</option>

            <option value="Information Technology">IT</option>

            <option value="Artificial Intelligence & Data Science">AI & DS</option>

            <option value="Electronics & Communication Engineering">ECE</option>

            <option value="Mechanical Engineering">Mechanical</option>

          </select>

        </div>

      </div>



      {/* Users Table */}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">

              <tr>

                <th className="px-5 py-3.5">User Identity</th>

                <th className="px-5 py-3.5">Department</th>

                <th className="px-5 py-3.5">Identifier</th>

                <th className="px-5 py-3.5">Assigned Role</th>

                <th className="px-5 py-3.5">Account Status</th>

                <th className="px-5 py-3.5 text-right">Actions</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredUsers.map(u => (

                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">

                  <td className="px-5 py-4">

                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">

                      {u.name}

                    </div>

                    <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>

                  </td>



                  <td className="px-5 py-4 text-slate-700 font-medium">

                    {u.department}

                  </td>



                  <td className="px-5 py-4 font-mono text-slate-600">

                    {u.role === 'STUDENT' ? (

                      <span>Roll: <strong>{u.rollNumber || 'N/A'}</strong> (Year {u.year || 3})</span>

                    ) : (

                      <span>ID: <strong>{u.employeeId || 'BIT-FAC'}</strong></span>

                    )}

                  </td>



                  <td className="px-5 py-4">

                    <select

                      value={u.role}

                      onChange={e => handleRoleChange(u.id, e.target.value)}

                      className={`text-xs font-semibold px-2 py-1 rounded-md border focus:outline-none ${

                        u.role === 'ADMIN'

                          ? 'bg-purple-50 text-purple-900 border-purple-300'

                          : u.role === 'FACULTY'

                          ? 'bg-amber-50 text-amber-900 border-amber-300'

                          : 'bg-blue-50 text-blue-900 border-blue-300'

                      }`}

                    >

                      <option value="STUDENT">STUDENT</option>

                      <option value="FACULTY">FACULTY</option>

                      <option value="ADMIN">ADMIN</option>

                    </select>

                  </td>



                  <td className="px-5 py-4">

                    <button

                      onClick={() => handleToggleStatus(u.id)}

                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${

                        u.status === 'INACTIVE'

                          ? 'bg-rose-50 text-rose-700 border-rose-200'

                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'

                      }`}

                    >

                      {u.status === 'INACTIVE' ? 'Inactive (Suspended)' : 'Active'}

                    </button>

                  </td>



                  <td className="px-5 py-4 text-right">

                    <span className="text-[11px] text-slate-400">

                      Joined {u.createdAt || '2026'}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

};
