package com.taishow.service.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SmsSender {

    @Value("${sms.api.url}")
    private String smsApiUrl;

    @Value("${sms.api.key}")
    private String smsApiKey;

    @Value("${sms.from.number}")
    private String fromNumber;

    public void sendSms(String phoneNumber, String message) {
        // 確保電話號碼包含國家代碼
        final String formattedPhoneNumber;
        if (!phoneNumber.startsWith("+")) {
            formattedPhoneNumber = "+886" + phoneNumber.substring(1); // 假設是台灣的電話號碼，請根據需要調整
        } else {
            formattedPhoneNumber = phoneNumber;
        }

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "App " + smsApiKey);
        headers.set("Content-Type", "application/json");

        Map<String, Object> messageData = new HashMap<>();
        messageData.put("from", fromNumber);
        messageData.put("destinations", new Object[]{new HashMap<String, String>() {{
            put("to", formattedPhoneNumber);
        }}});
        messageData.put("text", message);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("messages", new Object[]{messageData});

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(smsApiUrl, requestEntity, String.class);
            System.out.println("Response Status Code: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to send SMS: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Failed to send SMS: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

