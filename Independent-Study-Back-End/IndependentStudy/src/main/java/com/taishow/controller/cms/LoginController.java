package com.taishow.controller.cms;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.taishow.dao.UserDao;
import com.taishow.entity.User;
import com.taishow.util.JwtUtilForCms;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/permission")
public class LoginController {

    private UserDao userDao;

    @Autowired
    private JwtUtilForCms jwtUtil;

    public LoginController(UserDao userDao) {
        this.userDao = userDao;
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginPost(@RequestBody User user, HttpServletRequest request) {
        if (!"admin".equals(user.getAccount())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("帳號或密碼錯誤");
        }

        Optional<User> optionalUser = userDao.findByAccount(user.getAccount());
        if (optionalUser.isPresent()) {
            User foundUser = optionalUser.get();
            BCrypt.Result result = BCrypt.verifyer().verify(user.getPasswd().toCharArray(), foundUser.getPasswd());

            if (result.verified) {
                String token = jwtUtil.generateToken(
                        foundUser.getId(),
                        foundUser.getAccount()
                );
                return ResponseEntity.ok(token);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("帳號或密碼錯誤");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("帳號或密碼錯誤");
        }
    }
}
