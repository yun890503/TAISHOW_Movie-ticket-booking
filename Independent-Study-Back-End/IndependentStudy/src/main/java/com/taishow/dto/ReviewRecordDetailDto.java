package com.taishow.dto;

import java.util.List;

public class ReviewRecordDetailDto {

    private String title;
    private List<ReviewRecordDto> reviewRecordList;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<ReviewRecordDto> getReviewRecordList() {
        return reviewRecordList;
    }

    public void setReviewRecordList(List<ReviewRecordDto> reviewRecordList) {
        this.reviewRecordList = reviewRecordList;
    }
}
