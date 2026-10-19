"use client";
import NextLink from "next/link";
import { Box, Container, Flex, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { BrandMark } from "../header/header";
import { CABS } from "../../lib/fares";

const FooterLink = ({ href, children }) => (
  <Link asChild color="gray.400" fontSize="sm" _hover={{ color: "white", textDecoration: "none" }}>
    <NextLink href={href}>{children}</NextLink>
  </Link>
);

const Column = ({ title, children }) => (
  <Stack gap={3}>
    <Text fontSize="xs" fontWeight={700} textTransform="uppercase" letterSpacing="wider" color="gray.500">
      {title}
    </Text>
    {children}
  </Stack>
);

export default function Footer() {
  return (
    <Box as="footer" bg="ink.900" color="gray.400">
      <Container maxW="7xl" pt={14} pb={8}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={10}>
          <Stack gap={4} gridColumn={{ sm: "span 2", md: "span 1" }}>
            <BrandMark dark />
            <Text fontSize="sm" maxW="xs">
              Plan rides across India with real road routes and upfront fare estimates for every cab type.
            </Text>
          </Stack>
          <Column title="Company">
            <FooterLink href="/about">About us</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/contact#faq">FAQ</FooterLink>
          </Column>
          <Column title="Ride types">
            {CABS.map((cab) => (
              <FooterLink key={cab.id} href="/home">{cab.name}</FooterLink>
            ))}
          </Column>
          <Column title="Get started">
            <FooterLink href="/home">Book a ride</FooterLink>
            <FooterLink href="/about#fares">How fares work</FooterLink>
          </Column>
        </SimpleGrid>
        <Flex
          mt={12}
          pt={6}
          borderTopWidth="1px"
          borderColor="whiteAlpha.200"
          direction={{ base: "column", md: "row" }}
          gap={2}
          justify="space-between"
          fontSize="xs"
          color="gray.500"
        >
          <Text>© {new Date().getFullYear()} CAB India. All rights reserved.</Text>
          <Text>Map data © OpenStreetMap contributors · Routing by OSRM</Text>
        </Flex>
      </Container>
    </Box>
  );
}
