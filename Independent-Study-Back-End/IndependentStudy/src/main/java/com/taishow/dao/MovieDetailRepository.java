package com.taishow.dao;

import com.taishow.entity.Movie;
import com.taishow.entity.Actor;
import com.taishow.entity.Review;
import com.taishow.entity.Stills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieDetailRepository extends JpaRepository<Movie, Integer> {

    @Query("SELECT a FROM Actor a WHERE a.id IN (SELECT ma.actorId FROM MovieActor ma WHERE ma.movieId = ?1)")
    List<Actor> findActorsByMovieId(Integer movieId);

    @Query("SELECT r FROM Review r WHERE r.movieId = ?1")
    List<Review> findReviewsByMovieId(Integer movieId);

    @Query("SELECT s FROM Stills s WHERE s.movieId = ?1")
    List<Stills> findStillsByMovieId(Integer movieId);


}