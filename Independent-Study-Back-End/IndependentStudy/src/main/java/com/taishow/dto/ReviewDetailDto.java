package com.taishow.dto;

import java.util.List;

public class ReviewDetailDto {

    private String title;
    private String poster;
    private Boolean isPlaying;
    private Double scoreAvg;
    private Double fiveStarRate;
    private Double fourStarRate;
    private Double threeStarRate;
    private Double twoStarRate;
    private Double oneStarRate;
    private Integer totalCommentsNum;
    private CommentsDto ownComment;
    private List<CommentsDto> comments;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public Boolean getIsPlaying() {
        return isPlaying;
    }

    public void setIsPlaying(Boolean playing) {
        isPlaying = playing;
    }

    public Double getScoreAvg() {
        return scoreAvg;
    }

    public void setScoreAvg(Double scoreAvg) {
        this.scoreAvg = scoreAvg;
    }

    public Double getFiveStarRate() {
        return fiveStarRate;
    }

    public void setFiveStarRate(Double fiveStarRate) {
        this.fiveStarRate = fiveStarRate;
    }

    public Double getFourStarRate() {
        return fourStarRate;
    }

    public void setFourStarRate(Double fourStarRate) {
        this.fourStarRate = fourStarRate;
    }

    public Double getThreeStarRate() {
        return threeStarRate;
    }

    public void setThreeStarRate(Double threeStarRate) {
        this.threeStarRate = threeStarRate;
    }

    public Double getTwoStarRate() {
        return twoStarRate;
    }

    public void setTwoStarRate(Double twoStarRate) {
        this.twoStarRate = twoStarRate;
    }

    public Double getOneStarRate() {
        return oneStarRate;
    }

    public void setOneStarRate(Double oneStarRate) {
        this.oneStarRate = oneStarRate;
    }

    public Integer getTotalCommentsNum() {
        return totalCommentsNum;
    }

    public void setTotalCommentsNum(Integer totalCommentsNum) {
        this.totalCommentsNum = totalCommentsNum;
    }

    public CommentsDto getOwnComment() {
        return ownComment;
    }

    public void setOwnComment(CommentsDto ownComment) {
        this.ownComment = ownComment;
    }

    public List<CommentsDto> getComments() {
        return comments;
    }

    public void setComments(List<CommentsDto> comments) {
        this.comments = comments;
    }
}
