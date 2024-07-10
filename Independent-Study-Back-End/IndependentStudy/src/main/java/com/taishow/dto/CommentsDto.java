package com.taishow.dto;

public class CommentsDto {

    private Integer reviewId;
    private String nickName;
    private String photo;
    private String reviewDate;
    private Integer score;
    private String comment;
    private Integer likeIt;
    private Integer dislike;
    private Boolean isLikeIt;
    private Boolean isDislike;
    private Boolean isReport;

    public CommentsDto(Integer reviewId, String nickName, String photo, String reviewDate, Integer score, String comment,
                       Integer likeIt, Integer dislike, Boolean isLikeIt, Boolean isDislike, Boolean isReport) {
        this.reviewId = reviewId;
        this.nickName = nickName;
        this.photo = photo;
        this.reviewDate = reviewDate;
        this.score = score;
        this.comment = comment;
        this.likeIt = likeIt;
        this.dislike = dislike;
        this.isLikeIt = isLikeIt;
        this.isDislike = isDislike;
        this.isReport = isReport;
    }

    public Integer getReviewId() {
        return reviewId;
    }

    public void setReviewId(Integer reviewId) {
        this.reviewId = reviewId;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(String reviewDate) {
        this.reviewDate = reviewDate;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getLikeIt() {
        return likeIt;
    }

    public void setLikeIt(Integer likeIt) {
        this.likeIt = likeIt;
    }

    public Integer getDislike() {
        return dislike;
    }

    public void setDislike(Integer dislike) {
        this.dislike = dislike;
    }

    public Boolean getIsLikeIt() {
        return isLikeIt;
    }

    public void setIsLikeIt(Boolean likeIt) {
        isLikeIt = likeIt;
    }

    public Boolean getIsDislike() {
        return isDislike;
    }

    public void setIsDislike(Boolean dislike) {
        isDislike = dislike;
    }

    public Boolean getIsReport() {
        return isReport;
    }

    public void setIsReport(Boolean report) {
        isReport = report;
    }
}
