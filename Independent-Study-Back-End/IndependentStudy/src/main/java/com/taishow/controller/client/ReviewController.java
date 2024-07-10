package com.taishow.controller.client;

import com.taishow.entity.Review;
import com.taishow.service.client.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/member/reviews")
    public List<Map<String, Object>> getReviews(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return reviewService.getReviewsAndMoviesByToken(token);
    }
    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviewList = reviewService.getAllReviews();
        if (!reviewList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(reviewList);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }

    @GetMapping("/reviews/{movieId}")
    public ResponseEntity<List<Review>> getReviewsByMovieId(@PathVariable Integer movieId) {
        List<Review> reviews = reviewService.getReviewsByMovieId(movieId);
        if (!reviews.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(reviews);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }
}