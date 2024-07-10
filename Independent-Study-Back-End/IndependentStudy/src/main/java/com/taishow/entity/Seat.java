package com.taishow.entity;

import jakarta.persistence.*;

@Entity
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "screen_id")
    private Integer screenId;

    @Column(name = "row_num")
    private Integer rowNum;

    @Column(name = "seat_num")
    private Integer seatNum;

    @Column(name = "seat_note")
    private String seatNote;

    @Column(name = "is_aisle")
    private boolean isAisle;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getScreenId() {
        return screenId;
    }

    public void setScreenId(Integer screenId) {
        this.screenId = screenId;
    }

    public Integer getRowNum() {
        return rowNum;
    }

    public void setRowNum(Integer rowNum) {
        this.rowNum = rowNum;
    }

    public Integer getSeatNum() {
        return seatNum;
    }

    public void setSeatNum(Integer seatNum) {
        this.seatNum = seatNum;
    }

    public String getSeatNote() {
        return seatNote;
    }

    public void setSeatNote(String seatNote) {
        this.seatNote = seatNote;
    }

    public boolean isAisle() {
        return isAisle;
    }

    public void setAisle(boolean aisle) {
        isAisle = aisle;
    }
}
