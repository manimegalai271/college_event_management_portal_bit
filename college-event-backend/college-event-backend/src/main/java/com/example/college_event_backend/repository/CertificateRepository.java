package com.example.college_event_backend.repository;

import com.example.college_event_backend.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository
        extends JpaRepository<Certificate, Long> {

    List<Certificate> findByUserId(Long userId);

    List<Certificate> findByEventId(Long eventId);

    Optional<Certificate> findByCertificateNumber(
            String certificateNumber);

    boolean existsByEventIdAndUserId(
            Long eventId,
            Long userId);
}