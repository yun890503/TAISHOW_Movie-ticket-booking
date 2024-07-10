import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import {
  Box,
  Flex,
  Text,
  Image,
  useColorModeValue,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { StarIcon, ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import Cookies from "js-cookie";

const RatingOverview = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageScores, setAverageScores] = useState({});
  const [sortOption, setSortOption] = useState("score");
  const [showEnded, setShowEnded] = useState(false);

  const bg = useColorModeValue("#000000", "#000000");
  const textColor = "#FFFFF0";
  const buttonBg = useColorModeValue("#2D2D2D", "#2D2D2D");
  const buttonHoverBg = useColorModeValue("#3D3D3D", "#3D3D3D");
  const buttonFocusBoxShadow = "0 0 0 4px #FFFFF0";
  const menuListBg = useColorModeValue("gray.800", "gray.800");
  const menuItemBg = useColorModeValue("gray.800", "gray.800");
  const menuItemHoverBg = useColorModeValue("gray.700", "gray.700");

  useEffect(() => {
    async function fetchMovies() {
      const endpoint = showEnded
        ? "http://localhost:8080/api/movies/ended"
        : "http://localhost:8080/api/movie";
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    }

    async function fetchReviews() {
      try {
        const response = await fetch(`http://localhost:8080/api/reviews`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    }

    fetchMovies();
    fetchReviews();
  }, [showEnded]);

  useEffect(() => {
    if (movies.length > 0 && reviews.length > 0) {
      const scores = {};
      movies.forEach((movie) => {
        const movieReviews = reviews.filter(
          (review) => review.movieId === movie.id
        );
        if (movieReviews.length > 0) {
          const totalScore = movieReviews.reduce(
            (sum, review) => sum + review.score,
            0
          );
          scores[movie.id] = {
            average: (totalScore / movieReviews.length).toFixed(1),
            count: movieReviews.length,
          };
        } else {
          scores[movie.id] = {
            average: null,
            count: 0,
          };
        }
      });
      setAverageScores(scores);
    }
  }, [movies, reviews]);

  const handleReviewClick = async (movieId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `http://localhost:8080/reviews/${movieId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const reviewDetailDto = response.data;
      console.log(reviewDetailDto);
      navigate(`/reviews/${movieId}`, {
        state: { movieId: movieId, reviewDetailDto },
      });
    } catch (error) {
      console.error("Error fetching review data:", error);
    }
  };

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const sortedMovies = movies.sort((a, b) => {
    if (sortOption === "score") {
      return (
        (averageScores[b.id]?.average || 0) -
        (averageScores[a.id]?.average || 0)
      );
    } else if (sortOption === "count") {
      return (
        (averageScores[b.id]?.count || 0) - (averageScores[a.id]?.count || 0)
      );
    }
    return 0;
  });

  const handleShowEndedClick = () => {
    setShowEnded(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToPopularClick = () => {
    setShowEnded(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMovieClick = async (movieId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/movies/details/${movieId}`
      );
      const movieDetails = response.data;
      navigate(`/movies/${movieId}`, { state: { movieDetails } });
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  return (
    <Box bg={bg} color={textColor} minHeight="100vh">
      <Box height="80px" />
      <Box p="4" maxW="1200px" mx="auto">
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Text fontSize="2xl" fontWeight="bold">
            {showEnded ? "已下檔電影" : "熱門電影"}
          </Text>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg={buttonBg}
              color={textColor}
              _hover={{ bg: buttonHoverBg }}
              _expanded={{ bg: buttonBg }}
              _focus={{ boxShadow: buttonFocusBoxShadow }}
            >
              {sortOption === "score" ? "評分分數" : "評分數量"}
            </MenuButton>
            <MenuList bg={menuListBg} color={textColor}>
              <MenuItem
                bg={menuItemBg}
                _hover={{ bg: menuItemHoverBg }}
                onClick={() => handleSortChange("score")}
              >
                評分分數
              </MenuItem>
              <MenuItem
                bg={menuItemBg}
                _hover={{ bg: menuItemHoverBg }}
                onClick={() => handleSortChange("count")}
              >
                評分數量
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        {sortedMovies.map((movie) => (
          <Box key={movie.id}>
            <Flex
              direction="row"
              alignItems="center"
              mt="6"
              cursor="pointer"
              _hover={{
                transform: "scale(1.02)",
                transition: "transform 0.3s",
              }}
              p="4"
              bg="#1A202C"
              borderRadius="md"
              mb="4"
              onClick={() => handleReviewClick(movie.id)}
            >
              <Box
                position="relative"
                width="150px"
                height="225px"
                overflow="hidden"
                flexShrink="0"
              >
                <Image
                  className="movie-image"
                  src={movie.poster}
                  alt={movie.title}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              </Box>
              <Box ml="6" flex="1" display={{ base: "none", md: "block" }}>
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${movie.trailer}`}
                  width="100%"
                  height="225px"
                  controls={true}
                  light={true}
                  onClick={() => handleMovieClick(movie.id)}
                />
              </Box>
              <Box ml="6" flex="2">
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  {movie.title}
                </Text>
                <Text mt="2" color={textColor}>
                  片長: {movie.runtime} 分鐘
                </Text>
                <Text mt="2" color={textColor}>
                  級別: {movie.rating}
                </Text>
                <Text mt="2" color={textColor}>
                  類別: {movie.genre}
                </Text>
                <Flex mt="2" alignItems="center">
                  <Icon as={StarIcon} color="yellow.500" boxSize={4} />
                  <Text mb="0" ml="2" fontSize="sm" color={textColor}>
                    {averageScores[movie.id]?.average ?? 0}
                  </Text>
                </Flex>

                <Button
                  mt="4"
                  bg={buttonBg}
                  color={textColor}
                  _hover={{ bg: buttonHoverBg }}
                  _focus={{ boxShadow: buttonFocusBoxShadow }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReviewClick(movie.id);
                  }}
                >
                  前往評分評論
                </Button>
              </Box>
            </Flex>
          </Box>
        ))}
        {!showEnded ? (
          <Button
            mt="4"
            bg={buttonBg}
            color={textColor}
            _hover={{ bg: buttonHoverBg }}
            _focus={{ boxShadow: buttonFocusBoxShadow }}
            onClick={handleShowEndedClick}
          >
            查看更多
          </Button>
        ) : (
          <Button
            mt="4"
            bg={buttonBg}
            color={textColor}
            _hover={{ bg: buttonHoverBg }}
            _focus={{ boxShadow: buttonFocusBoxShadow }}
            onClick={handleBackToPopularClick}
          >
            返回
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default RatingOverview;
