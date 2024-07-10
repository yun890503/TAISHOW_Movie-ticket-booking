package com.taishow.dao;

import com.taishow.entity.Bonus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BonusDao extends JpaRepository<Bonus, Integer> {

    @Query("SELECT o, p, t, ss, s, m, sc, th, b FROM Orders o " +
            "LEFT JOIN Payment p ON o.id = p.ordersId " +
            "LEFT JOIN Tickets t ON o.id = t.ordersId " +
            "LEFT JOIN SeatStatus ss ON t.seatStatusId = ss.id " +
            "LEFT JOIN ShowTime s ON ss.showTimeId = s.id " +
            "LEFT JOIN Movie m ON s.movieId = m.id " +
            "LEFT JOIN Screen sc ON s.screenId = sc.id " +
            "LEFT JOIN Theaters th ON sc.theaterId = th.id " +
            "LEFT JOIN Bonus b ON p.id = b.paymentId " +
            "WHERE o.userId = :userId")
    List<Object[]> findByAll(@Param("userId") Integer userId);

    @Query("SELECT DISTINCT b.id, o.orderDate, b.bonus, st.showTime, m.title, " +
            "th.theaterName, sc.screenName, p.payway, p.payStatus " +
            "FROM Orders o " +
            "JOIN Payment p ON o.id = p.ordersId " +
            "JOIN Tickets t ON o.id = t.ordersId " +
            "JOIN SeatStatus ss ON t.seatStatusId = ss.id " +
            "JOIN ShowTime st ON ss.showTimeId = st.id " +
            "JOIN Movie m ON st.movieId = m.id " +
            "JOIN Screen sc ON st.screenId = sc.id " +
            "JOIN Theaters th ON sc.theaterId = th.id " +
            "JOIN Bonus b ON p.id = b.paymentId " +
            "WHERE o.userId = :userId " +
            "ORDER BY b.id DESC")
    List<Object[]> findBonusDetailByUserId(Integer userId);
}
