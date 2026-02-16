package com.fleetsystem.springbackend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fleetsystem.springbackend.entity.UserEntity;
import com.fleetsystem.springbackend.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("Login attempt for email: " + request.getEmail());
            
            Optional<UserEntity> userOpt = userService.authenticateUser(request.getEmail(), request.getPassword());
            
            if (userOpt.isPresent()) {
                UserEntity user = userOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("name", user.getName());
                response.put("email", user.getEmail());
                response.put("company", user.getCompany());
                response.put("token", generateToken());
                
                System.out.println("Login successful for user: " + user.getEmail());
                return ResponseEntity.ok(response);
            } else {
                System.out.println("Login failed - invalid credentials for email: " + request.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
            }
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody SignupRequest request) {
        try {
            System.out.println("Signup attempt for email: " + request.getEmail());
            
            // Validate input
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Name is required"));
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email is required"));
            }
            if (request.getPassword() == null || request.getPassword().length() < 6) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Password must be at least 6 characters"));
            }
            
            UserEntity user = userService.createUser(
                request.getName().trim(),
                request.getEmail().trim().toLowerCase(),
                request.getCompany() != null ? request.getCompany().trim() : "Unknown Company",
                request.getPassword()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("company", user.getCompany());
            response.put("token", generateToken());
            
            System.out.println("Signup successful for user: " + user.getEmail());
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            System.out.println("Signup failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.out.println("Signup error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Signup failed: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            System.out.println("Forgot password request for email: " + request.getEmail());
            
            // Validate email
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email is required"));
            }
            
            // Check if user exists
            Optional<UserEntity> userOpt = userService.findByEmail(request.getEmail().trim().toLowerCase());
            
            if (userOpt.isPresent()) {
                // In a real implementation, you would:
                // 1. Generate a secure token
                // 2. Store it with expiration time
                // 3. Send email with reset link
                
                // For now, simulate the process
                String resetToken = "reset_" + UUID.randomUUID().toString();
                System.out.println("Generated reset token for " + request.getEmail() + ": " + resetToken);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Password reset instructions sent to your email");
                response.put("resetToken", resetToken); // In production, don't return this
                
                return ResponseEntity.ok(response);
            } else {
                // For security, don't reveal if email exists or not
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "If an account with that email exists, password reset instructions have been sent");
                
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            System.out.println("Forgot password error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to process password reset request"));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            System.out.println("Reset password request for token: " + request.getResetToken());
            
            // Validate input
            if (request.getResetToken() == null || request.getResetToken().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Reset token is required"));
            }
            
            if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Password must be at least 6 characters"));
            }
            
            // In a real implementation, you would:
            // 1. Validate the reset token
            // 2. Check if it's not expired
            // 3. Find the associated user
            // 4. Update their password
            
            // For now, simulate successful reset
            if (request.getResetToken().startsWith("reset_")) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Password has been reset successfully");
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid or expired reset token"));
            }
            
        } catch (Exception e) {
            System.out.println("Reset password error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to reset password"));
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            System.out.println("Change password request for email: " + request.getEmail());
            
            // Validate input
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email is required"));
            }
            
            if (request.getCurrentPassword() == null || request.getCurrentPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Current password is required"));
            }
            
            if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "New password must be at least 6 characters"));
            }
            
            // Authenticate user with current password
            Optional<UserEntity> userOpt = userService.authenticateUser(request.getEmail(), request.getCurrentPassword());
            
            if (userOpt.isPresent()) {
                UserEntity user = userOpt.get();
                
                // Update password
                boolean updated = userService.updatePassword(user.getId(), request.getNewPassword());
                
                if (updated) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Password changed successfully");
                    
                    return ResponseEntity.ok(response);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to update password"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Current password is incorrect"));
            }
            
        } catch (Exception e) {
            System.out.println("Change password error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to change password"));
        }
    }

    private String generateToken() {
        return "jwt_token_" + UUID.randomUUID().toString();
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class SignupRequest {
        private String name;
        private String email;
        private String company;
        private String password;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class ForgotPasswordRequest {
        private String email;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
    
    public static class ResetPasswordRequest {
        private String resetToken;
        private String newPassword;
        
        public String getResetToken() { return resetToken; }
        public void setResetToken(String resetToken) { this.resetToken = resetToken; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
    
    public static class ChangePasswordRequest {
        private String email;
        private String currentPassword;
        private String newPassword;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}