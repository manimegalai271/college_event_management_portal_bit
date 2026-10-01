package com.example.college_event_backend.service;

import com.example.college_event_backend.model.Certificate;
import com.example.college_event_backend.model.Event;
import com.example.college_event_backend.model.Registration;
import com.example.college_event_backend.repository.CertificateRepository;
import com.example.college_event_backend.repository.EventRepository;
import com.example.college_event_backend.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepo;
    private final EventRepository eventRepo;
    private final RegistrationRepository regRepo;

    public CertificateService(
            CertificateRepository certificateRepo,
            EventRepository eventRepo,
            RegistrationRepository regRepo) {

        this.certificateRepo = certificateRepo;
        this.eventRepo = eventRepo;
        this.regRepo = regRepo;
    }

    public List<Certificate> generateCertificatesForEvent(Long eventId) {

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<Registration> registrations = regRepo.findByEventId(eventId);

        List<Certificate> result = new ArrayList<>();

        for (Registration registration : registrations) {

            if (!certificateRepo.existsByEventIdAndUserId(
                    eventId,
                    registration.getUserId())) {

                Certificate certificate = new Certificate();

                certificate.setUserId(registration.getUserId());
                certificate.setEventId(eventId);

                certificate.setStudentName(registration.getUserName());
                certificate.setEventName(event.getTitle());
                certificate.setDepartment(registration.getDepartment());

                certificate.setCertificateNumber(
                        "CERT-" +
                                UUID.randomUUID()
                                        .toString()
                                        .substring(0, 6)
                                        .toUpperCase()
                );

                certificate.setIssueDate(LocalDate.now().toString());

                Certificate savedCertificate =
                        certificateRepo.save(certificate);

                result.add(savedCertificate);
            }
        }

        return result;
    }

    public List<Certificate> getCertificatesByUserId(Long userId) {
        return certificateRepo.findByUserId(userId);
    }
}