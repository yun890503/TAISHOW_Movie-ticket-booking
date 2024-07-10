package com.taishow.dao;

import com.taishow.entity.Movie;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface MovieDao extends JpaRepository<Movie, Integer>{

    @Query("SELECT m FROM Movie m WHERE m.releaseDate > :today")
    List<Movie> findMovieByReleaseDateAfter(@Param("today")Date today);

    @Query("SELECT m FROM Movie m WHERE m.releaseDate <= :today AND m.isPlaying = true")
    List<Movie> findMovieByReleaseDateBeforeOrEqualAndIsPlayingTrue(@Param("today") Date today);

    @Modifying
    @Transactional
    @Query("UPDATE Movie m SET m.isPlaying = false WHERE m.id = ?1")
    int updateMovieIsPlayingById(Integer id);
}
