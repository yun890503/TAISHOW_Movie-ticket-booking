import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Flex,
  Text,
  VStack,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const Footer = () => {
  const [isAgreed, setIsAgreed] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsAgreed(event.target.checked);
  };

  return (
    <Box as="footer" bg="black" color="#FFFFF0" py="4" px="8">
      <Box
        bg="black"
        height="40px"
        borderBottom="1px solid #333333"
        boxShadow="sm"
      />
      <Flex
        justify="space-between"
        align="flex-start"
        wrap="wrap"
        maxW="1200px"
        mx="auto"
        direction={{ base: "column", md: "row" }}
        ml={{ base: "0", md: "4rem" }}
        mt="4"
      >
        <FooterNewsletter
          isAgreed={isAgreed}
          handleCheckboxChange={handleCheckboxChange}
        />

        <FooterSection title="Movie Theater">
          <FooterLink href="https://www.vscinemas.com.tw/vsweb/">
            威秀影城
          </FooterLink>
          <FooterLink href="https://www.showtimes.com.tw/">秀泰影城</FooterLink>
        </FooterSection>

        <FooterSection title="Quick Links">
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/overview">Overview</FooterLink>
          <FooterLink href="/reviews">Reviews</FooterLink>
          <FooterLink href="/cinemas">Cinemas</FooterLink>
          <FooterLink href="/member">Member Center</FooterLink>
        </FooterSection>

        <FooterSection title="Follow Us">
          <FooterLink href="#">Facebook</FooterLink>
          <FooterLink href="#">Twitter</FooterLink>
          <FooterLink href="#">Instagram</FooterLink>
          <FooterLink href="#">YouTube</FooterLink>
        </FooterSection>
      </Flex>
      <Box mt="4" textAlign="center" color="#FFFFF0">
        <Text fontSize="0.875rem">Tai Show © 2024</Text>
      </Box>
    </Box>
  );
};

const FooterSection = ({ title, children }) => (
  <Flex
    direction="column"
    align="flex-start"
    m="2"
    w={{ base: "100%", md: "200px" }}
    textAlign={{ base: "center", md: "left" }}
  >
    <Text fontSize="0.875rem" mb="6" w="100%">
      {title}
    </Text>
    <VStack as="ul" align="flex-start" spacing="2" w="100%" pl="0">
      {children}
    </VStack>
  </Flex>
);

FooterSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const FooterLink = ({ href, children }) => (
  <a
    href={href}
    style={{ color: "#FFFFF0", fontSize: "0.875rem", textDecoration: "none" }}
  >
    {children}
  </a>
);

FooterLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const FooterNewsletter = ({ isAgreed, handleCheckboxChange }) => (
  <Flex
    direction="column"
    align="flex-start"
    m="2"
    w={{ base: "100%", md: "300px" }}
    textAlign={{ base: "center", md: "left" }}
    order={{ base: -1, md: "1" }}
  >
    <FormControl id="email-subscription">
      <FormLabel fontSize="0.875rem" mb="6">
        NEWSLETTER
      </FormLabel>
      <HStack
        borderBottom="1px solid lightgray"
        borderBottomColor="gray.200"
        borderBottomWidth="1px"
        alignItems="center"
        spacing="0"
        _focusWithin={{ borderBottomColor: "#FFFFF0" }}
        boxShadow="md"
      >
        <Input
          type="email"
          placeholder="EMAIL"
          size="sm"
          borderRadius="0"
          borderColor="transparent"
          _focus={{ boxShadow: "none", borderColor: "transparent" }}
          _hover={{ borderColor: "transparent" }}
          _placeholder={{ color: "#FFFFF0" }}
          color="#FFFFF0"
          flex="2"
        />
        <IconButton
          icon={<ArrowForwardIcon />}
          bg="transparent"
          color="#FFFFF0"
          _hover={{ bg: "transparent" }}
          isDisabled={!isAgreed}
          aria-label="Subscribe"
        />
      </HStack>
      <Checkbox
        mt="2"
        colorScheme="whiteAlpha"
        onChange={handleCheckboxChange}
        whiteSpace="nowrap"
      >
        I agree to the privacy policy
      </Checkbox>
    </FormControl>
    <Box
      borderBottom={{ base: "1px solid #333333", md: "none" }}
      width="100%"
      mt="8"
    />
  </Flex>
);

FooterNewsletter.propTypes = {
  isAgreed: PropTypes.bool.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default Footer;