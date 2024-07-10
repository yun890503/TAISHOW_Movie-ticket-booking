package com.taishow.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title", nullable = false, length = 50)
    private String title;

    @Column(name = "title_english", nullable = false, length = 50)
    private String titleEnglish;

    @Column(name = "rating", nullable = false, length = 20)
    private String rating;

    @Column(name = "runtime", nullable = false)
    private Integer runtime;

    @Column(name = "genre", nullable = false, length = 100)
    private String genre;

    @Column(name = "release_date", nullable = false)
    private Date releaseDate;

    @Column(name = "director", nullable = false, length = 50)
    private String director;

    @Column(name = "synopsis", columnDefinition = "TEXT")
    private String synopsis;

    @Column(name = "language", nullable = false, length = 50)
    private String language;

    @Column(name = "trailer", nullable = false, length = 255)
    private String trailer;

    @Column(name = "poster", columnDefinition = "LONGTEXT")
    private String poster;

    @Column(name = "is_playing", nullable = false)
    private boolean isPlaying;

    @Column(name = "is_homepage_trailer", nullable = false)
    private boolean isHomepageTrailer;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitleEnglish() {
        return titleEnglish;
    }

    public void setTitleEnglish(String titleEnglish) {
        this.titleEnglish = titleEnglish;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public Integer getRuntime() {
        return runtime;
    }

    public void setRuntime(Integer runtime) {
        this.runtime = runtime;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Date getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(Date releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTrailer() {
        return trailer;
    }

    public void setTrailer(String trailer) {
        this.trailer = trailer;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public boolean isPlaying() {
        return isPlaying;
    }

    public void setPlaying(boolean playing) {
        isPlaying = playing;
    }

    public boolean isHomepageTrailer() {
        return isHomepageTrailer;
    }

    public void setHomepageTrailer(boolean homepageTrailer) {
        isHomepageTrailer = homepageTrailer;
    }
}
