import {
  initialEvents,
  initialUsers,
  initialRegistrations,
  initialCertificates,
  initialFeedbacks,
  initialAnnouncements,
} from '../data/mockData';

const CONFIG_KEY = 'bit_events_api_config';

export const getApiConfig = () => {
  const saved = localStorage.getItem(CONFIG_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return {
    baseUrl: 'http://localhost:8088/api',
    useLiveApi: false, // Default to seamless browser mock persistence, can toggle to live Spring Boot
  };
};

export const setApiConfig = (baseUrl, useLiveApi) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify({ baseUrl, useLiveApi }));
};

// Helper for LocalStorage Persistence
const getStorageItem = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  if (data) {
    try { return JSON.parse(data); } catch (e) {}
  }
  localStorage.setItem(key, JSON.stringify(defaultVal));
  return defaultVal;
};

const setStorageItem = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const apiService = {
  // Live Backend Health check
  checkLiveBackendHealth: async () => {
    const { baseUrl } = getApiConfig();
    try {
      const res = await fetch(`${baseUrl}/events`, { method: 'GET' });
      if (res.ok) {
        return { success: true, message: `Connected to Live Spring Boot Server at ${baseUrl}` };
      }
      return { success: false, message: `Server responded with status ${res.status}` };
    } catch (err) {
      return { success: false, message: `Could not reach Spring Boot at ${baseUrl}` };
    }
  },

  // Events API
  getAllEvents: async (includeAll = false) => {
    const { baseUrl, useLiveApi } = getApiConfig();
    if (useLiveApi) {
      try {
        const res = await fetch(`${baseUrl}/events`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Live API unavailable, using local data storage', e);
      }
    }
    const events = getStorageItem('bit_events', initialEvents);
    if (includeAll) return events;
    return events.filter(e => e.approvalStatus === 'APPROVED' || e.approvalStatus === undefined);
  },

  getEventById: async (id) => {
    const { baseUrl, useLiveApi } = getApiConfig();
    if (useLiveApi) {
      try {
        const res = await fetch(`${baseUrl}/events/${id}`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const events = getStorageItem('bit_events', initialEvents);
    return events.find(e => Number(e.id) === Number(id)) || null;
  },

  createEvent: async (eventData) => {
    const { baseUrl, useLiveApi } = getApiConfig();
    if (useLiveApi) {
      try {
        const res = await fetch(`${baseUrl}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const events = getStorageItem('bit_events', initialEvents);
    const newEvent = {
      ...eventData,
      id: Date.now(),
      registeredCount: 0,
      approvalStatus: eventData.approvalStatus || 'APPROVED',
      status: eventData.status || 'UPCOMING',
    };
    events.unshift(newEvent);
    setStorageItem('bit_events', events);
    return newEvent;
  },

  updateEvent: async (id, updateData) => {
    const { baseUrl, useLiveApi } = getApiConfig();
    if (useLiveApi) {
      try {
        const res = await fetch(`${baseUrl}/events/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const events = getStorageItem('bit_events', initialEvents);
    const idx = events.findIndex(e => Number(e.id) === Number(id));
    if (idx !== -1) {
      events[idx] = { ...events[idx], ...updateData };
      setStorageItem('bit_events', events);
      return events[idx];
    }
    throw new Error('Event not found');
  },

  approveEvent: async (id, approved, reason = '') => {
    const status = approved ? 'APPROVED' : 'REJECTED';
    return await apiService.updateEvent(id, {
      approvalStatus: status,
      rejectionReason: approved ? undefined : reason,
    });
  },

  deleteEvent: async (id) => {
    const { baseUrl, useLiveApi } = getApiConfig();
    if (useLiveApi) {
      try {
        await fetch(`${baseUrl}/events/${id}`, { method: 'DELETE' });
      } catch (e) {}
    }
    let events = getStorageItem('bit_events', initialEvents);
    events = events.filter(e => Number(e.id) !== Number(id));
    setStorageItem('bit_events', events);
    return true;
  },

  // Users API
  getAllUsers: async () => {
    const { baseUrl, useLiveApi } = getApiConfig();
    if (useLiveApi) {
      try {
        const res = await fetch(`${baseUrl}/users`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return getStorageItem('bit_users', initialUsers);
  },

  updateUserRole: async (userId, newRole) => {
    const users = getStorageItem('bit_users', initialUsers);
    const idx = users.findIndex(u => Number(u.id) === Number(userId));
    if (idx !== -1) {
      users[idx].role = newRole;
      setStorageItem('bit_users', users);
      return users[idx];
    }
    throw new Error('User not found');
  },

  toggleUserStatus: async (userId) => {
    const users = getStorageItem('bit_users', initialUsers);
    const idx = users.findIndex(u => Number(u.id) === Number(userId));
    if (idx !== -1) {
      users[idx].status = users[idx].status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
      setStorageItem('bit_users', users);
      return users[idx];
    }
    throw new Error('User not found');
  },

  // Registrations API
  getAllRegistrations: async () => {
    return getStorageItem('bit_registrations', initialRegistrations);
  },

  getEventRegistrations: async (eventId) => {
    const regs = getStorageItem('bit_registrations', initialRegistrations);
    return regs.filter(r => Number(r.eventId) === Number(eventId));
  },

  getUserRegistrations: async (userId) => {
    const regs = getStorageItem('bit_registrations', initialRegistrations);
    return regs.filter(r => Number(r.userId) === Number(userId));
  },

  registerForEvent: async ({ eventId, user, teamName, teamMembers }) => {
    const regs = getStorageItem('bit_registrations', initialRegistrations);
    const existing = regs.find(r => Number(r.eventId) === Number(eventId) && Number(r.userId) === Number(user.id));
    if (existing) {
      throw new Error('You are already registered for this event!');
    }

    const ticketCode = `BIT-PASS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReg = {
      id: Date.now(),
      eventId: Number(eventId),
      userId: Number(user.id),
      userName: user.name,
      userEmail: user.email,
      userRollNumber: user.rollNumber,
      userDepartment: user.department,
      userYear: user.year,
      ticketCode,
      teamName: teamName || null,
      teamMembers: teamMembers || [],
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    regs.unshift(newReg);
    setStorageItem('bit_registrations', regs);

    // Update event registeredCount
    const events = getStorageItem('bit_events', initialEvents);
    const evIdx = events.findIndex(e => Number(e.id) === Number(eventId));
    if (evIdx !== -1) {
      events[evIdx].registeredCount = (events[evIdx].registeredCount || 0) + 1;
      setStorageItem('bit_events', events);
    }

    return newReg;
  },

  // Certificates API
  getAllCertificates: async () => {
    return getStorageItem('bit_certificates', initialCertificates);
  },

  getUserCertificates: async (userId) => {
    const certs = getStorageItem('bit_certificates', initialCertificates);
    return certs.filter(c => Number(c.userId) === Number(userId));
  },

  generateCertificatesForEvent: async (eventId) => {
    const events = getStorageItem('bit_events', initialEvents);
    const event = events.find(e => Number(e.id) === Number(eventId));
    if (!event) throw new Error('Event not found');

    const regs = await apiService.getEventRegistrations(eventId);
    const certs = getStorageItem('bit_certificates', initialCertificates);

    let createdCount = 0;
    regs.forEach(reg => {
      const exists = certs.some(c => Number(c.eventId) === Number(eventId) && Number(c.userId) === Number(reg.userId));
      if (!exists) {
        certs.push({
          id: Date.now() + Math.floor(Math.random() * 1000),
          certificateNumber: `BIT-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          eventId: Number(eventId),
          eventTitle: event.title,
          eventDate: `${event.startDate}`,
          userId: Number(reg.userId),
          studentName: reg.userName,
          studentRollNumber: reg.userRollNumber || 'N/A',
          studentDepartment: reg.userDepartment || event.department,
          collegeName: 'Bannari Amman Institute of Technology',
          signatory1: 'Dr. S. R. Vignesh (Faculty Convener)',
          signatory2: 'Dr. C. Palanisamy (Principal & Dean)',
          issueDate: new Date().toISOString().substring(0, 10),
        });
        createdCount++;
      }
    });

    setStorageItem('bit_certificates', certs);
    return createdCount;
  },

  // Feedbacks API
  getEventFeedbacks: async (eventId = null) => {
    const fbs = getStorageItem('bit_feedbacks', initialFeedbacks);
    if (!eventId) return fbs;
    return fbs.filter(f => Number(f.eventId) === Number(eventId));
  },

  submitFeedback: async (feedbackData) => {
    const fbs = getStorageItem('bit_feedbacks', initialFeedbacks);
    const newFb = {
      id: Date.now(),
      ...feedbackData,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    fbs.unshift(newFb);
    setStorageItem('bit_feedbacks', fbs);
    return newFb;
  },

  // Announcements API
  getAnnouncements: async () => {
    return getStorageItem('bit_announcements', initialAnnouncements);
  },

  createAnnouncement: async (data) => {
    const list = getStorageItem('bit_announcements', initialAnnouncements);
    const newNotice = {
      id: Date.now(),
      ...data,
      date: new Date().toISOString().substring(0, 10),
    };
    list.unshift(newNotice);
    setStorageItem('bit_announcements', list);
    return newNotice;
  }
};
