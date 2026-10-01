package com.example.college_event_backend.service;


import com.example.college_event_backend.model.Event;
import com.example.college_event_backend.model.Registration;
import com.example.college_event_backend.repository.EventRepository;
import com.example.college_event_backend.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RegistrationService {

    private final RegistrationRepository repo;
    private final EventRepository eventRepo;

    public RegistrationService(RegistrationRepository repo,
                               EventRepository eventRepo) {
        this.repo = repo;
        this.eventRepo = eventRepo;
    }

    public Registration registerStudent(Registration r) {

        if (repo.existsByUserIdAndEventId(r.getUserId(), r.getEventId())) {
            throw new RuntimeException("Already registered");
        }

        Event event = eventRepo.findById(r.getEventId()).orElseThrow();

        r.setTicketCode("TKT-" + UUID.randomUUID().toString().substring(0, 6));
        r.setStatus("CONFIRMED");

        event.setRegisteredCount(event.getRegisteredCount() + 1);
        eventRepo.save(event);

        return repo.save(r);
    }

    public List<Registration> getByUser(Long userId) {
        return repo.findByUserId(userId);
    }
}