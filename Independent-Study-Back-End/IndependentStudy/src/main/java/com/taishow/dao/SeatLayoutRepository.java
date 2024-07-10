package com.taishow.dao;


import com.taishow.entity.Theaters;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatLayoutRepository extends CrudRepository<Theaters, Integer> {

    @Query(value = "SELECT DISTINCT t.theaterName, s.screenName, se.rowNum, se.seatNum, se.isAisle, se.id as seatId " +
            "FROM Theaters t " +
            "JOIN Screen s ON t.id = s.theaterId " +
            "JOIN Seat se ON s.id = se.screenId " +
            "LEFT JOIN SeatStatus ss ON se.id = ss.seatId " +
            "WHERE t.theaterName = :theaterName " +
            "AND s.screenName = :screenName")
    List<Object[]> findSeatLayout(@Param("theaterName") String theaterName,
                                  @Param("screenName") String screenName);
}
