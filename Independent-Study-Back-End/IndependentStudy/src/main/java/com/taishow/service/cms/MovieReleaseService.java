package com.taishow.service.cms;

import com.taishow.dao.MovieDao;
import com.taishow.dto.Result;
import com.taishow.entity.Movie;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class MovieReleaseService {
    private MovieDao movieDao;

    public MovieReleaseService(MovieDao movieDao) {
        this.movieDao = movieDao;
    }

    public Result createMovie(Movie movie){
        Movie movies = movieDao.save(movie);
        return new Result(200, movie);
    }

    public Result updateMovie(Movie movies){
        Movie movie = movieDao.save(movies);
        return new Result(200, movie);
    }

    public Result deleteMovie(Integer id){
        movieDao.deleteById(id);
        return new Result(200, "success");
    }

    public Result getMovie(Integer id){
        Optional<Movie> moviesOptional = movieDao.findById(id);
        if(moviesOptional.isPresent()){
            return  new Result(200, moviesOptional.get());
        }else{
            return new Result(999, "No data");
        }
    }

    public Result getMoviesIsComing(){
        LocalDate localDate = LocalDate.now();
        Date today = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        List<Movie> movies = movieDao.findMovieByReleaseDateAfter(today);
        return new Result(200, movies);
    }

    public Result getMoviesIsPLaying(){
        LocalDate localDate = LocalDate.now();
        Date today = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        List<Movie> movies = movieDao.findMovieByReleaseDateBeforeOrEqualAndIsPlayingTrue(today);
        return new Result(200, movies);
    }

    public Result updateMovieIsPlayingById(Integer id){
        movieDao.updateMovieIsPlayingById(id);
        return new Result(200, "success");
    }
}
