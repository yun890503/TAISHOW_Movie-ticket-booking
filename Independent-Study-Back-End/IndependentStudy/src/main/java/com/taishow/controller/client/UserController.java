package com.taishow.controller.client;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.taishow.dao.UserDao;
import com.taishow.dto.*;
import com.taishow.entity.User;
import com.taishow.service.client.EmailService;
import com.taishow.service.client.UserService;
import com.taishow.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserDao userDao;

    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/createUser")
    public Result createUser(@RequestBody User users){
        return userService.createUser(users);
    }

    @PutMapping("/updateUser")
    public Result updateUser(@RequestBody User users){
        return userService.updateUser(users);
    }

    @DeleteMapping("/deleteUser/{id}")
    public Result deleteUser(@PathVariable Integer id){
        return userService.deleteUser(id);
    }

    @GetMapping("/getUser/{id}")
    public Result getUser(@PathVariable Integer id){
        return userService.getUser(id);
    }

    @GetMapping("/getAll")
    public Result findAll(){
        return userService.findAll();
    }

    @PostMapping("/sendVerification")
    public ResponseEntity<String> sendVerification(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        emailService.sendVerificationEmail(email);
        return ResponseEntity.ok("驗證碼已發送");
    }

    @PostMapping("/checkAccountEmail")
    public ResponseEntity<String> checkAccountEmail(@RequestBody Map<String, String> request) {
        String account = request.get("account");
        String email = request.get("email");

        boolean accountExists = userDao.existsByAccount(account);
        boolean emailExists = userDao.existsByEmail(email);

        if (accountExists) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("該帳號已被使用");
        }
        if (emailExists) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("該電子信箱已被使用");
        }

        return ResponseEntity.ok("");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserForm userForm, BindingResult result) {
        if (result.hasErrors()) {
            List<FieldError> fieldErrors = result.getFieldErrors();
            StringBuilder errorMessages = new StringBuilder();
            for (FieldError fieldError : fieldErrors) {
                errorMessages.append(fieldError.getField())
                        .append(":")
                        .append(fieldError.getDefaultMessage())
                        .append(":")
                        .append(fieldError.getCode())
                        .append("\n");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessages.toString());
        }

        // 檢查驗證碼
        boolean isCodeValid = emailService.verifyCode(userForm.getEmail(), userForm.getVerificationCode());
        if (!isCodeValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("驗證碼無效或已過期");
        }

        // 檢查密碼和確認密碼是否匹配
        if (!userForm.getPasswd().equals(userForm.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("密碼和確認密碼不匹配");
        }

        // 轉換 UserForm 為 User 實體並保存到數據庫
        User user = userForm.convertToUser();
        userService.createUser(user);
        return ResponseEntity.ok("註冊成功");
    }


    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @NonNull User loginRequest, HttpServletRequest request) {
        Optional<User> optionalUser = userDao.findByAccount(loginRequest.getAccount());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (userService.verifyPassword(loginRequest.getPasswd(), user.getPasswd())) {
                String birthday = (user.getBirthday() != null) ? user.getBirthday().toString() : "N/A";

                String token = jwtUtil.generateToken(
                        user.getId(),
                        user.getUserName(),
                        user.getEmail(),
                        user.getAddress(),
                        user.getGender(),
                        user.getPhone(),
                        user.getAccount(),
                        birthday
                );

                String loginTime = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new Date());
                String ipAddress = request.getRemoteAddr();
                String country = "Taiwan"; // 你可能需要使用服务根据IP地址确定国家
                String deviceInfo = request.getHeader("User-Agent");

                emailService.sendLoginNotification(user.getEmail(), user.getUserName(), loginTime, ipAddress, country, deviceInfo);

                return ResponseEntity.ok(token);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("登入失敗，帳號或密碼錯誤");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("登入失敗，帳號或密碼錯誤");
        }
    }

    @PostMapping("/google-login")
    public ResponseEntity<String> googleLogin(@RequestBody GoogleLoginRequest request, HttpServletRequest httpRequest) {
        User user = userService.findOrCreateUser(request.getEmail(), request.getUserName(), request.getPhoto());

        // 確認用戶生日是否存在，若無則設置為 "N/A"
        String birthday = (user.getBirthday() != null) ? user.getBirthday().toString() : "N/A";

        // 生成 JWT 令牌
        String token = jwtUtil.generateToken(
                user.getId(),
                user.getUserName(),
                user.getEmail(),
                user.getAddress(),
                user.getGender(),
                user.getPhone(),
                user.getAccount(),
                birthday
        );

        // 獲取登入時間、IP 地址、國家和設備信息
        String loginTime = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new Date());
        String ipAddress = httpRequest.getRemoteAddr();
        String country = "Taiwan"; // 你可能需要使用服務根據 IP 地址確定國家
        String deviceInfo = httpRequest.getHeader("User-Agent");

        // 發送登入通知郵件
        emailService.sendLoginNotification(user.getEmail(), user.getUserName(), loginTime, ipAddress, country, deviceInfo);

        // 返回生成的 JWT 令牌
        return ResponseEntity.ok(token);
    }



    @GetMapping("/user-info")
    public ResponseEntity<User> getUserInfo(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        Integer userId = jwtUtil.getUserIdFromToken(token);

        Optional<User> optionalUser = userDao.findById(userId);
        if (optionalUser.isPresent()) {
            return ResponseEntity.ok(optionalUser.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/upload-info")
    public ResponseEntity<String> putUserInfo(HttpServletRequest request, @RequestBody @NonNull User userInfo) {
        String token = request.getHeader("Authorization").substring(7);
        Integer userId = jwtUtil.getUserIdFromToken(token);

        Optional<User> optionalUser = userDao.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUserName(userInfo.getUserName());
            user.setEmail(userInfo.getEmail());
            user.setAddress(userInfo.getAddress());
            user.setGender(userInfo.getGender());
            user.setPhone(userInfo.getPhone());

            if (userInfo.getBirthday() != null) {
                user.setBirthday(userInfo.getBirthday());
            }
            if (userInfo.getPhoto() != null) {
                user.setPhoto(userInfo.getPhoto());
            }
            userDao.save(user);

            return ResponseEntity.ok("用戶信息更新成功");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("用戶未找到");
        }
    }
    @PutMapping("/upload-photo")
    public ResponseEntity<String> uploadPhoto(HttpServletRequest request, @RequestBody String photo) {
        String token = request.getHeader("Authorization").substring(7);
        Integer userId = jwtUtil.getUserIdFromToken(token);

        Optional<User> optionalUser = userDao.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setPhoto(photo);

            userDao.save(user);

            return ResponseEntity.ok("用戶照片更新成功");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("用戶未找到");
        }
    }
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        Integer userId = jwtUtil.getUserIdFromToken(token);

        Optional<User> optionalUser = userDao.findById(userId);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        User user = optionalUser.get();
        if (!userService.verifyPassword(changePasswordRequest.getOldPassword(), user.getPasswd())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Old password is incorrect");
        }

        if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New passwords do not match");
        }

        // 加密新密碼
        String hashedPassword = BCrypt.withDefaults().hashToString(12, changePasswordRequest.getNewPassword().toCharArray());
        user.setPasswd(hashedPassword);
        userDao.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }

}