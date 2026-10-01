package com.example.college_event_backend.service;

import com.example.college_event_backend.exception.BadRequestException;
import com.example.college_event_backend.exception.ResourceNotFoundException;
import com.example.college_event_backend.model.ApprovalStatus;
import com.example.college_event_backend.model.Event;
import com.example.college_event_backend.model.EventStatus;
import com.example.college_event_backend.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository repo;

    public EventService(EventRepository repo) {
        this.repo = repo;
    }

    public List<Event> getAllEvents() {
        return repo.findAll();
    }

    public Event getEventById(Long id) {

        return repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found with id: " + id
                        )
                );
    }

    public Event createEvent(Event event) {

        if (event.getTitle() == null ||
                event.getTitle().trim().isEmpty()) {

            throw new BadRequestException(
                    "Event title is required"
            );
        }

        if (event.getStatus() == null) {
            event.setStatus(EventStatus.UPCOMING);
        }

        if (event.getApprovalStatus() == null) {
            event.setApprovalStatus(ApprovalStatus.PENDING);
        }

        return repo.save(event);
    }

    public Event approveEvent(
            Long eventId,
            boolean approved,
            String rejectionReason
    ) {

        Event event = repo.findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found with id: " + eventId
                        )
                );

        if (approved) {

            event.setApprovalStatus(
                    ApprovalStatus.APPROVED
            );

            event.setRejectionReason(null);

            if (event.getStatus() == null) {
                event.setStatus(EventStatus.UPCOMING);
            }

        } else {

            if (rejectionReason == null ||
                    rejectionReason.trim().isEmpty()) {

                throw new BadRequestException(
                        "Rejection reason is required when rejecting an event"
                );
            }

            event.setApprovalStatus(
                    ApprovalStatus.REJECTED
            );

            event.setRejectionReason(
                    rejectionReason.trim()
            );
        }

        return repo.save(event);
    }

    public void deleteEvent(Long id) {

        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Event not found with id: " + id
            );
        }

        repo.deleteById(id);
    }
}