package com.taishow.dto;


import java.time.LocalDateTime;

public class SeatStatusDto {
    private String theater_name;
    private String screen_name;
    private String seat_status;
    private LocalDateTime showtime;
    private Integer row_num;
    private Integer seat_number;
    private Integer seat_id;
    private Integer showtime_id;
    private String title;
    private String poster;

    public SeatStatusDto() {}

    public SeatStatusDto(String theater_name, String screen_name, String seat_status, LocalDateTime showtime, Integer row_num, Integer seat_number, Integer seat_id, Integer showtime_id, String title, String poster){
        this.theater_name = theater_name;
        this.screen_name = screen_name;
        this.seat_status = seat_status;
        this.showtime = showtime;
        this.row_num = row_num;
        this.seat_number = seat_number;
        this.seat_id = seat_id;
        this.showtime_id = showtime_id;
        this.title = title;
        this.poster = poster;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getSeat_id() {
        return seat_id;
    }

    public void setSeat_id(Integer seat_id) {
        this.seat_id = seat_id;
    }

    public Integer getShowtime_id() {
        return showtime_id;
    }

    public void setShowtime_id(Integer showtime_id) {
        this.showtime_id = showtime_id;
    }

    public Integer getRow_num() {
        return row_num;
    }

    public void setRow_num(Integer row_num) {
        this.row_num = row_num;
    }

    public String getScreen_name() {
        return screen_name;
    }

    public void setScreen_name(String screen_name) {
        this.screen_name = screen_name;
    }

    public Integer getSeat_number() {
        return seat_number;
    }

    public void setSeat_number(Integer seat_number) {
        this.seat_number = seat_number;
    }

    public String getSeat_status() {
        return seat_status;
    }

    public void setSeat_status(String seat_status) {
        this.seat_status = seat_status;
    }

    public LocalDateTime getShowtime() {
        return showtime;
    }

    public void setShowtime(LocalDateTime showtime) {
        this.showtime = showtime;
    }

    public String getTheater_name() {
        return theater_name;
    }

    public void setTheater_name(String theater_name) {
        this.theater_name = theater_name;
    }
}
