package com.taishow.entity;

import jakarta.persistence.*;

@Entity
public class Interactive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "review_id")
    private Integer reviewId;

    @Column(name = "user_id")
    private Integer userId;

    private boolean likeit;
    private boolean dislike;
    private boolean report;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getReviewId() {
        return reviewId;
    }

    public void setReviewId(Integer reviewId) {
        this.reviewId = reviewId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public boolean isLikeit() {
        return likeit;
    }

    public void setLikeit(boolean likeit) {
        this.likeit = likeit;
    }

    public boolean isDislike() {
        return dislike;
    }

    public void setDislike(boolean dislike) {
        this.dislike = dislike;
    }

    public boolean isReport() {
        return report;
    }

    public void setReport(boolean report) {
        this.report = report;
    }
}
