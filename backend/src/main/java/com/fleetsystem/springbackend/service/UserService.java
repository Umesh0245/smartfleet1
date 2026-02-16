package com.fleetsystem.springbackend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fleetsystem.springbackend.entity.UserEntity;
import com.fleetsystem.springbackend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordService passwordService;

    public UserEntity createUser(String name, String email, String company, String password) {
        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User with email " + email + " already exists");
        }

        // Create new user
        UserEntity user = new UserEntity();
        user.setName(name);
        user.setEmail(email);
        user.setCompany(company);
        user.setPasswordHash(passwordService.hashPassword(password));

        return userRepository.save(user);
    }

    public Optional<UserEntity> authenticateUser(String email, String password) {
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            if (passwordService.checkPassword(password, user.getPasswordHash())) {
                return Optional.of(user);
            }
        }
        
        return Optional.empty();
    }

    public Optional<UserEntity> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public boolean updatePassword(String userId, String newPassword) {
        try {
            Optional<UserEntity> userOpt = userRepository.findById(userId);
            
            if (userOpt.isPresent()) {
                UserEntity user = userOpt.get();
                user.setPasswordHash(passwordService.hashPassword(newPassword));
                userRepository.save(user);
                return true;
            }
            
            return false;
        } catch (Exception e) {
            System.err.println("Error updating password for user " + userId + ": " + e.getMessage());
            return false;
        }
    }
}