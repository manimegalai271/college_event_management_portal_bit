package com.example.college_event_backend.controller;

import com.example.college_event_backend.model.Registration;
import com.example.college_event_backend.service.RegistrationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registrations")
@CrossOrigin(origins = "http://localhost:5173")
public class RegistrationController {

    private final RegistrationService service;

    public RegistrationController(RegistrationService service) {
        this.service = service;
    }

    @PostMapping
    public Registration register(@RequestBody Registration registration) {
        return service.registerStudent(registration);
    }

    @GetMapping("/user/{id}")
    public List<Registration> getByUser(@PathVariable Long id) {
        return service.getByUser(id);
    }
}