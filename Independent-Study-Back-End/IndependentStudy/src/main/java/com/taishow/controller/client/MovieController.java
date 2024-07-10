package com.taishow.controller.client;

import com.taishow.entity.Movie;
import com.taishow.service.client.MovieService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class MovieController {

    private final MovieService movieService;


    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // 創建電影
    @PostMapping
    public ResponseEntity<Movie> createMovie(@RequestBody Movie movie) {
        Movie createdMovie = movieService.createOrUpdateMovie(movie);
        if (createdMovie != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMovie);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 獲取所有電影
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        List<Movie> movieList = movieService.getAllMovies();
        if (!movieList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(movieList);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }



    // 更新電影
    @PutMapping("/{movieId}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Integer movieId, @RequestBody Movie movieDetails) {
        Movie updatedMovie = movieService.updateMovie(movieId, movieDetails);
        if (updatedMovie != null) {
            return ResponseEntity.status(HttpStatus.OK).body(updatedMovie);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // 删除電影
    @DeleteMapping("/{movieId}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Integer movieId) {
        boolean isDeleted = movieService.deleteMovie(movieId);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/movie")
    public ResponseEntity<List<Movie>> getAllMovies(@RequestParam(defaultValue = "true") boolean isPlaying) {
        List<Movie> movieList = movieService.getAllMovies(isPlaying);
        if (!movieList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(movieList);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }
    @GetMapping("/movies/ended")
    public ResponseEntity<List<Movie>> getEndedMovies() {
        List<Movie> endedMovies = movieService.getEndedMovies();
        if (!endedMovies.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(endedMovies);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }

    @GetMapping("/api/movies/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Integer id) {
        Optional<Movie> movie = movieService.getMovieById(id);
        return movie.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
    @GetMapping("/homepageTrailers")
    public ResponseEntity<List<Movie>> getHomepageTrailers() {
        List<Movie> trailers = movieService.getHomepageTrailers();
        if (!trailers.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(trailers);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }
    @GetMapping("/movies/search")
    public ResponseEntity<List<Movie>> searchMovies(@RequestParam String query) {
        List<Movie> movies = movieService.searchMovies(query);
        if (!movies.isEmpty()) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            return new ResponseEntity<>(movies, headers, HttpStatus.OK);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }
}
