import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Code2,
  Server,
  Database,
  Layers,
  CheckCircle2,
  Copy,
  ExternalLink,
  Terminal,
  Shield,
  FileCode,
  FolderTree
} from 'lucide-react';

export const SpringBootCode = () => {
  const { setCurrentPage } = useAuth();
  const [activeTab, setActiveTab] = useState('controller');
  const [copied, setCopied] = useState(false);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    controller: `package com.college.cems.controller;

import com.college.cems.entity.Event;
import com.college.cems.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents(
            @RequestParam(required = false, defaultValue = "false") boolean includeAll) {
        return ResponseEntity.ok(eventService.getAllEvents(includeAll));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        return ResponseEntity.ok(eventService.updateEvent(id, event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}`,
    entity: `package com.college.cems.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String category; // HACKATHON, WORKSHOP, SEMINAR, CULTURAL, SYMPOSIUM
    private String department; // CSE, IT, ECE, MECH, CIVIL, ALL
    private LocalDate startDate;
    private LocalDate endDate;
    private String venue;
    private Integer maxCapacity;
    private Integer registeredCount;
    private Double registrationFee;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus; // PENDING, APPROVED, REJECTED

    private String facultyCoordinator;
    private String facultyEmail;
}`,
    repository: `package com.college.cems.repository;

import com.college.cems.entity.Event;
import com.college.cems.entity.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByApprovalStatus(ApprovalStatus status);
    List<Event> findByDepartment(String department);
    List<Event> findByCategory(String category);
}`,
    application: `package com.college.cems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CollegeEventManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(CollegeEventManagementApplication.class, args);
        System.out.println("🚀 CEMS Spring Boot Application running on http://localhost:8088");
    }
}`
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Server className="w-3.5 h-3.5" /> Spring Boot 3.x • Java 17+ • IntelliJ IDEA
          </div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Spring Boot REST Backend Schema
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Standard controller, entity, and repository structure matching the frontend API service layer.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
        >
          Return to Portal
        </button>
      </div>

      {/* Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">REST API Port</h3>
              <p className="font-mono text-xs text-amber-700">http://localhost:8088/api</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            CORS configured for Vite React frontend running on port 5173.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Spring Data JPA</h3>
              <p className="font-mono text-xs text-indigo-700">MySQL / PostgreSQL</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Entities mapped for Events, Users, Registrations, Certificates & Feedback.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Role-Based Auth</h3>
              <p className="font-mono text-xs text-emerald-700">STUDENT | FACULTY | ADMIN</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Tiered permission gates for approvals, registrations, and NAAC reporting.
          </p>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
        {/* Tab Headers */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('controller')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'controller'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              EventController.java
            </button>
            <button
              onClick={() => setActiveTab('entity')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'entity'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Event.java (Entity)
            </button>
            <button
              onClick={() => setActiveTab('repository')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'repository'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              EventRepository.java
            </button>
            <button
              onClick={() => setActiveTab('application')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'application'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Application.java
            </button>
          </div>

          <button
            onClick={() => handleCopy(codeSnippets[activeTab])}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
        </div>

        {/* Code Block */}
        <pre className="p-6 text-xs text-amber-200 font-mono leading-relaxed overflow-x-auto">
          <code>{codeSnippets[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
};
