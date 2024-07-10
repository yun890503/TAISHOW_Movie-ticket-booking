package com.taishow.entity;

import jakarta.persistence.*;
@Entity
@Table(name = "movie_actor")
public class MovieActor {

    @Id
    @Column(name = "movie_id")
    private int movieId;

    @Id
    @Column(name = "actor_id")
    private int actorId;

    @Column(name = "id")
    private int id;

    // Getters and Setters

    public int getMovieId() {
        return movieId;
    }

    public void setMovieId(int movieId) {
        this.movieId = movieId;
    }

    public int getActorId() {
        return actorId;
    }

    public void setActorId(int actorId) {
        this.actorId = actorId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}