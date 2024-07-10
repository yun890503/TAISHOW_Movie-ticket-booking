package com.taishow.controller.client;

import com.taishow.service.client.PhoneService;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/phone")
public class PhoneVerificationController {

    @Autowired
    private PhoneService phoneService;

    @PostMapping("/send-code")
    public ResponseEntity<String> sendVerificationCode(@RequestParam String phone) {
        if (phoneService.isPhoneExist(phone)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Phone number already in use");
        }

        try {
            phoneService.sendVerificationCode(phone);
            return ResponseEntity.ok("Verification code sent to phone number: " + phone);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send verification code: " + e.getMessage());
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<Boolean> verifyCode(@RequestParam String phone, @RequestParam String code) {
        boolean isValid = phoneService.verifyCode(phone, code);
        return ResponseEntity.ok(isValid);
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> isPhoneExist(@RequestParam String phone) {
        boolean exists = phoneService.isPhoneExist(phone);
        return ResponseEntity.ok(exists);
    }
}
