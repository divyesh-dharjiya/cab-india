"use client";
import NextLink from "next/link";
import { Box, Button, Container, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";

const FEATURES = [
  { icon: "🗺️", title: "Accurate routes", text: "Real road routes and travel times calculated from OpenStreetMap data." },
  { icon: "💸", title: "Transparent fares", text: "See an upfront estimate for every cab type before you book — no surprises." },
  { icon: "🚘", title: "A cab for every trip", text: "From compact Micro rides to 7-seat MPVs for family trips and luggage." },
  { icon: "🇮🇳", title: "Built for India", text: "Search any city, town or landmark across India with smart suggestions." },
];

const About = () => (
  <Box>
    <Box bgGradient="to-br" gradientFrom="brand.400" gradientTo="brand.600" color="gray.900">
      <Container maxW="5xl" py={{ base: 12, md: 20 }} textAlign="center">
        <Heading as="h1" size={{ base: "4xl", md: "5xl" }} mb={4}>
          Getting around India, made simple
        </Heading>
        <Text fontSize="lg" maxW="2xl" mx="auto">
          CAB India helps you plan a ride in seconds: pick where you are, where you&apos;re going,
          and compare fares across cab types on a live map.
        </Text>
        <Button asChild size="lg" mt={8} bg="gray.900" color="white" _hover={{ bg: "gray.700" }}>
          <NextLink href="/home">Book a ride</NextLink>
        </Button>
      </Container>
    </Box>

    <Container maxW="5xl" py={{ base: 10, md: 16 }}>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        {FEATURES.map((feature) => (
          <Stack key={feature.title} bg="white" p={6} rounded="2xl" borderWidth="1px" borderColor="gray.200" gap={2}>
            <Text fontSize="3xl">{feature.icon}</Text>
            <Heading size="lg">{feature.title}</Heading>
            <Text color="gray.600">{feature.text}</Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Container>
  </Box>
);

export default About;
