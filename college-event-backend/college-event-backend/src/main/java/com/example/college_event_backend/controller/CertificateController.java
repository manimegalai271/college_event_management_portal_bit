package com.example.college_event_backend.controller;

import com.example.college_event_backend.model.Certificate;
import com.example.college_event_backend.service.CertificateService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certificates")
@CrossOrigin(origins = "http://localhost:5173")
public class CertificateController {

    private final CertificateService service;

    public CertificateController(CertificateService service) {
        this.service = service;
    }

    @PostMapping("/generate/{eventId}")
    public List<Certificate> generate(
            @PathVariable Long eventId) {

        return service.generateCertificatesForEvent(eventId);
    }

    @GetMapping("/user/{userId}")
    public List<Certificate> getByUser(
            @PathVariable Long userId) {

        return service.getCertificatesByUserId(userId);
    }
}