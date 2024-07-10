package com.taishow.service.client;

import com.taishow.dao.MovieDetailRepository;
import com.taishow.dao.UserRepository;
import com.taishow.entity.Actor;
import com.taishow.entity.Movie;
import com.taishow.entity.Review;
import com.taishow.entity.Stills;
import com.taishow.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MovieDetailService {

    @Autowired
    private MovieDetailRepository movieDetailRepository;

    @Autowired
    private UserRepository userRepository;

    public Movie findById(Integer id) {
        return movieDetailRepository.findById(id).orElse(null);
    }

    public List<Actor> findActorsByMovieId(Integer movieId) {
        return movieDetailRepository.findActorsByMovieId(movieId);
    }

    public List<Review> findReviewsByMovieId(Integer movieId) {
        return movieDetailRepository.findReviewsByMovieId(movieId);
    }

    public List<Map<String, Object>> findReviewsWithNickNamesByMovieId(Integer movieId) {
        List<Review> reviews = movieDetailRepository.findReviewsByMovieId(movieId);
        List<Map<String, Object>> reviewsWithNickNames = new ArrayList<>();
        for (Review review : reviews) {
            User user = userRepository.findById(review.getUserId()).orElse(null);
            if (user != null) {
                Map<String, Object> reviewMap = new HashMap<>();
                reviewMap.put("id", review.getId());
                reviewMap.put("comment", review.getComment());
                reviewMap.put("movieId", review.getMovieId());
                reviewMap.put("userId", review.getUserId());
                reviewMap.put("nickName", user.getNickName());
                reviewMap.put("photo", user.getPhoto());
                reviewMap.put("reviewDate", review.getReviewDate());
                reviewMap.put("score", review.getScore());
                reviewsWithNickNames.add(reviewMap);
            }
        }
        return reviewsWithNickNames;
    }

    public List<Stills> findStillsByMovieId(Integer movieId) {
        return movieDetailRepository.findStillsByMovieId(movieId);
    }
}