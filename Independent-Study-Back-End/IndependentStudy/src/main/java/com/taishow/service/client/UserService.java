package com.taishow.service.client;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.taishow.dao.UserDao;
import com.taishow.dto.Result;
import com.taishow.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public Result createUser(User users) {
        // 加密密碼
        String hashedPassword = BCrypt.withDefaults().hashToString(12, users.getPasswd().toCharArray());
        users.setPasswd(hashedPassword);
        userDao.save(users);
        return new Result(200, "success");
    }

    public Result updateUser(User users) {
        userDao.save(users);
        return new Result(200, "success");
    }

    public Result deleteUser(Integer userId) {
        userDao.deleteById(userId);
        return new Result(200, "success");
    }

    public Result getUser(Integer userId) {
        Optional<User> usersOptional = userDao.findById(userId);
        if (usersOptional.isPresent()) {
            return new Result(200, usersOptional.get());
        } else {
            return new Result(9999, "no data");
        }
    }

    public Result findAll() {
        List<User> users = userDao.findAll();
        return new Result(200, users);
    }

    public Result test(User users) {
        List<User> list = userDao.findByEmailJPQL(users.getEmail());
        return new Result(200, list);
    }

    public User findOrCreateUser(String email, String userName, String photo) {
        Optional<User> existingUser = userDao.findByEmail(email).stream().findFirst();

        if (existingUser.isPresent()) {
            return existingUser.get();
        } else {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUserName(userName);
            newUser.setPhoto(photo);
            userDao.save(newUser);
            return newUser;
        }
    }

    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        BCrypt.Result result = BCrypt.verifyer().verify(rawPassword.toCharArray(), hashedPassword);
        return result.verified;
    }
}
