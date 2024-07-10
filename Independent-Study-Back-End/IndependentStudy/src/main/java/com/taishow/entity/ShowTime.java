package com.taishow.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "showtime", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"screen_id", "showtime"})
})
public class ShowTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "screen_id")
    private Integer screenId;

    @Column(name = "movie_id")
    private Integer movieId;

    @Column(name = "showtime")
    private Date showTime;

    public ShowTime() {
    }

    public ShowTime(Integer id, Integer screenId, Integer movieId, Date showTime) {
        this.id = id;
        this.screenId = screenId;
        this.movieId = movieId;
        this.showTime = showTime;
    }

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

    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public Date getShowTime() {
        return showTime;
    }

    public void setShowTime(Date showTime) {
        this.showTime = showTime;
    }
}