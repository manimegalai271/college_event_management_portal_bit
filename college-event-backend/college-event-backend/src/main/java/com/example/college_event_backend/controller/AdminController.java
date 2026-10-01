package com.example.college_event_backend.controller;

import com.example.college_event_backend.dto.ApiResponse;
import com.example.college_event_backend.model.Event;
import com.example.college_event_backend.model.User;
import com.example.college_event_backend.model.UserRole;
import com.example.college_event_backend.service.EventService;
import com.example.college_event_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final EventService eventService;
    private final UserService userService;

    public AdminController(
            EventService eventService,
            UserService userService
    ) {
        this.eventService = eventService;
        this.userService = userService;
    }

    @PatchMapping("/events/{eventId}/approve")
    public ResponseEntity<ApiResponse<Event>> reviewEventProposal(
            @PathVariable Long eventId,
            @RequestParam boolean approved,
            @RequestParam(
                    required = false,
                    defaultValue = ""
            ) String rejectionReason
    ) {

        Event event = eventService.approveEvent(
                eventId,
                approved,
                rejectionReason
        );

        String message = approved
                ? "Event proposal approved and released"
                : "Event proposal declined";

        return ResponseEntity.ok(
                ApiResponse.success(message, event)
        );
    }

    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<ApiResponse<User>> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body
    ) {

        String roleValue = body.get("role");

        if (roleValue == null ||
                roleValue.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Role is required"
            );
        }

        UserRole role = UserRole.valueOf(
                roleValue.trim().toUpperCase()
        );

        User user = userService.updateUserRole(
                userId,
                role
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User role updated to " + role,
                        user
                )
        );
    }

    @PatchMapping("/users/{userId}/toggle-status")
    public ResponseEntity<ApiResponse<User>> toggleUserStatus(
            @PathVariable Long userId
    ) {

        User user = userService.toggleUserStatus(userId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User status changed to "
                                + user.getStatus(),
                        user
                )
        );
    }
}