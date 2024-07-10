package com.taishow.controller.client;

import com.taishow.entity.Movie;
import com.taishow.service.client.MovieService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/movies")
public class TrailerController {

    private final MovieService movieService;

    // 构造函数注入依赖
    public TrailerController(MovieService movieService) {
        this.movieService = movieService;
    }

    // 获取电影的预告片
    @GetMapping("/{movieId}/trailers")
    public ResponseEntity<List<String>> getMovieTrailers(@PathVariable Integer movieId) {
        Optional<Movie> movieOptional = movieService.getMovieById(movieId);
        if (movieOptional.isPresent()) {
            Movie movie = movieOptional.get();
            String trailerField = movie.getTrailer();
            List<String> trailers = Arrays.asList(trailerField.split(","));
            return ResponseEntity.ok(trailers);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}