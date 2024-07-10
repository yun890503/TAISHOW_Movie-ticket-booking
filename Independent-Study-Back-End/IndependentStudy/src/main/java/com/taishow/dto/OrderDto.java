package com.taishow.dto;

import java.util.List;

public class OrderDto {

    private Integer theaterId;
    private Integer showTimeId;
    private List<Integer> seatStatusId;
    private List<Integer> ticketTypeId;

    public Integer getShowTimeId() {
        return showTimeId;
    }

    public void setShowTimeId(Integer showTimeId) {
        this.showTimeId = showTimeId;
    }

    public Integer getTheaterId() {
        return theaterId;
    }

    public void setTheaterId(Integer theaterId) {
        this.theaterId = theaterId;
    }

    public List<Integer> getSeatStatusId() {
        return seatStatusId;
    }

    public void setSeatStatusId(List<Integer> seatStatusId) {
        this.seatStatusId = seatStatusId;
    }

    public List<Integer> getTicketTypeId() {
        return ticketTypeId;
    }

    public void setTicketTypeId(List<Integer> ticketTypeId) {
        this.ticketTypeId = ticketTypeId;
    }
}
