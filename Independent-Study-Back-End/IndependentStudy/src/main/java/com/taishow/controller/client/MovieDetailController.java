package com.taishow.controller.client;

import com.taishow.entity.Actor;
import com.taishow.entity.Movie;
import com.taishow.entity.Stills;
import com.taishow.service.client.MovieDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
public class MovieDetailController {

    @Autowired
    private MovieDetailService movieDetailService;

    @GetMapping("/details/{id}")
    public ResponseEntity<Map<String, Object>> getMovieDetails(@PathVariable Integer id) {
        Movie movie = movieDetailService.findById(id);
        if (movie == null) {
            return ResponseEntity.notFound().build();
        }

        List<Actor> actors = movieDetailService.findActorsByMovieId(id);
        List<Stills> stills = movieDetailService.findStillsByMovieId(id);
        List<Map<String, Object>> reviews = movieDetailService.findReviewsWithNickNamesByMovieId(id);

        Map<String, Object> response = new HashMap<>();
        response.put("id", movie.getId());
        response.put("title", movie.getTitle());
        response.put("title_english", movie.getTitleEnglish());
        response.put("rating", movie.getRating());
        response.put("runtime", movie.getRuntime());
        response.put("genre", movie.getGenre());
        response.put("release_date", movie.getReleaseDate());
        response.put("director", movie.getDirector());
        response.put("synopsis", movie.getSynopsis());
        response.put("language", movie.getLanguage());
        response.put("trailer", movie.getTrailer());
        response.put("poster", movie.getPoster());
        response.put("is_playing", movie.isPlaying());
        response.put("is_homepage_trailer", movie.isHomepageTrailer());
        response.put("actors", actors);
        response.put("stills", stills);
        response.put("reviews", reviews);

        return ResponseEntity.ok(response);
    }
}