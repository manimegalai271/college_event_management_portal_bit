import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bit_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(user?.role || 'STUDENT');
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('bit_current_user');
    if (!saved) return 'login';
    const parsed = JSON.parse(saved);
    if (parsed?.role === 'ADMIN') return 'admin-executive-overview';
    if (parsed?.role === 'FACULTY') return 'faculty-dashboard';
    return 'dashboard';
  });
  const [selectedEventId, setSelectedEventId] = useState(1);

  useEffect(() => {
    if (user) {
      localStorage.setItem('bit_current_user', JSON.stringify(user));
      setRole(user.role);
    } else {
      localStorage.removeItem('bit_current_user');
      setRole('STUDENT');
    }
  }, [user]);

  const login = async (email, password = '') => {
    const users = JSON.parse(localStorage.getItem('bit_users') || JSON.stringify(initialUsers));
    const cleanEmail = email.trim().toLowerCase();

    // Match by exact email or fallback aliases
    let found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      if (cleanEmail.includes('admin') || cleanEmail.includes('principal')) {
        found = users.find(u => u.role === 'ADMIN') || initialUsers.find(u => u.role === 'ADMIN');
      } else if (cleanEmail.includes('faculty') || cleanEmail.includes('vignesh')) {
        found = users.find(u => u.role === 'FACULTY') || initialUsers.find(u => u.role === 'FACULTY');
      } else if (cleanEmail.includes('student') || cleanEmail.includes('karthik')) {
        found = users.find(u => u.role === 'STUDENT') || initialUsers.find(u => u.role === 'STUDENT');
      }
    }

    if (found) {
      setUser(found);
      setRole(found.role);
      if (found.role === 'ADMIN') setCurrentPage('admin-executive-overview');
      else if (found.role === 'FACULTY') setCurrentPage('faculty-dashboard');
      else setCurrentPage('dashboard');
      return found;
    }
    throw new Error('No user found with that email address. Please sign up or try demo logins.');
  };

  const signup = async (userData) => {
    const users = JSON.parse(localStorage.getItem('bit_users') || JSON.stringify(initialUsers));
    const newUser = {
      id: Date.now(),
      ...userData,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().substring(0, 10),
    };
    users.push(newUser);
    localStorage.setItem('bit_users', JSON.stringify(users));
    setUser(newUser);
    setRole(newUser.role);
    if (newUser.role === 'ADMIN') setCurrentPage('admin-executive-overview');
    else if (newUser.role === 'FACULTY') setCurrentPage('faculty-dashboard');
    else setCurrentPage('dashboard');
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const switchDemoUser = (targetRole) => {
    const users = JSON.parse(localStorage.getItem('bit_users') || JSON.stringify(initialUsers));
    const targetUser = users.find(u => u.role === targetRole) || initialUsers.find(u => u.role === targetRole);
    if (targetUser) {
      setUser(targetUser);
      setRole(targetRole);
      if (targetRole === 'ADMIN') setCurrentPage('admin-executive-overview');
      else if (targetRole === 'FACULTY') setCurrentPage('faculty-dashboard');
      else setCurrentPage('dashboard');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        signup,
        logout,
        switchDemoUser,
        currentPage,
        setCurrentPage,
        selectedEventId,
        setSelectedEventId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
