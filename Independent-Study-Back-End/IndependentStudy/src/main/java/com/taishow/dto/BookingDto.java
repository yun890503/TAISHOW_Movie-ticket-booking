package com.taishow.dto;

import java.util.List;

public class BookingDto {

    private Integer theaterId;
    private String theaterName;
    private String address;
    private List<ShowsDto> showList;

    public Integer getTheaterId() {
        return theaterId;
    }

    public void setTheaterId(Integer theaterId) {
        this.theaterId = theaterId;
    }

    public String getTheaterName() {
        return theaterName;
    }

    public void setTheaterName(String theaterName) {
        this.theaterName = theaterName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<ShowsDto> getshowList() {
        return showList;
    }

    public void setshowList(List<ShowsDto> showList) {
        this.showList = showList;
    }
}
