package com.example.college_event_backend.repository;


import com.example.college_event_backend.model.ApprovalStatus;
import com.example.college_event_backend.model.Event;
import jakarta.transaction.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDepartment(String department);
    List<Event> findByStatus(Status status);
    List<Event> findByApprovalStatus(ApprovalStatus approvalStatus);
}