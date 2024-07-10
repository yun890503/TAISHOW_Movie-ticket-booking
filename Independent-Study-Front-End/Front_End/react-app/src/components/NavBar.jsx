import { useState, useRef } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Image,
  Input,
  Link,
  IconButton,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import axios from "axios";
import logo from "../assets/logo.svg";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      as="nav"
      position="fixed"
      top="0"
      w="100%"
      bg="black"
      color="#FFFFF0"
      zIndex="1000"
      p="4"
      boxShadow="md"
    >
      <Flex justify="space-between" align="center">
        <Flex align="center">
          <Logo />
          <Flex display={{ base: "none", md: "flex" }}>
            <NavLinks isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </Flex>
        </Flex>
        <Flex display={{ base: "none", md: "flex" }}>
          <Search />
        </Flex>
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Toggle Navigation"
          onClick={toggleMenu}
          bg="black"
          color="white"
          _hover={{ bg: "gray.700" }}
        />
      </Flex>
      {isOpen && (
        <VStack
          display={{ base: "flex", md: "none" }}
          bg="black"
          spacing="4"
          mt="4"
          align="start"
        >
          <NavLinks isOpen={isOpen} onClose={() => setIsOpen(false)} />
          <Search />
        </VStack>
      )}
    </Box>
  );
}

function Logo() {
  return (
    <Link as={RouterLink} to="/" display="flex" alignItems="center" mr="4">
      <Image src={logo} alt="Logo" height="2.5rem" />
    </Link>
  );
}

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const searchBgColor = "gray.800";
  const placeholderColor = "#FFFFF0";
  const borderColor = "gray.800";
  const activeBorderColor = "#FFFFF0";
  const resultTextColor = "#FFFFF0";

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/movies/search?query=${value}`
      );
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response");
      }
      if (response.status === 204) {
        setResults([]);
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleResultClick = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/movies/details/${id}`
      );
      const movieDetails = response.data;
      setQuery("");
      setResults([]);
      navigate(`/movies/${id}`, { state: { movieDetails } });
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleBlur = () => {
    setResults([]);
  };

  const handleFocus = () => {
    if (query.trim() !== "") {
      handleSearch({ target: { value: query } });
    }
  };

  return (
    <Box position="relative">
      <Input
        ref={inputRef}
        className="search-input"
        placeholder="Search movies..."
        value={query}
        onChange={handleSearch}
        onBlur={handleBlur}
        onFocus={handleFocus}
        bg={searchBgColor}
        color="white"
        border="1px"
        borderColor={borderColor}
        borderRadius="md"
        width="15rem"
        _placeholder={{ color: placeholderColor }}
        _focus={{ borderColor: activeBorderColor }}
      />
      {results.length > 0 && (
        <Box
          position="absolute"
          bg={searchBgColor}
          color={resultTextColor}
          mt="2"
          borderRadius="md"
          boxShadow="md"
          width="100%"
          zIndex="1000"
          maxHeight="15rem"
          overflowY="auto"
        >
          {results.map((result) => (
            <HStack
              key={result.id}
              p="2"
              cursor="pointer"
              _hover={{ bg: "gray.700" }}
              onMouseDown={() => handleResultClick(result.id)}
              alignItems="center"
              spacing="3"
            >
              <Image
                src={result.poster}
                alt={result.title}
                boxSize="50px"
                objectFit="cover"
                borderRadius="md"
              />
              <Text color={resultTextColor}>{result.title}</Text>
            </HStack>
          ))}
        </Box>
      )}
    </Box>
  );
}

function NavLinks({ isOpen, onClose }) {
  return (
    <Flex
      gap="1.5rem"
      ml="4"
      direction={{ base: "column", md: "row" }}
      align={{ base: "start", md: "center" }}
    >
      <NavLink to="/movies" label="電影資訊" onClose={onClose} />
      <NavLink to="/reviews" label="電影評論" onClose={onClose} />
      <NavLink to="/theaters" label="影城資訊" onClose={onClose} />
      <NavLink to="/login" label="會員中心" onClose={onClose} />
    </Flex>
  );
}

NavLinks.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

function NavLink({ to, label, onClose }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    onClose(); // 關閉漢堡菜單

    if (label === "會員中心") {
      const token = Cookies.get("token");
      if (token) {
        navigate("/member");
      } else {
        navigate("/login");
      }
    } else {
      navigate(to);
    }
  };

  return (
    <Link
      onClick={handleClick}
      fontSize="1rem"
      color="#FFFFF0"
      position="relative"
      textDecoration="none"
      _after={{
        content: '""',
        position: "absolute",
        width: "100%",
        borderBottom: "2px solid transparent",
        bottom: "0",
        left: "0",
        transform: "scaleX(0)",
        transformOrigin: "bottom right",
        transition: "transform 0.25s ease-out",
      }}
      _hover={{
        color: "white",
        _after: {
          transform: "scaleX(1)",
          borderBottomColor: "#FFFFF0",
        },
      }}
    >
      {label}
    </Link>
  );
}

export default NavBar;
