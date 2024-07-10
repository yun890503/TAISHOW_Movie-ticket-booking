package com.taishow.dao;

import com.taishow.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    public Optional<Payment> findByOrdersId(Integer ordersId);

    // 尚未產生退款紀錄時使用
    @Query("SELECT p " +
        "FROM Orders o " +
        "JOIN Payment p ON o.id = p.ordersId " +
        "WHERE o.orderNum = :orderNum")
    public Optional<Payment> getPaymentByOrderNum(String orderNum);

    @Query("SELECT p " +
            "FROM Orders o " +
            "JOIN Payment p ON o.id = p.ordersId " +
            "WHERE o.orderNum = :orderNum AND p.method = :method")
    public Optional<Payment> getPaymentByOrderNumAndMethod(String orderNum, String method);
}
