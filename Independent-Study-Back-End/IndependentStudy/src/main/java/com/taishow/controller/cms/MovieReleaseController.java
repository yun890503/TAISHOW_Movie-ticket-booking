package com.taishow.controller.cms;

import com.taishow.dto.Result;
import com.taishow.entity.Movie;
import com.taishow.service.cms.MovieReleaseService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/movie")
public class MovieReleaseController {
    private MovieReleaseService movieService;

    public MovieReleaseController(MovieReleaseService movieService) {
        this.movieService = movieService;
    }

    // 當前端發送FormData時，後端需要有與之對應的參數@RequestParam
    // CORS藉由一堆的response header => 告訴瀏覽器有哪些東西前端具有存取權
    // no-cors => 後端增加 header: Access-Control-Allow-Origin: *
    @PostMapping("/createMovie")
    public Result createMovie(@RequestParam String title,
                              @RequestParam String titleEnglish,
                              @RequestParam String rating,
                              @RequestParam Integer runtime,
                              @RequestParam String genre,
                              @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date releaseDate,
                              @RequestParam String director,
                              @RequestParam String synopsis,
                              @RequestParam String language,
                              @RequestParam String trailer,
                              @RequestParam String poster,
                              @RequestParam Boolean isPlaying) {
        Movie movies = new Movie();
        movies.setTitle(title);
        movies.setTitleEnglish(titleEnglish);
        movies.setRating(rating);
        movies.setRuntime(runtime);
        movies.setGenre(genre);
        movies.setReleaseDate(releaseDate);
        movies.setDirector(director);
        movies.setSynopsis(synopsis);
        movies.setLanguage(language);
        movies.setTrailer(trailer);
        movies.setPoster(poster);
        movies.setPlaying(isPlaying);
        return movieService.createMovie( movies);
    }

    @PutMapping("/updateMovie")
    public Result updateMovie(@RequestBody Movie movie) {
        return movieService.updateMovie(movie);
    }

    @DeleteMapping("/deleteMovie")
    public Result deleteMovie(@PathVariable Integer id) {
        return movieService.deleteMovie(id);
    }

    @GetMapping("/getMovie/{id}")
    public Result getMovie(@PathVariable Integer id) {
        return movieService.getMovie(id);
    }

    @GetMapping("/getMovie/isComing")
    public Result getMoviesIsComing() {
        return movieService.getMoviesIsComing();
    }

    @GetMapping("/getMovie/isPlaying")
    public Result getMoviesByIsPlaying() {
        return movieService.getMoviesIsPLaying();
    }

    // @PathVariable 記得要標註，否則找不到目標物
    @PutMapping("/updateMovie/{id}")
    public Result updateMovieById(@PathVariable Integer id) {
        return movieService.updateMovieIsPlayingById(id);
    }
}
