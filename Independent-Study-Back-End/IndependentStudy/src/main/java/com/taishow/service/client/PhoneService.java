package com.taishow.service.client;

import com.taishow.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class PhoneService {

    private final Map<String, String> verificationCodes = new HashMap<>();

    @Autowired
    private UserDao userDao;

    @Autowired
    private com.taishow.service.client.SmsSender smsSender;

    public void sendVerificationCode(String phone) {
        String code = generateVerificationCode();
        verificationCodes.put(phone, code);
        smsSender.sendSms(phone, "TAISHOW 電影訂票服務：您的驗證碼是:"+ code+"。請在驗證頁面輸入此代碼以完成手機驗證過程。\n " );
        System.out.println("Verification code sent to phone number: " + phone + ", code: " + code);
    }

    public boolean verifyCode(String phone, String code) {
        return code.equals(verificationCodes.get(phone));
    }

    public boolean isPhoneExist(String phone) {
        return userDao.findByPhone(phone).isPresent();
    }

    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
}

