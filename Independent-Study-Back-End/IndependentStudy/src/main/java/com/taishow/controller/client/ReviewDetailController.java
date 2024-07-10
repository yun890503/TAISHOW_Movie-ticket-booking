package com.taishow.controller.client;

import com.taishow.dto.CommentsDto;
import com.taishow.dto.InteractionRequest;
import com.taishow.dto.ReviewDetailDto;
import com.taishow.entity.Review;
import com.taishow.service.client.ReviewDetailService;
import com.taishow.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ReviewDetailController {

    private final ReviewDetailService reviewDetailService;
    private final JwtUtil jwtUtil;

    public ReviewDetailController(ReviewDetailService reviewDetailService, JwtUtil jwtUtil) {
        this.reviewDetailService = reviewDetailService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/reviews/{movieId}")
    public ResponseEntity<?> getReviews(@RequestHeader(value = "Authorization", required = false) String token,
                                                      @PathVariable Integer movieId){
        try {
            Integer userId = null;
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                userId = jwtUtil.getUserIdFromToken(token);
            } else {
                // 寫0代表未登入
                userId = 0;
            }

            ReviewDetailDto reviewDetailDto = reviewDetailService.getReviews(userId, movieId);
            return ResponseEntity.status(HttpStatus.OK).body(reviewDetailDto);
        } catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("載入評論失敗: " + e.getMessage());
        }
    }

    @PostMapping("/reviews/{movieId}")
    public ResponseEntity<?> createReview(@RequestHeader("Authorization") String token,
                                               @RequestBody Review review,
                                               @PathVariable Integer movieId){
        try {
            Integer userId = null;
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                userId = jwtUtil.getUserIdFromToken(token);
            } else {
                throw new IllegalArgumentException("Invalid Authorization header");
            }

            reviewDetailService.createReview(userId, review, movieId);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("發布評論失敗: " + e.getMessage());
        }
    }

    @PutMapping("/reviews/{movieId}")
    public ResponseEntity<?> updateReview(@RequestHeader("Authorization") String token,
                                          @RequestBody Review review,
                                          @PathVariable Integer movieId){
        try {
            Integer userId = null;
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                userId = jwtUtil.getUserIdFromToken(token);
            } else {
                throw new IllegalArgumentException("Invalid Authorization header");
            }

            reviewDetailService.updateReview(userId, review, movieId);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("更新評論失敗: " + e.getMessage());
        }
    }

    @DeleteMapping("/reviews/{movieId}")
    public ResponseEntity<?> deleteReview(@RequestHeader("Authorization") String token,
                                          @PathVariable Integer movieId){
        try {
            Integer userId = null;
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                userId = jwtUtil.getUserIdFromToken(token);
            } else {
                throw new IllegalArgumentException("Invalid Authorization header");
            }

            reviewDetailService.deleteReview(userId, movieId);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("刪除評論失敗: " + e.getMessage());
        }
    }

    @PostMapping("/reviews/{reviewId}/interaction")
    public ResponseEntity<?> interactionReview(@RequestHeader("Authorization") String token,
                                               @RequestBody InteractionRequest interactionRequest,
                                               @PathVariable Integer reviewId){
        try {
            Integer userId = null;
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                userId = jwtUtil.getUserIdFromToken(token);
            } else {
                throw new IllegalArgumentException("Invalid Authorization header");
            }

            String action = interactionRequest.getAction();
            CommentsDto commentsDto = reviewDetailService.interactionReview(userId, action, reviewId);
            return ResponseEntity.status(HttpStatus.OK).body(commentsDto);
        } catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("無效的操作: " + e.getMessage());
        }
    }
}
