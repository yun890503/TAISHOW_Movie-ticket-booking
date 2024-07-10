package com.taishow.dao;

import com.taishow.entity.Bonus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BonusRepository extends JpaRepository<Bonus, Integer> {
    public List<Bonus> findByPaymentId(Integer paymentId);

    @Query("SELECT b " +
            "FROM Orders o " +
            "JOIN Payment p ON o.id = p.ordersId " +
            "JOIN Bonus b ON p.id = b.paymentId " +
            "WHERE o.orderNum = :orderNum AND p.method = :method")
    List<Bonus> getBonusByOrderNumAndMethod(String orderNum, String method);
}
