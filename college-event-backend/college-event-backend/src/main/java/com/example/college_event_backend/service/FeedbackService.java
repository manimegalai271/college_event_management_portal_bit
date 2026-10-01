package com.example.college_event_backend.service;

import com.example.college_event_backend.model.Event;
import com.example.college_event_backend.model.EventStatus;
import com.example.college_event_backend.model.Feedback;
import com.example.college_event_backend.model.Status; // ✅ CORRECT IMPORT
import com.example.college_event_backend.repository.EventRepository;
import com.example.college_event_backend.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepo;
    private final EventRepository eventRepo;

    public FeedbackService(FeedbackRepository feedbackRepo,
                           EventRepository eventRepo) {
        this.feedbackRepo = feedbackRepo;
        this.eventRepo = eventRepo;
    }

    public Feedback submitFeedback(Feedback feedback) {

        Event event = eventRepo.findById(feedback.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // ✅ THIS WILL NOW WORK
        if (event.getStatus() != EventStatus.COMPLETED) {
            throw new RuntimeException("Event not completed");
        }

        return feedbackRepo.save(feedback);
    }

    public List<Feedback> getByEvent(Long eventId) {
        return feedbackRepo.findByEventId(eventId);
    }
}