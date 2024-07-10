import { useState } from "react";
import PropTypes from "prop-types";
import { Flex, Button, Tooltip, Box } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import MovieData from "./MovieData";

function MovieList({ movieData, onMovieClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movieData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movieData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getVisibleMovies = () => {
    let visibleMovies = [];
    for (let i = 0; i < 5; i++) {
      visibleMovies.push(movieData[(currentIndex + i) % movieData.length]);
    }
    return visibleMovies;
  };

  return (
    <Box
      position="relative"
      width="100%"
      overflow="hidden"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <Tooltip label="Previous" hasArrow>
        <Button
          onClick={handlePrev}
          aria-label="Previous"
          color="#FFFFF0"
          opacity={showArrows ? 1 : 0.5}
          size="lg"
          fontSize="2xl"
          leftIcon={<ChevronLeftIcon boxSize={8} />}
          variant="ghost"
          position="absolute"
          top="50%"
          left="10px"
          transform="translateY(-50%)"
          zIndex={10}
          _focus={{ outline: "none" }}
          _hover={{ color: "#FFFFF0", opacity: 1 }}
          transition="opacity 0.3s, color 0.3s"
        />
      </Tooltip>

      <Flex justify="center" align="center">
        {getVisibleMovies().map((movie, index) => (
          <MovieData
            key={index}
            src={movie.src}
            alt={movie.alt}
            title={movie.title}
            path={movie.path}
            onClick={onMovieClick}
          />
        ))}
      </Flex>

      <Tooltip label="Next" hasArrow>
        <Button
          onClick={handleNext}
          aria-label="Next"
          color="#FFFFF0"
          opacity={showArrows ? 1 : 0.5}
          size="lg"
          fontSize="2xl"
          rightIcon={<ChevronRightIcon boxSize={8} />}
          variant="ghost"
          position="absolute"
          top="50%"
          right="10px"
          transform="translateY(-50%)"
          zIndex={10}
          _focus={{ outline: "none" }}
          _hover={{ color: "#FFFFF0", opacity: 1 }}
          transition="opacity 0.3s, color 0.3s"
        />
      </Tooltip>
    </Box>
  );
}

MovieList.propTypes = {
  movieData: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  onMovieClick: PropTypes.func.isRequired,
};

export default MovieList;
