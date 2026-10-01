package com.example.college_event_backend.controller;

import com.example.college_event_backend.model.User;
import com.example.college_event_backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService service;

    public AuthController(UserService service) {
        this.service = service;
    }

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return service.registerUser(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return service.loginUser(user.getEmail(), user.getPassword());
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }
}