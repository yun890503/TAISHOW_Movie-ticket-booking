package com.taishow.controller.client;

import com.taishow.service.client.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-code")
    public ResponseEntity<String> sendVerificationCode(@RequestParam String email) {
        if (emailService.isEmailExist(email)) {
            return ResponseEntity.status(409).body("Email already exists");
        }

        try {
            emailService.sendVerificationEmail(email);
            return ResponseEntity.ok("Verification code sent to email");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send verification code");
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<Boolean> verifyCode(@RequestParam String email, @RequestParam String code) {
        boolean isValid = emailService.verifyCode(email, code);
        return ResponseEntity.ok(isValid);
    }
}
