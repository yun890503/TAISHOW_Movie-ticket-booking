package com.taishow.dao;

import com.taishow.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteDao extends JpaRepository<Movie, Integer> {

    @Query("SELECT r ,m, AVG(r.score) as avgScore FROM Review r " +
            "JOIN Movie m ON r.movieId = m.id " +
            "WHERE r.userId = :userId " +
            "GROUP BY m.id")
    List<Object[]> findReviewsAndMoviesByUserId(int userId);
}
