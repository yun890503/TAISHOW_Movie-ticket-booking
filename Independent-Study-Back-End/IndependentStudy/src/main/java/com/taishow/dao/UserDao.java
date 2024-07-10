package com.taishow.dao;

import com.taishow.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDao extends JpaRepository<User, Integer> {
    Optional<User> findByAccount(String account);
    Optional<User> findByPhone(String phone);
    boolean existsByAccount(String account);
    boolean existsByEmail(String email);

    @Transactional
    List<User> findByEmail(String email);
    List<User> findByEmailAndPasswd(String email, String passwd);

    @Query("SELECT u FROM User u WHERE u.email = ?1")
    List<User> findByEmailJPQL(String email);
}

