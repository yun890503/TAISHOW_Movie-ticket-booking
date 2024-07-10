package com.taishow.service.client;

import com.taishow.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserDao userDao;

    private final Map<String, String> verificationCodes = new HashMap<>();
    private final Map<String, Long> verificationExpiry = new HashMap<>();
    private final long CODE_EXPIRATION_TIME = TimeUnit.MINUTES.toMillis(3); // 3minutes

    public void sendLoginNotification(String to, String username, String loginTime, String ipAddress, String country, String deviceInfo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("泰秀電影購票平台登入成功通知");
        message.setText("親愛的"+username+"您好：\n\n" +
                "您於 " + loginTime + " 成功登入泰秀電影購票平台，提供以下登入資訊供參考確認，\n" +
                "請您留意登入時間是否正常，如非您本人操作，請儘速與我們連繫，我們將竭誠為您服務！\n\n" +
                "登入成功資訊\n" +
                "登入時間    " + loginTime + "\n" +
                "IP        " + ipAddress + "\n" +
                "國家       " + country + "\n" +
                "裝置/版本   " + deviceInfo + "\n\n" +
                "提醒您，為保障您的權益，請不要將您的「用戶代號」與「密碼」交付任何人或其他網站。\n\n" +
                "此致，\n" +
                "TAISHOW");

        mailSender.send(message);
    }
    public void sendVerificationEmail(String to) {
        if (isEmailExist(to)) {
            // Handle email already exists case if needed
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Email Verification Code");
        String verificationCode = generateVerificationCode();
        message.setText("主題: TAISHOW 電子郵件驗證碼\n" +
                "\n" +
                "親愛的用戶，\n" +
                "\n" +
                "感謝您使用 TAISHOW 電影訂票服務。您的驗證碼是：" + verificationCode +
                "\n" +
                "請在驗證頁面輸入此代碼以完成電子郵件驗證過程。\n" +
                "\n" +
                "如果您未請求此驗證，請忽略此郵件。\n" +
                "\n" +
                "此致，\n" +
                "TAISHOW 團隊\n ");
        mailSender.send(message);

        verificationCodes.put(to, verificationCode);
        verificationExpiry.put(to, System.currentTimeMillis() + CODE_EXPIRATION_TIME);
    }

    public boolean verifyCode(String email, String code) {
        if (!verificationCodes.containsKey(email)) {
            return false;
        }

        long expiryTime = verificationExpiry.get(email);
        if (System.currentTimeMillis() > expiryTime) {
            verificationCodes.remove(email);
            verificationExpiry.remove(email);
            return false;
        }

        boolean isValid = code.equals(verificationCodes.get(email));
        if (isValid) {
            verificationCodes.remove(email);
            verificationExpiry.remove(email);
        }
        return isValid;
    }

    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    public boolean isEmailExist(String email) {
        return !userDao.findByEmail(email).isEmpty();
    }
}
