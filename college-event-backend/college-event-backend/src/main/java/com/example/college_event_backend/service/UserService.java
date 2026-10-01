package com.example.college_event_backend.service;

import com.example.college_event_backend.exception.BadRequestException;
import com.example.college_event_backend.exception.ResourceNotFoundException;
import com.example.college_event_backend.model.Status;
import com.example.college_event_backend.model.User;
import com.example.college_event_backend.model.UserRole;
import com.example.college_event_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public User registerUser(User user) {

        if (user.getEmail() == null ||
                user.getEmail().trim().isEmpty()) {

            throw new BadRequestException(
                    "Email is required"
            );
        }

        if (user.getPassword() == null ||
                user.getPassword().trim().isEmpty()) {

            throw new BadRequestException(
                    "Password is required"
            );
        }

        if (user.getRole() == null) {
            user.setRole(UserRole.STUDENT);
        }

        if (user.getStatus() == null) {
            user.setStatus(Status.ACTIVE);
        }

        return repo.save(user);
    }

    public User loginUser(
            String email,
            String password
    ) {

        User user = repo.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                );

        if (!user.getPassword().equals(password)) {
            throw new BadRequestException(
                    "Invalid password"
            );
        }

        if (user.getStatus() == Status.INACTIVE) {
            throw new BadRequestException(
                    "User account is inactive"
            );
        }

        return user;
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public User updateUserRole(
            Long userId,
            UserRole role
    ) {

        User user = repo.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        )
                );

        if (role == null) {
            throw new BadRequestException(
                    "Role is required"
            );
        }

        user.setRole(role);

        return repo.save(user);
    }

    public User toggleUserStatus(Long userId) {

        User user = repo.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        )
                );

        if (user.getStatus() == Status.ACTIVE) {
            user.setStatus(Status.INACTIVE);
        } else {
            user.setStatus(Status.ACTIVE);
        }

        return repo.save(user);
    }
}