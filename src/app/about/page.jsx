"use client";
import NextLink from "next/link";
import { Box, Button, Container, Flex, Heading, SimpleGrid, Stack, Table, Text } from "@chakra-ui/react";
import { ArrowRight, BadgeIndianRupee, CarFront, Map, ShieldCheck } from "lucide-react";
import PageHero from "../components/page-hero/page-hero";
import CarIcon from "../components/car-list/car-icon";
import { CABS } from "../lib/fares";
import { formatPrice } from "../lib/format";

const FEATURES = [
  { icon: Map, title: "Accurate routes", text: "Real road routes and travel times calculated from OpenStreetMap data." },
  { icon: BadgeIndianRupee, title: "Transparent fares", text: "See an itemised estimate for every cab type before you book — no surprises." },
  { icon: CarFront, title: "A cab for every trip", text: "From compact Micro rides to 7-seat MPVs for family trips and luggage." },
  { icon: ShieldCheck, title: "Built for India", text: "Search any city, town or landmark across India with smart suggestions." },
];

const About = () => (
  <Box>
    <PageHero
      eyebrow="About CAB India"
      title="Getting around India, made simple"
      text="CAB India helps you plan a ride in seconds: pick where you are, where you're going, and compare upfront fares across cab types on a live map."
    >
      <Button asChild size="lg" colorPalette="brand" rounded="xl" mt={3}>
        <NextLink href="/home">Plan a ride <ArrowRight /></NextLink>
      </Button>
    </PageHero>

    <Container maxW="6xl" py={{ base: 14, md: 20 }}>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={5}>
        {FEATURES.map((feature) => (
          <Stack key={feature.title} bg="white" p={6} rounded="2xl" borderWidth="1px" borderColor="gray.200" gap={3}>
            <Flex w={11} h={11} rounded="xl" bg="brand.50" color="brand.700" align="center" justify="center">
              <feature.icon size={22} />
            </Flex>
            <Heading as="h3" size="md" color="ink.900">{feature.title}</Heading>
            <Text color="gray.600" fontSize="sm">{feature.text}</Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Container>

    <Box id="fares" bg="white" py={{ base: 14, md: 20 }} scrollMarginTop="64px">
      <Container maxW="5xl">
        <Stack gap={3} mb={8} textAlign="center">
          <Text color="brand.600" fontWeight={700} fontSize="sm" textTransform="uppercase" letterSpacing="wider">
            How fares work
          </Text>
          <Heading as="h2" size={{ base: "3xl", md: "4xl" }} color="ink.900">Base fare + per-kilometre rate</Heading>
          <Text color="gray.600" maxW="2xl" mx="auto">
            Your estimate is the base fare plus the distance charge for the driving route. Short trips never go below the
            minimum fare. Tolls, parking and waiting time are charged separately.
          </Text>
        </Stack>
        <Box overflowX="auto" borderWidth="1px" borderColor="gray.200" rounded="2xl">
          <Table.Root size="md" minW="560px">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Cab</Table.ColumnHeader>
                <Table.ColumnHeader>Seats</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Base fare</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Per km</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Minimum fare</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {CABS.map((cab) => (
                <Table.Row key={cab.id}>
                  <Table.Cell>
                    <Flex align="center" gap={3} fontWeight={700}>
                      <CarIcon color={cab.color} tall={cab.seats > 4} width={48} height={24} />
                      {cab.name}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>{cab.seats}</Table.Cell>
                  <Table.Cell textAlign="end">{formatPrice(cab.baseFare)}</Table.Cell>
                  <Table.Cell textAlign="end">₹{cab.perKm}</Table.Cell>
                  <Table.Cell textAlign="end">{formatPrice(cab.minFare)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Container>
    </Box>
  </Box>
);

export default About;
