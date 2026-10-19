"use client";
import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";

// Dark hero band with a soft brand glow, shared by the content pages.
const PageHero = ({ eyebrow, title, text, children }) => (
  <Box
    position="relative"
    overflow="hidden"
    bg="ink.900"
    color="white"
    _before={{
      content: '""',
      position: "absolute",
      inset: 0,
      bgImage:
        "radial-gradient(600px 300px at 85% -10%, rgba(245,158,11,0.35), transparent 70%), radial-gradient(500px 260px at 0% 110%, rgba(37,99,235,0.25), transparent 70%)",
    }}
  >
    <Container maxW="5xl" py={{ base: 16, md: 24 }} position="relative" textAlign="center">
      <Stack gap={5} align="center">
        <Text
          color="brand.300"
          fontWeight={700}
          fontSize="sm"
          textTransform="uppercase"
          letterSpacing="wider"
          bg="whiteAlpha.100"
          px={3}
          py={1}
          rounded="full"
        >
          {eyebrow}
        </Text>
        <Heading as="h1" size={{ base: "4xl", md: "6xl" }} maxW="3xl" lineHeight={1.1}>
          {title}
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.300" maxW="2xl">
          {text}
        </Text>
        {children}
      </Stack>
    </Container>
  </Box>
);

export default PageHero;
