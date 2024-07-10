package com.taishow.service.cms;

import com.taishow.dao.InteractiveRepository;
import com.taishow.dao.MovieRepository;
import com.taishow.dao.ReviewRepository;
import com.taishow.dao.UserRepository;
import com.taishow.dto.ReviewRecordDetailDto;
import com.taishow.dto.ReviewRecordDto;
import com.taishow.entity.Movie;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ReviewRecordService {

    private final MovieRepository movieRepository;
    private final ReviewRepository reviewRepository;
    private final InteractiveRepository interactiveRepository;
    private final UserRepository userRepository;

    public ReviewRecordService(MovieRepository movieRepository, ReviewRepository reviewRepository,
                               InteractiveRepository interactiveRepository, UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.reviewRepository = reviewRepository;
        this.interactiveRepository = interactiveRepository;
        this.userRepository = userRepository;
    }

    public List<Movie> getAllReviewRecord(){
        return movieRepository.findAll();
    }

    public ReviewRecordDetailDto getReviewDetail(Integer movieId){
        // 取得電影名稱
        String title = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("電影不存在"))
                .getTitle();

        // 取得評論資訊
        List<Object[]> results = reviewRepository.findCommentDetailByMovieId(movieId);
        List<ReviewRecordDto> reviewList = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (Object[] result : results){
            Integer reviewId = (Integer) result[0];
            String account = (String) result[1];
            String email = (String) result[2];
            String nickName = (String) result[3];
            Integer score = (Integer) result[4];
            String comment = (String) result[5];
            String reviewDate = ((LocalDateTime) result[6]).format(formatter);
            Boolean isReport = (Boolean) result[7];

            ReviewRecordDto reviewRecordDto = new ReviewRecordDto(reviewId, account, email, nickName, score, comment, reviewDate, isReport);
            reviewList.add(reviewRecordDto);
        }

        // 回傳資訊
        ReviewRecordDetailDto reviewRecordDetailDto = new ReviewRecordDetailDto();
        reviewRecordDetailDto.setTitle(title);
        reviewRecordDetailDto.setReviewRecordList(reviewList);

        return reviewRecordDetailDto;
    }

    public void deleteReview(Integer reviewId){
        reviewRepository.deleteById(reviewId);
    }
}
