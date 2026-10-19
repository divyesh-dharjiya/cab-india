"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Alert,
  Box,
  Button,
  Card,
  CloseButton,
  Container,
  Dialog,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Portal,
  Separator,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
  Text,
} from "@chakra-ui/react";
import { ArrowUpDown, LocateFixed } from "lucide-react";
import LocationInput from "../components/location-input/location-input";
import CarList from "../components/car-list/car-list";
import { toaster } from "../components/toaster/toaster";
import { reversePlace } from "../lib/geocoding";
import { fetchRoute } from "../lib/routing";
import { CABS, estimateFare } from "../lib/fares";
import { formatDistance, formatDuration, formatPrice } from "../lib/format";
import { DROP_COLOR, PICKUP_COLOR } from "../lib/markers";

const Map = dynamic(() => import("../components/map-box/map"), {
  ssr: false,
  loading: () => <Skeleton h="100%" w="100%" />,
});

const samePosition = (a, b) => a.position[0] === b.position[0] && a.position[1] === b.position[1];
const routeKeyOf = (from, to) => (from && to ? `${from.position}|${to.position}` : null);

const Home = () => {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  // Last finished route lookup; only used while it matches the current pickup/drop.
  const [routeResult, setRouteResult] = useState({ key: null, route: null, error: "" });
  const [cabId, setCabId] = useState(CABS[0].id);
  const [isLocating, setIsLocating] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const routeKey = routeKeyOf(from, to);
  const isSameSpot = Boolean(from && to && samePosition(from, to));
  const current = routeResult.key === routeKey ? routeResult : null;
  const route = !isSameSpot ? current?.route ?? null : null;
  const routeStatus = !routeKey
    ? "idle"
    : isSameSpot || current?.error
      ? "error"
      : current
        ? "done"
        : "loading";
  const routeError = isSameSpot
    ? "Pickup and drop locations are the same. Please choose a different drop."
    : current?.error;

  useEffect(() => {
    if (!from || !to || samePosition(from, to)) return;
    const key = routeKeyOf(from, to);
    const controller = new AbortController();
    fetchRoute(from.position, to.position, controller.signal)
      .then((result) => setRouteResult({ key, route: result, error: "" }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        setRouteResult({
          key,
          route: null,
          error: error.message || "Couldn't calculate the route. Please try again.",
        });
      });
    return () => controller.abort();
  }, [from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      toaster.create({ type: "error", title: "Location is not supported by your browser." });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          setFrom(await reversePlace([coords.latitude, coords.longitude]));
        } catch (error) {
          toaster.create({ type: "error", title: "Couldn't use your location", description: error.message });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        toaster.create({ type: "error", title: "Couldn't get your location", description: error.message });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const selectedCab = CABS.find((cab) => cab.id === cabId);
  const fare = route ? estimateFare(selectedCab, route.distance) : 0;

  const placeBooking = () => {
    setIsConfirmOpen(false);
    toaster.create({
      type: "success",
      title: `${selectedCab.name} requested`,
      description: "This is a demo — no driver will actually be dispatched.",
      duration: 6000,
      closable: true,
    });
  };

  return (
    <Container maxW="7xl" py={{ base: 5, md: 8 }}>
      <Stack gap={1} mb={6}>
        <Heading size="2xl" color="gray.900">Book a cab anywhere in India</Heading>
        <Text color="gray.600">Enter your pickup and drop to see the route and compare fares.</Text>
      </Stack>

      <Grid
        templateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(380px, 440px) minmax(0, 1fr)" }}
        templateAreas={{ base: `"form" "map" "cabs"`, lg: `"form map" "cabs map"` }}
        templateRows={{ lg: "auto 1fr" }}
        gap={6}
      >
        <GridItem area="form">
          <Card.Root variant="outline" rounded="2xl" boxShadow="xs" bg="white">
            <Card.Body>
              <Stack gap={4}>
                <Flex gap={2} align="center">
                  <Stack gap={4} flex={1} minW={0}>
                    <LocationInput
                      label="Pickup"
                      placeholder="Where from?"
                      value={from}
                      onSelect={setFrom}
                      markerColor={PICKUP_COLOR}
                      markerLabel="A"
                    />
                    <LocationInput
                      label="Drop"
                      placeholder="Where to?"
                      value={to}
                      onSelect={setTo}
                      markerColor={DROP_COLOR}
                      markerLabel="B"
                    />
                  </Stack>
                  <IconButton
                    aria-label="Swap pickup and drop"
                    title="Swap pickup and drop"
                    variant="outline"
                    rounded="full"
                    mt={6}
                    onClick={swap}
                    disabled={!from && !to}
                  >
                    <ArrowUpDown />
                  </IconButton>
                </Flex>
                <Button
                  variant="plain"
                  colorPalette="blue"
                  color="blue.600"
                  alignSelf="flex-start"
                  size="sm"
                  px={0}
                  onClick={locateMe}
                  loading={isLocating}
                  loadingText="Finding your location…"
                >
                  <LocateFixed /> Use my current location as pickup
                </Button>
                <Text fontSize="xs" color="gray.500">Service available for locations within India only.</Text>
              </Stack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        <GridItem area="map" position={{ lg: "sticky" }} top={{ lg: "88px" }} alignSelf="start">
          <Box
            h={{ base: "50vh", lg: "calc(100vh - 120px)" }}
            minH="320px"
            rounded="2xl"
            overflow="hidden"
            borderWidth="1px"
            borderColor="gray.200"
            boxShadow="xs"
            position="relative"
            zIndex={0}
          >
            <Map from={from} to={to} route={route} />
          </Box>
        </GridItem>

        <GridItem area="cabs">
          {routeStatus === "idle" && (
            <Card.Root variant="outline" rounded="2xl" borderStyle="dashed" bg="white">
              <Card.Body textAlign="center" color="gray.500" py={10}>
                <Text fontSize="3xl" mb={2}>🚕</Text>
                <Text fontWeight={600}>Choose a pickup and drop</Text>
                <Text fontSize="sm">Fares for every cab type will appear here.</Text>
              </Card.Body>
            </Card.Root>
          )}

          {routeStatus === "error" && (
            <Alert.Root status="error" rounded="xl">
              <Alert.Indicator />
              <Alert.Title>{routeError}</Alert.Title>
            </Alert.Root>
          )}

          {routeStatus === "loading" && (
            <Stack gap={3}>
              <Skeleton h="80px" rounded="xl" />
              {CABS.map((cab) => <Skeleton key={cab.id} h="72px" rounded="xl" />)}
            </Stack>
          )}

          {routeStatus === "done" && route && (
            <Card.Root variant="outline" rounded="2xl" boxShadow="xs" bg="white">
              <Card.Body>
                <SimpleGrid columns={2} gap={4} mb={4}>
                  <Stat.Root bg="gray.50" rounded="xl" px={4} py={3}>
                    <Stat.Label>Distance</Stat.Label>
                    <Stat.ValueText fontSize="xl">{formatDistance(route.distance)}</Stat.ValueText>
                  </Stat.Root>
                  <Stat.Root bg="gray.50" rounded="xl" px={4} py={3}>
                    <Stat.Label>Est. travel time</Stat.Label>
                    <Stat.ValueText fontSize="xl">{formatDuration(route.duration)}</Stat.ValueText>
                  </Stat.Root>
                </SimpleGrid>
                <Heading size="md" mb={3}>Choose your ride</Heading>
                <CarList distance={route.distance} value={cabId} onChange={setCabId} />
                <Separator my={4} />
                <Button size="lg" w="100%" colorPalette="brand" onClick={() => setIsConfirmOpen(true)}>
                  Book {selectedCab.name} · {formatPrice(fare)}
                </Button>
                <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
                  Estimated fare. Tolls, parking and waiting charges are extra.
                </Text>
              </Card.Body>
            </Card.Root>
          )}
        </GridItem>
      </Grid>

      <Dialog.Root
        open={isConfirmOpen && Boolean(route)}
        onOpenChange={(details) => setIsConfirmOpen(details.open)}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner px={4}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Confirm your ride</Dialog.Title>
              </Dialog.Header>
              {route && (
                <Dialog.Body>
                  <Stack gap={3} fontSize="sm">
                    <Box>
                      <Text color="gray.500">Pickup</Text>
                      <Text fontWeight={600}>{from?.label}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500">Drop</Text>
                      <Text fontWeight={600}>{to?.label}</Text>
                    </Box>
                    <Separator />
                    <Flex justify="space-between"><Text>Cab</Text><Text fontWeight={600}>{selectedCab.name}</Text></Flex>
                    <Flex justify="space-between"><Text>Distance</Text><Text fontWeight={600}>{formatDistance(route.distance)}</Text></Flex>
                    <Flex justify="space-between"><Text>Travel time</Text><Text fontWeight={600}>{formatDuration(route.duration)}</Text></Flex>
                    <Flex justify="space-between" fontSize="lg">
                      <Text fontWeight={700}>Estimated fare</Text>
                      <Text fontWeight={800}>{formatPrice(fare)}</Text>
                    </Flex>
                  </Stack>
                </Dialog.Body>
              )}
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="ghost">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button colorPalette="brand" onClick={placeBooking}>Confirm booking</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Container>
  );
};

export default Home;
