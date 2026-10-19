"use client";
import NextLink from "next/link";
import { Box, Container, Flex, HStack, Link, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="footer" bg="gray.900" color="gray.300" mt={10}>
      <Container maxW="7xl" py={6}>
        <Flex direction={{ base: "column", md: "row" }} gap={3} align="center" justify="space-between">
          <Text fontWeight={700} color="white">
            CAB <Text as="span" color="brand.400">India</Text>
          </Text>
          <HStack spacing={5} fontSize="sm">
            <Link as={NextLink} href="/home">Book a Ride</Link>
            <Link as={NextLink} href="/about">About</Link>
            <Link as={NextLink} href="/contact">Contact</Link>
          </HStack>
          <Text fontSize="sm">© {new Date().getFullYear()} CAB India. All rights reserved.</Text>
        </Flex>
        <Text fontSize="xs" color="gray.500" textAlign="center" mt={4}>
          Map data © OpenStreetMap contributors · Routing by OSRM
        </Text>
      </Container>
    </Box>
  );
}
