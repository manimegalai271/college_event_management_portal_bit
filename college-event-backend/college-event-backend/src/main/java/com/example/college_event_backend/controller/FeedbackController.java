package com.example.college_event_backend.controller;

import com.example.college_event_backend.model.Feedback;
import com.example.college_event_backend.service.FeedbackService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    @PostMapping
    public Feedback submit(@RequestBody Feedback feedback) {
        return service.submitFeedback(feedback);
    }

    @GetMapping("/event/{id}")
    public List<Feedback> getByEvent(@PathVariable Long id) {
        return service.getByEvent(id);
    }
}