import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useBreakpointValue,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfAlt as halfStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";

const Favorites = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = Cookies.get("token");
      if (!token) {
        alert("未找到token，請重新登錄");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/api/member/reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMovies(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
        alert("無法獲取收藏記錄，請稍後再試");
      }
    };

    fetchFavorites();
  }, []);

  const renderStars = (avgScore) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(avgScore)) {
        stars.push(
          <FontAwesomeIcon key={i} icon={solidStar} color="#FFD700" />
        );
      } else if (i === Math.ceil(avgScore) && avgScore % 1 !== 0) {
        stars.push(<FontAwesomeIcon key={i} icon={halfStar} color="#FFD700" />);
      } else {
        stars.push(
          <FontAwesomeIcon key={i} icon={emptyStar} color="#FFD700" />
        );
      }
    }
    return stars;
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    onOpen();
  };

  const modalSize = useBreakpointValue({ base: "full", md: "xl" });

  return (
    <Box
      direction="column"
      h="full"
      justifyContent="center"
      maxW="800px"
      mx="auto"
      p="6"
      boxShadow="lg"
      bg="white"
      borderRadius="md"
      color="black"
    >
      <VStack spacing={6} align="center" height="full">
        {movies.length === 0 ? (
          <Flex justify="center" align="center" height="full">
            <Text
              color="black"
              fontSize="24px"
              fontWeight="bold"
              mt={3}
              textAlign="center"
            >
              目前沒有電影評論! 快
              <Link href="/reviews" color="teal.500" textDecoration="underline">
                去發布
              </Link>
              吧!
            </Text>
          </Flex>
        ) : (
          movies.map((movie, index) => (
            <Flex
              key={index}
              width="100%"
              maxW="full"
              height="180px"
              mb={6}
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              overflow="hidden"
              boxShadow="lg"
              onClick={() => handleMovieClick(movie)}
              cursor="pointer"
              flexDirection={{ base: "column", md: "row" }}
            >
              <Image
                src={movie.movie.poster}
                alt={movie.movie.title}
                width={{ base: "100%", md: "150px" }}
                height={{ base: "auto", md: "100%" }}
                objectFit="cover"
              />
              <Box
                p={6}
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Text color="black" fontSize="24px" mb={4} fontWeight="bold">
                  {movie.movie.title}
                </Text>
                <Text color="black" fontSize="16px" mb={2}>
                  <strong>評分: {renderStars(movie.avgScore)}</strong>
                </Text>
                <Text color="black" fontSize="16px" mb={2}>
                  <strong>上映時間:</strong>{" "}
                  {movie.movie.releaseDate.replace(/-/g, "/")}
                </Text>
                <Text color="black" fontSize="16px" mb={2}>
                  <strong>播放時長:</strong> {movie.movie.runtime} 分鐘
                </Text>
              </Box>
            </Flex>
          ))
        )}

        {selectedMovie && (
          <Modal isOpen={isOpen} onClose={onClose} isCentered size={modalSize}>
            <ModalOverlay />
            <ModalContent maxHeight="100vh" overflowY="auto">
              <ModalCloseButton color="black" />
              <ModalBody>
                <Flex flexDirection={{ base: "column", md: "row" }}>
                  <Image
                    src={selectedMovie.movie.poster}
                    alt={selectedMovie.movie.title}
                    mb={4}
                    width="200px"
                    height="auto"
                    objectFit="cover"
                  />
                  <Box
                    ml={4}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Text color="black" mb={2}>
                      <strong>電影名稱:</strong> {selectedMovie.movie.title}
                    </Text>
                    <Text color="black" mb={2}>
                      <strong>評分:</strong>{" "}
                      {renderStars(selectedMovie.avgScore)}
                    </Text>
                    <Text color="black" mb={2}>
                      <strong>分級:</strong> {selectedMovie.movie.rating}
                    </Text>
                    <Text color="black" mb={2}>
                      <strong>上映時間:</strong>{" "}
                      {selectedMovie.movie.releaseDate.replace(/-/g, "/")}
                    </Text>
                    <Text color="black" mb={2}>
                      <strong>播放時長:</strong> {selectedMovie.movie.runtime}{" "}
                      分鐘
                    </Text>
                    <Text color="black" mb={2}>
                      <strong>導演:</strong> {selectedMovie.movie.director}
                    </Text>
                    <Text color="black" mb={2}>
                      <strong>類型:</strong> {selectedMovie.movie.genre}
                    </Text>
                    <Text color="black" mb={2}>
                      <strong>語言:</strong> {selectedMovie.movie.language}
                    </Text>
                  </Box>
                </Flex>
                <Text color="black" mb={2}>
                  <strong>大綱:</strong> {selectedMovie.movie.synopsis}
                </Text>
                <Box mt={4}>
                  <Text color="black" mb={2}>
                    <strong>我的評論:</strong>
                  </Text>
                  <Box pl={4}>
                    {selectedMovie.review && selectedMovie.review.comment ? (
                      <Text color="black" mb={2}>
                        - {selectedMovie.review.comment}
                      </Text>
                    ) : (
                      <Text color="black" mb={2}>
                        沒有評論。
                      </Text>
                    )}
                  </Box>
                </Box>
                <Box mt={4}>
                  <Text color="black" mb={2}>
                    <strong>評論時間:</strong>
                  </Text>
                  <Box pl={4}>
                    {selectedMovie.review && selectedMovie.review.reviewDate ? (
                      <Text color="black" mb={2}>
                        -{" "}
                        {selectedMovie.review.reviewDate
                          .replace(/-/g, "/")
                          .replace("T", " ")}
                      </Text>
                    ) : (
                      <Text color="black" mb={2}>
                        沒有評論。
                      </Text>
                    )}
                  </Box>
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </VStack>
    </Box>
  );
};

export default Favorites;
