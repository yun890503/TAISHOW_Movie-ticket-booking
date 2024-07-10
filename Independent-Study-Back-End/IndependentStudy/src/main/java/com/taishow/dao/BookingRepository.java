package com.taishow.dao;

import com.taishow.entity.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<ShowTime, Integer> {

    @Query("SELECT t.id, t.theaterName, t.address, st.id, st.showTime, s.id, s.screenName, s.screenClass " +
            "FROM Theaters t JOIN Screen s ON t.id = s.theaterId " +
            "JOIN ShowTime st ON s.id = st.screenId " +
            "WHERE st.movieId = :movieId AND st.showTime BETWEEN CURRENT_DATE AND :endDate")
    List<Object[]> getWeekShowById(@Param("movieId") Integer movieId, @Param("endDate") Date endDate);
}
