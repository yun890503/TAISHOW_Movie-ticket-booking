package com.taishow.dao;

import com.taishow.entity.Interactive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InteractiveRepository extends JpaRepository<Interactive, Integer> {
    public Interactive findByReviewIdAndUserId(Integer reviewId, Integer userId);
}
