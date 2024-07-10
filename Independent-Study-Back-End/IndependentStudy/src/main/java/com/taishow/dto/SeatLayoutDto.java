package com.taishow.dto;



public class SeatLayoutDto {
    private String theater_name;
    private String screen_name;
    private Integer row_num;
    private Integer seat_number;
    private Boolean is_aisle;
    private Integer seat_id;


    // Constructors
    public SeatLayoutDto() {}

    public SeatLayoutDto(String theater_name, String screen_name, Integer row_num, Integer seat_number, Boolean is_aisle, Integer seat_id) {
        this.theater_name = theater_name;
        this.screen_name = screen_name;
        this.row_num = row_num;
        this.seat_number = seat_number;
        this.is_aisle = is_aisle;
        this.seat_id = seat_id;

    }

    // Getters and Setters


    public Integer getSeat_id() {
        return seat_id;
    }

    public void setSeat_id(Integer seat_id) {
        this.seat_id = seat_id;
    }



    public String getTheater_name() {
        return theater_name;
    }

    public void setTheater_name(String theater_name) {
        this.theater_name = theater_name;
    }

    public String getScreen_name() {
        return screen_name;
    }

    public void setScreen_name(String screen_name) {
        this.screen_name = screen_name;
    }



    public Integer getRow_num() {
        return row_num;
    }

    public void setRow_num(Integer row_num) {
        this.row_num = row_num;
    }

    public Integer getSeat_number() {
        return seat_number;
    }

    public void setSeat_number(Integer seat_number) {
        this.seat_number = seat_number;
    }

    public Boolean getIs_aisle() {
        return is_aisle;
    }

    public void setIs_aisle(Boolean is_aisle) {
        this.is_aisle = is_aisle;
    }
}
