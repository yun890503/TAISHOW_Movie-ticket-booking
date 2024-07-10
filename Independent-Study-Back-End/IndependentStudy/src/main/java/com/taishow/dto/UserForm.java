package com.taishow.dto;

import com.taishow.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UserForm {


    private String userName; // 使用username字段名

    @NotBlank(message = "帳號不能為空")
    private String account;

    @NotBlank(message = "密碼不能為空")
    private String passwd;

    @NotBlank(message = "確認密碼不能為空")
    private String confirmPassword;

    private String phone; // 移除電話字段的驗證

    @NotBlank(message = "電子郵件不能為空")
    @Email(message = "電子郵件格式不正確")
    private String email;

    @NotBlank(message = "驗證碼不能為空")
    private String verificationCode;

    // Getters and setters

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPasswd() {
        return passwd;
    }

    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    // 轉換為 User 實體
    public User convertToUser() {
        User user = new User();
        user.setUserName(this.userName); // 對應User中的user_name字段
        user.setAccount(this.account);
        user.setPasswd(this.passwd);
        user.setPhone(this.phone);
        user.setEmail(this.email);
        // 設置其他需要的字段
        return user;
    }
}
