package com.taishow.dao;

import com.taishow.entity.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface SeatStatusRepository extends JpaRepository<SeatStatus, Integer> {

    @Query("SELECT p.payStatus " +
            "FROM SeatStatus ss " +
            "JOIN Tickets t ON ss.id = t.seatStatusId " +
            "JOIN Orders o ON t.ordersId = o.id " +
            "JOIN Payment p ON o.id = p.ordersId " +
            "WHERE ss.id = :id " +
            "ORDER BY p.modifyTime DESC")
    public List<String> getPayStatusById(Integer id);

    @Query(value= "SELECT t.theaterName, s.screenName, se.rowNum, se.seatNum, ss.status, st.showTime, se.id as seatId, st.id as showtimeId, m.title, m.poster " +
            "FROM Theaters t " +
            "JOIN Screen s on t.id = s.theaterId " +
            "JOIN Seat se on s.id = se.screenId " +
            "JOIN SeatStatus ss on se.id = ss.seatId " +
            "JOIN ShowTime st on ss.showTimeId = st.id " +
            "JOIN Movie m on st.movieId = m.id " +
            "WHERE t.theaterName = :theaterName " +
            "AND s.screenName = :screenName " +
            "AND st.showTime = :showTime")
    List<Object[]> findSeatStatus(@Param("theaterName") String theaterName,
                                  @Param("screenName") String screenName,
                                  @Param("showTime")LocalDateTime showTime);


    @Query(value = "SELECT p.payStatus " +
            "FROM SeatStatus ss " +
            "JOIN Tickets t ON ss.id = t.seatStatusId " +
            "JOIN Orders o ON t.ordersId = o.id " +
            "JOIN Payment p ON o.id = p.ordersId " +
            "WHERE ss.id = :id")
    List<String> getPayStatusById1(@Param("id") Integer id);


    // 根據座位ID查詢座位狀態
    SeatStatus findBySeatId(Integer seatId);

    // 根據座位ID和場次ID查詢座位狀態
    SeatStatus findBySeatIdAndShowTimeId(Integer seatId, Integer showTimeId);
}
