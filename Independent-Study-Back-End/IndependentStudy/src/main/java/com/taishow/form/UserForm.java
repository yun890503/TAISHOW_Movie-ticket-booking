package com.taishow.form;


import com.taishow.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.BeanUtils;
public class UserForm {

    public static final String PHONE_REG = "(\\d{2,3}-?|\\(\\d{2,3}\\))\\d{3,4}-?\\d{4}|09\\d{2}(\\d{6}|-\\d{3}-\\d{3})";

    private String image;
    @NotBlank
    private String account;
    @NotBlank
    @Length(min = 6)
    private String passwd ;
    @Pattern(regexp = PHONE_REG)
    private String phone;
    @Email
    private String email ;
//    @NotBlank
    private String confirmPassword;

    public UserForm() {
    }

    public UserForm(String image, String account, String passwd, String phone, String email, String confirmPassword) {
        this.image = image;
        this.account = account;
        this.passwd = passwd;
        this.phone = phone;
        this.email = email;
        this.confirmPassword = confirmPassword;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
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

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public boolean confirmPassword(){
        if(this.confirmPassword.equals(this.passwd)){
            return true;
        }
        return false;
    }

    // UserForm method: convertToUser()
    public User convertToUser(){
        User users = new UserFormConvert().convert(this);
        return users;
    }

    @Override
    public String toString() {
        return "UserForm{" +
                "account='" + account + '\'' +
                ", passwd='" + passwd + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", confirmPassword='" + confirmPassword + '\'' +
                '}';
    }

    // 聚合 => 內部類別
    // 實作 FormConvert 具有規範的介面 => override: convert => userForm -> users
    private class UserFormConvert implements FormConvert<UserForm, User>{
        @Override
        public User convert(UserForm userForm) {
            User users = new User();
            BeanUtils.copyProperties(userForm, users);
            return users;
        }
    }
}
