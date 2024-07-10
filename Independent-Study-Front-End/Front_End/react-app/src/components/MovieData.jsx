import PropTypes from "prop-types";
import { Box, Image, Text } from "@chakra-ui/react";

function MovieData({ src, alt, title, path, onClick }) {
  return (
    <Box
      className="movie-container"
      width="200px"
      height="300px"
      overflow="hidden"
      position="relative"
      _hover={{
        transform: "scale(1.05)",
        transition: "transform 0.3s",
      }}
      onClick={() => onClick(path)}
      cursor="pointer"
    >
      <Image
        className="movie-image"
        src={src}
        alt={alt}
        width="100%"
        height="100%"
        objectFit="cover"
      />
      <Text className="movie-title" textAlign="center" mt="2">
        {title}
      </Text>
    </Box>
  );
}

MovieData.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MovieData;
