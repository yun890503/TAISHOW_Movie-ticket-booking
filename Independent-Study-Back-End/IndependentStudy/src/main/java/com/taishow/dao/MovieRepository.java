package com.taishow.dao;

import com.taishow.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer> {
    List<Movie> findByIsPlaying(boolean isPlaying);
    List<Movie> findByIsHomepageTrailer(boolean isHomepageTrailer);
    List<Movie> findByTitleContainingIgnoreCase(String title);
}
