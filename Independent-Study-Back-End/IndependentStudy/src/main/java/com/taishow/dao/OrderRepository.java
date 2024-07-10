package com.taishow.dao;

import com.taishow.dto.OrderRecordDetailDto;
import com.taishow.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Integer> {
    public Optional<Orders> findByOrderNum(String orderNum);

    @Query("SELECT o.orderNum, u.account, o.totalAmount, COALESCE(SUM(b.bonus), 0) AS totalBonus, p.payway, p.payStatus " +
            "FROM Orders o " +
            "JOIN User u ON o.userId = u.id " +
            "JOIN Payment p ON o.id = p.ordersId " +
            "LEFT JOIN Bonus b ON p.id = b.paymentId " +
            "WHERE p.method = :method " +
            "GROUP BY o.orderNum, u.account, o.totalAmount, p.payway, p.payStatus " +
            "ORDER BY o.orderNum DESC")
    public List<Object[]> getAllOrderRecordByMethod(String method);

    @Query("SELECT o.orderNum, o.orderDate, u.account, o.totalAmount, COALESCE(SUM(b.bonus), 0) AS totalBonus, o.qrcode, m.title, st.showTime, " +
            "tt.ticketType, s.rowNum, s.seatNum, tt.unitPrice, p.payway, p.payStatus, p.payTime, p.modifyTime " +
            "FROM Orders o " +
            "JOIN User u ON o.userId = u.id " +
            "JOIN Payment p ON o.id = p.ordersId " +
            "JOIN Tickets t ON o.id = t.ordersId " +
            "JOIN TicketType tt ON t.ticketTypeId = tt.id " +
            "JOIN SeatStatus ss ON t.seatStatusId = ss.id " +
            "JOIN Seat s ON ss.seatId = s.id " +
            "JOIN ShowTime st ON ss.showTimeId = st.id " +
            "JOIN Movie m ON st.movieId = m.id " +
            "LEFT JOIN Bonus b ON p.id = b.paymentId " +
            "WHERE o.orderNum = :orderNum AND p.method = :method " +
            "GROUP BY o.orderNum, o.orderDate, u.account, o.totalAmount, o.qrcode, m.title, st.showTime, tt.ticketType, s.rowNum, s.seatNum, tt.unitPrice, p.payway, p.payStatus, p.payTime, p.modifyTime")
    public List<Object[]> getOrderRecordDetailByOrderNumAndMethod(String orderNum, String method);

    @Query("SELECT DISTINCT st.showTime " +
            "FROM Orders o " +
            "JOIN Tickets t ON o.id = t.ordersId " +
            "JOIN SeatStatus ss ON t.seatStatusId = ss.id " +
            "JOIN ShowTime st ON ss.showTimeId = st.id " +
            "WHERE o.orderNum = :orderNum")
    public Optional<Date> getShowTimeByOrderNum(String orderNum);

    @Query("SELECT o.orderNum, u.account, o.totalAmount, b.bonus, p.payway, p.payStatus " +
            "FROM Orders o " +
            "JOIN User u ON o.userId = u.id " +
            "JOIN Payment p ON o.id = p.ordersId " +
            "JOIN Bonus b ON p.id = b.paymentId " +
            "ORDER BY o.orderNum DESC")
    public List<Object[]> getAllBonusRecord();

    @Query("SELECT o.orderNum, u.account, o.totalAmount, COALESCE(SUM(DISTINCT b.bonus), 0) AS totalBonus, p.payway, p.payStatus, st.showTime, " +
            "(SELECT COUNT(DISTINCT p2.payStatus) > 1 FROM Payment p2 WHERE p2.ordersId = o.id) AS multiplePayStatus " +
            "FROM Orders o " +
            "JOIN User u ON o.userId = u.id " +
            "JOIN Payment p ON o.id = p.ordersId " +
            "JOIN Tickets t ON o.id = t.ordersId " +
            "JOIN SeatStatus ss ON t.seatStatusId = ss.id " +
            "JOIN ShowTime st ON ss.showTimeId = st.id " +
            "LEFT JOIN Bonus b ON p.id = b.paymentId " +
            "WHERE p.method = :method " +
            "GROUP BY o.orderNum, u.account, o.totalAmount, p.payway, p.payStatus, st.showTime, o.id " +
            "ORDER BY o.orderNum DESC")
    public List<Object[]> getAllOrderRecordAndShowTimeByMethod(@Param("method") String method);

    @Query("SELECT DISTINCT o.orderNum, st.showTime " +
            "FROM Orders o " +
            "JOIN Payment p ON o.id = p.ordersId " +
            "JOIN Tickets t ON o.id = t.ordersId " +
            "JOIN SeatStatus ss ON t.seatStatusId = ss.id " +
            "JOIN ShowTime st ON ss.showTimeId = st.id " +
            "WHERE p.payStatus = '未付款'")
    public List<Object[]> findPendingOrders();
}
