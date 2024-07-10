import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import ButtonHome from "../components/Button/ButtonHome";
import {
  Box,
  Flex,
  Image,
  Text,
  Grid,
  useColorModeValue,
  IconButton,
  useBreakpointValue,
  Spinner,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Home = () => {
  const [playingMovies, setPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [navHeight, setNavHeight] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const navRef = useRef(null);
  const bg = useColorModeValue("#000000", "#000000");
  const buttonBg = useColorModeValue("#2D2D2D", "#2D2D2D");
  const buttonActiveBg = useColorModeValue("#000000", "#000000");
  const buttonTextColor = useColorModeValue("#FFFFF0", "#FFFFF0");
  const buttonInactiveTextColor = useColorModeValue("#A8A8A8", "#A8A8A8");
  const buttonHoverBg = useColorModeValue("#3D3D3D", "#3D3D3D");
  const buttonFocusBoxShadow = "0 0 0 4px #FFFFF0";

  const moviesPerPage = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    "2xl": 6,
  });

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        const [playingResponse, upcomingResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/movie?isPlaying=true`),
          fetch(`http://localhost:8080/api/movie?isPlaying=false`),
        ]);

        if (!playingResponse.ok || !upcomingResponse.ok) {
          throw new Error("Failed to fetch movies");
        }

        const playingData = await playingResponse.json();
        const upcomingData = await upcomingResponse.json();

        setPlayingMovies(playingData);
        setUpcomingMovies(upcomingData);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  useEffect(() => {
    if (navRef.current) {
      const height = navRef.current.offsetHeight;
      setNavHeight(height);
    }
  }, []);

  const handleMovieClick = (path) => {
    navigate(path);
  };

  const handlePrevMovie = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const handleNextMovie = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const movies = isPlaying ? playingMovies : upcomingMovies;

  let displayedMovies;
  if (movies.length <= moviesPerPage) {
    displayedMovies = movies;
  } else {
    displayedMovies = movies.slice(currentIndex, currentIndex + moviesPerPage);
    if (displayedMovies.length < moviesPerPage) {
      displayedMovies = displayedMovies.concat(
        movies.slice(0, moviesPerPage - displayedMovies.length)
      );
    }
  }

  return (
    <Box bg={bg} color="white" minHeight="100vh" pt="4rem" overflow="hidden">
      <Box
        position="relative"
        width="100%"
        height={{ base: "60vh", lg: `calc(100vh - ${navHeight}px)` }}
      >
        <VideoPlayer style={{ width: "100%", height: "100%" }} />
      </Box>
      <Box minHeight="50px" />
      <Flex
        justify="center"
        mt={12}
        mb={8}
        ref={navRef}
        direction={{ base: "column", lg: "row" }}
        alignItems={{ base: "center", lg: "unset" }}
      >
        <ButtonHome
          onClick={() => {
            setIsPlaying(true);
            setCurrentIndex(0);
          }}
          bg={isPlaying ? buttonActiveBg : buttonBg}
          color={isPlaying ? buttonTextColor : buttonInactiveTextColor}
          _hover={{ bg: buttonHoverBg }}
          _focus={{ boxShadow: buttonFocusBoxShadow }}
          label="現正熱映"
          mb={{ base: 4, lg: 0 }}
        />
        <ButtonHome
          onClick={() => {
            setIsPlaying(false);
            setCurrentIndex(0);
          }}
          bg={!isPlaying ? buttonActiveBg : buttonBg}
          color={!isPlaying ? buttonTextColor : buttonInactiveTextColor}
          _hover={{ bg: buttonHoverBg }}
          _focus={{ boxShadow: buttonFocusBoxShadow }}
          label="即將上映"
        />
      </Flex>
      <Box minHeight="50px" />
      <Flex justify="center" alignItems="center" width="100%">
        {movies.length > moviesPerPage && (
          <IconButton
            icon={<ChevronLeftIcon />}
            onClick={handlePrevMovie}
            aria-label="Previous Movie"
            bg={buttonBg}
            color={buttonTextColor}
            _hover={{ bg: buttonHoverBg }}
            _focus={{ boxShadow: buttonFocusBoxShadow }}
            mr={4}
          />
        )}
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Grid
            templateColumns={`repeat(${Math.min(
              moviesPerPage,
              displayedMovies.length
            )}, 1fr)`}
            gap={6}
            width="100%"
            maxWidth="100%"
            overflow="hidden"
            justifyItems="center"
          >
            {displayedMovies.map((movie) => (
              <Box
                key={movie.id}
                className="movie-container"
                width="200px"
                height="300px"
                overflow="hidden"
                position="relative"
                _hover={{
                  transform: "scale(1.05)",
                  transition: "transform 0.3s",
                }}
                onClick={() => handleMovieClick(`/booking/${movie.id}`)}
                cursor="pointer"
                onMouseEnter={() => setHoveredMovie(movie.id)}
                onMouseLeave={() => setHoveredMovie(null)}
                mx="auto"
              >
                <Image
                  className="movie-image"
                  src={movie.poster}
                  alt={movie.title}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  display="block"
                />
                <Text className="movie-title" textAlign="center" mt="2">
                  {movie.title}
                </Text>
                {!isPlaying && hoveredMovie === movie.id && (
                  <Text
                    position="absolute"
                    bottom="10px"
                    left="50%"
                    transform="translateX(-50%)"
                    bg="rgba(0, 0, 0, 0.7)"
                    color="white"
                    p="2"
                    borderRadius="5px"
                  >
                    上映日期: {new Date(movie.releaseDate).toLocaleDateString()}
                  </Text>
                )}
              </Box>
            ))}
          </Grid>
        )}
        {movies.length > moviesPerPage && (
          <IconButton
            icon={<ChevronRightIcon />}
            onClick={handleNextMovie}
            aria-label="Next Movie"
            bg={buttonBg}
            color={buttonTextColor}
            _hover={{ bg: buttonHoverBg }}
            _focus={{ boxShadow: buttonFocusBoxShadow }}
            ml={4}
          />
        )}
      </Flex>
      <Box minHeight="50px" />
    </Box>
  );
};

export default Home;
