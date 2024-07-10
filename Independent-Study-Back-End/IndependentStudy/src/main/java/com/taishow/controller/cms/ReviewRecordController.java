package com.taishow.controller.cms;

import com.taishow.dto.ReviewRecordDetailDto;
import com.taishow.dto.ReviewRecordDto;
import com.taishow.entity.Movie;
import com.taishow.service.cms.ReviewRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ReviewRecordController {

    private final ReviewRecordService reviewRecordService;

    public ReviewRecordController(ReviewRecordService reviewRecordService) {
        this.reviewRecordService = reviewRecordService;
    }

    @GetMapping("/review-records")
    public ResponseEntity<List<Movie>> getAllReviewRecord(){
        List<Movie> movieList = reviewRecordService.getAllReviewRecord();

        if (!movieList.isEmpty()){
            return ResponseEntity.status(HttpStatus.OK).body(movieList);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }

    @GetMapping("/review-records/{movieId}")
    public ResponseEntity<ReviewRecordDetailDto> getReviewDetail(@PathVariable Integer movieId){
        ReviewRecordDetailDto reviewRecordDetailDto = reviewRecordService.getReviewDetail(movieId);

        if (!reviewRecordDetailDto.getReviewRecordList().isEmpty()){
            return ResponseEntity.status(HttpStatus.OK).body(reviewRecordDetailDto);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }

    @DeleteMapping("/review-records/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer reviewId){
        reviewRecordService.deleteReview(reviewId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
