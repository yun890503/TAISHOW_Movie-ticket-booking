package com.taishow.dao;

import com.taishow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("SELECT COALESCE(SUM(b.bonus), 0) AS totalBonus " +
            "FROM User u " +
            "JOIN Orders o ON u.id = o.userId " +
            "JOIN Payment p ON o.id = p.ordersId " +
            "JOIN Bonus b ON p.id = b.paymentId " +
            "WHERE u.id = :id " +
            "GROUP BY u.id")
    public Integer findTotalBonusByUserId(Integer id);
}
