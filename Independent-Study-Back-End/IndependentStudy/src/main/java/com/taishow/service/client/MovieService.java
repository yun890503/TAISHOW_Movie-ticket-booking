package com.taishow.service.client;

import com.taishow.dao.MovieRepository;
import com.taishow.entity.Movie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Movie createOrUpdateMovie(Movie movie){
        return movieRepository.save(movie);
    }

    public List<Movie> getAllMovies(){
        return movieRepository.findAll();
    }

    public Optional<Movie> getMovieById(Integer id){
        return movieRepository.findById(id);
    }

    public Movie updateMovie(Integer id, Movie movieDetails) {
        Optional<Movie> movieOptional = movieRepository.findById(id);

        if (movieOptional.isPresent()) {
            Movie existingMovie = movieOptional.get();

            // Update the existing movie's details with the provided movieDetails
            if (movieDetails.getTitle() != null) {
                existingMovie.setTitle(movieDetails.getTitle());
            }
            if (movieDetails.getTitleEnglish() != null) {
                existingMovie.setTitleEnglish(movieDetails.getTitleEnglish());
            }
            if (movieDetails.getRating() != null) {
                existingMovie.setRating(movieDetails.getRating());
            }
            if (movieDetails.getGenre() != null) {
                existingMovie.setGenre(movieDetails.getGenre());
            }
            if (movieDetails.getReleaseDate() != null) {
                existingMovie.setReleaseDate(movieDetails.getReleaseDate());
            }
            if (movieDetails.getDirector() != null) {
                existingMovie.setDirector(movieDetails.getDirector());
            }
            if (movieDetails.getSynopsis() != null) {
                existingMovie.setSynopsis(movieDetails.getSynopsis());
            }
            if (movieDetails.getLanguage() != null) {
                existingMovie.setLanguage(movieDetails.getLanguage());
            }
            if (movieDetails.getTrailer() != null) {
                existingMovie.setTrailer(movieDetails.getTrailer());
            }
            if (movieDetails.getPoster() != null) {
                existingMovie.setPoster(movieDetails.getPoster());
            }


            return movieRepository.save(existingMovie);
        }

        return null; // or throw an exception if preferred
    }

    public boolean deleteMovie(Integer id){
        if (movieRepository.existsById(id)) {
            movieRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
    public List<Movie> getAllMovies(boolean isPlaying) {
        if (isPlaying) {
            return movieRepository.findByIsPlaying(true);
        } else {
            // 返回即将上映的电影（过滤掉已下档的电影）
            Date today = new Date();
            return movieRepository.findByIsPlaying(false).stream()
                    .filter(movie -> movie.getReleaseDate().after(today))
                    .collect(Collectors.toList());
        }
    }
    public List<Movie> getHomepageTrailers() {
        return movieRepository.findByIsHomepageTrailer(true);
    }
    public List<Movie> searchMovies(String query) {
        return movieRepository.findByTitleContainingIgnoreCase(query);
    }
    public List<Movie> getEndedMovies() {
        Date today = new Date();
        return movieRepository.findByIsPlaying(false).stream()
                .filter(movie -> movie.getReleaseDate().before(today))
                .collect(Collectors.toList());
    }
}
