package com.taishow.dao;

import com.taishow.dto.CommentsDto;
import com.taishow.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    public Review findByUserIdAndMovieId(Integer userId, Integer movieId);
    public void deleteByUserIdAndMovieId(Integer userId, Integer movieId);
    public List<Review> findByMovieId(Integer movieId);

    @Query("SELECT " +
            "COUNT(r) AS totalReviews, " +
            "AVG(r.score) AS averageScore, " +
            "SUM(CASE WHEN r.score = 1 THEN 1 ELSE 0 END) AS score1Count, " +
            "SUM(CASE WHEN r.score = 2 THEN 1 ELSE 0 END) AS score2Count, " +
            "SUM(CASE WHEN r.score = 3 THEN 1 ELSE 0 END) AS score3Count, " +
            "SUM(CASE WHEN r.score = 4 THEN 1 ELSE 0 END) AS score4Count, " +
            "SUM(CASE WHEN r.score = 5 THEN 1 ELSE 0 END) AS score5Count, " +
            "SUM(CASE WHEN r.score = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(r) AS score1Percent, " +
            "SUM(CASE WHEN r.score = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(r) AS score2Percent, " +
            "SUM(CASE WHEN r.score = 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(r) AS score3Percent, " +
            "SUM(CASE WHEN r.score = 4 THEN 1 ELSE 0 END) * 100.0 / COUNT(r) AS score4Percent, " +
            "SUM(CASE WHEN r.score = 5 THEN 1 ELSE 0 END) * 100.0 / COUNT(r) AS score5Percent " +
            "FROM Review r " +
            "WHERE r.movieId = :movieId AND r.score BETWEEN 1 AND 5")
    public List<Object[]> findScoreDetailByMovieId(Integer movieId);

    @Query("SELECT r.id, u.nickName, u.photo, r.reviewDate, r.score, r.comment, " +
            "(SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.likeit = true), " +
            "(SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.dislike = true), " +
            "(CASE WHEN (SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.userId = :userId AND i.likeit = true) > 0 THEN true ELSE false END), " +
            "(CASE WHEN (SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.userId = :userId AND i.dislike = true) > 0 THEN true ELSE false END), " +
            "(CASE WHEN (SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.userId = :userId AND i.report = true) > 0 THEN true ELSE false END) " +
            "FROM Review r " +
            "LEFT JOIN User u ON r.userId = u.id " +
            "WHERE r.movieId = :movieId AND r.userId <> :userId " +
            "ORDER BY (SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.likeit = true) DESC")
    public List<Object[]> findCommentDetailByMovieIdAndUserIdExcludingSelf(Integer movieId, Integer userId);

    @Query("SELECT r.id, u.nickName, u.photo, r.reviewDate, r.score, r.comment, " +
            "(SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.likeit = true), " +
            "(SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.dislike = true), " +
            "(CASE WHEN (SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.userId = :userId AND i.likeit = true) > 0 THEN true ELSE false END), " +
            "(CASE WHEN (SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.userId = :userId AND i.dislike = true) > 0 THEN true ELSE false END), " +
            "(CASE WHEN (SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.userId = :userId AND i.report = true) > 0 THEN true ELSE false END) " +
            "FROM Review r " +
            "LEFT JOIN User u ON r.userId = u.id " +
            "WHERE r.movieId = :movieId AND r.userId = :userId")
    public List<Object[]> findOwnCommentDetailByMovieIdAndUserId(Integer movieId, Integer userId);

    @Query("SELECT r.id, u.nickName, u.photo, r.reviewDate, r.score, r.comment, " +
            "(SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.likeit = true), " +
            "(SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.dislike = true), " +
            "(SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END " +
            " FROM Interactive i WHERE i.reviewId = r.id AND i.userId = :userId AND i.likeit = true), " +
            "(SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END " +
            " FROM Interactive i WHERE i.reviewId = r.id AND i.userId = :userId AND i.dislike = true), " +
            "(SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END " +
            " FROM Interactive i WHERE i.reviewId = r.id AND i.userId = :userId AND i.report = true) " +
            "FROM Review r " +
            "LEFT JOIN User u ON r.userId = u.id " +
            "WHERE r.id = :reviewId")
    public List<Object[]> findCommentDetailByReviewIdAndUserId(Integer reviewId, Integer userId);

    @Query("SELECT r.id, u.account, u.email, u.nickName, r.score, r.comment, r.reviewDate, " +
            "(CASE WHEN (SELECT COUNT(i) FROM Interactive i WHERE i.reviewId = r.id AND i.report = true) > 0 THEN true ELSE false END) " +
            "FROM Review r " +
            "LEFT JOIN User u ON r.userId = u.id " +
            "WHERE r.movieId = :movieId " +
            "ORDER BY r.id DESC")
    public List<Object[]> findCommentDetailByMovieId(Integer movieId);
}
