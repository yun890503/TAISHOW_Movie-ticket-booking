import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Grid,
  Text,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import ButtonHome from "../components/Button/ButtonHome";

const Overview = () => {
  const navigate = useNavigate();
  const [playingMovies, setPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState(null);

  const bg = useColorModeValue("#000000", "#000000");
  const buttonBg = useColorModeValue("#2D2D2D", "#2D2D2D");
  const buttonActiveBg = useColorModeValue("#000000", "#000000");
  const buttonTextColor = useColorModeValue("#FFFFF0", "#FFFFF0");
  const buttonInactiveTextColor = useColorModeValue("#A8A8A8", "#A8A8A8");
  const buttonHoverBg = useColorModeValue("#3D3D3D", "#3D3D3D");
  const buttonFocusBoxShadow = "0 0 0 4px #FFFFF0";

  useEffect(() => {
    async function fetchMovies() {
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
      }
    }

    fetchMovies();
  }, []);

  const handleMovieClick = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/movies/details/${id}`
      );
      const movieDetails = response.data;
      console.log(movieDetails);
      navigate(`/movies/${id}`, { state: { movieDetails } });
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const movies = isPlaying ? playingMovies : upcomingMovies;

  return (
    <Box bg={bg} color="white" minHeight="100vh">
      <Box height="80px" />
      <Box p="4">
        <Flex justifyContent="center" mb="12">
          <ButtonHome
            onClick={() => setIsPlaying(true)}
            bg={isPlaying ? buttonActiveBg : buttonBg}
            color={isPlaying ? buttonTextColor : buttonInactiveTextColor}
            _hover={{ bg: buttonHoverBg }}
            _focus={{ boxShadow: buttonFocusBoxShadow }}
            label="現正熱映"
          />
          <ButtonHome
            onClick={() => setIsPlaying(false)}
            bg={isPlaying ? buttonBg : buttonActiveBg}
            color={isPlaying ? buttonInactiveTextColor : buttonTextColor}
            _hover={{ bg: buttonHoverBg }}
            _focus={{ boxShadow: buttonFocusBoxShadow }}
            label="即將上映"
          />
        </Flex>

        <Box mt="12">
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(6, 1fr)",
            }}
            gap="6"
            mb="12"
            maxWidth={{ base: "100%", sm: "100%", md: "100%", lg: "100%" }}
            mx="auto"
          >
            {movies.map((movie, index) => (
              <Flex
                key={index}
                direction="column"
                alignItems="center"
                mt={{ base: "6", md: "6", lg: "12" }}
                onClick={() => handleMovieClick(movie.id)}
                cursor="pointer"
                onMouseEnter={() => setHoveredMovie(index)}
                onMouseLeave={() => setHoveredMovie(null)}
                mx="auto"
              >
                <Box
                  position="relative"
                  width={{ base: "160px", sm: "200px" }}
                  height={{ base: "240px", sm: "300px" }}
                  overflow="hidden"
                  _hover={{
                    transform: "scale(1.05)",
                    transition: "transform 0.3s",
                  }}
                >
                  <Image
                    className="movie-image"
                    src={movie.poster}
                    alt={movie.title}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                  {hoveredMovie === index && !isPlaying && (
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
                      上映日期:{" "}
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </Text>
                  )}
                </Box>
                <Text mt="8" textAlign="center" color="white">
                  {movie.title}
                </Text>
              </Flex>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Overview;
