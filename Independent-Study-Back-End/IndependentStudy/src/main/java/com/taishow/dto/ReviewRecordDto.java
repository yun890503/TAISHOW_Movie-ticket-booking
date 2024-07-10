package com.taishow.dto;

public class ReviewRecordDto {

    private Integer id;
    private String account;
    private String email;
    private String nickName;
    private Integer score;
    private String comment;
    private String reviewDate;
    private Boolean isReport;

    public ReviewRecordDto(Integer id, String account, String email, String nickName, Integer score,
                           String comment, String reviewDate, Boolean isReport) {
        this.id = id;
        this.account = account;
        this.email = email;
        this.nickName = nickName;
        this.score = score;
        this.comment = comment;
        this.reviewDate = reviewDate;
        this.isReport = isReport;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
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

    public String getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(String reviewDate) {
        this.reviewDate = reviewDate;
    }

    public Boolean getIsReport() {
        return isReport;
    }

    public void setIsReport(Boolean report) {
        isReport = report;
    }
}
