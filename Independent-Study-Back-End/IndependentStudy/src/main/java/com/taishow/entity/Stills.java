package com.taishow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stills")
public class Stills {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "stills", columnDefinition = "longtext")
    private String stills;

    @Column(name = "movie_id")
    private int movieId;

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getStills() {
        return stills;
    }

    public void setStills(String stills) {
        this.stills = stills;
    }

    public int getMovieId() {
        return movieId;
    }

    public void setMovieId(int movieId) {
        this.movieId = movieId;
    }
}