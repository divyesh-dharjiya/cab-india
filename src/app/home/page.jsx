"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Alert,
  Box,
  Button,
  CloseButton,
  Container,
  Dialog,
  Flex,
  Heading,
  HStack,
  IconButton,
  Portal,
  Separator,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowUpDown, ChevronRight, Clock, Flag, LocateFixed, MapPinned, Route, Search, Wallet } from "lucide-react";
import LocationInput from "../components/location-input/location-input";
import CarList from "../components/car-list/car-list";
import CarIcon from "../components/car-list/car-icon";
import { toaster } from "../components/toaster/toaster";
import { reversePlace } from "../lib/geocoding";
import { fetchRoute } from "../lib/routing";
import { CABS, fareBreakdown } from "../lib/fares";
import { formatClockTime, formatDistance, formatDuration, formatPrice } from "../lib/format";
import { DROP_COLOR, PICKUP_COLOR } from "../lib/markers";
import { POPULAR_ROUTES } from "../lib/popular-routes";

const PANEL_WIDTH = 420;
const PANEL_OFFSET = 24;

const Map = dynamic(() => import("../components/map-box/map"), {
  ssr: false,
  loading: () => <Skeleton h="100%" w="100%" />,
});

const samePosition = (a, b) => a.position[0] === b.position[0] && a.position[1] === b.position[1];
const routeKeyOf = (from, to) => (from && to ? `${from.position}|${to.position}` : null);

const STEPS = [
  { icon: Search, title: "Search your trip", text: "Type a pickup and drop anywhere in India, or use your current location." },
  { icon: Route, title: "See the real route", text: "We plot the driving route and work out the distance and travel time." },
  { icon: Wallet, title: "Pick a fare", text: "Compare upfront prices for five cab types and book the one that fits." },
];

const TripStat = ({ icon: Icon, label, value }) => (
  <Stack gap={1} bg="gray.50" rounded="xl" px={3} py={2.5} minW={0}>
    <HStack gap={1.5} color="gray.500" fontSize="xs" fontWeight={600}>
      <Icon size={13} /> {label}
    </HStack>
    <Text fontWeight={800} fontFamily="heading" fontSize="md" lineClamp={1}>{value}</Text>
  </Stack>
);

const SectionHeading = ({ eyebrow, title, text }) => (
  <Stack gap={3} textAlign="center" maxW="2xl" mx="auto" mb={{ base: 10, md: 14 }}>
    <Text color="brand.600" fontWeight={700} fontSize="sm" textTransform="uppercase" letterSpacing="wider">
      {eyebrow}
    </Text>
    <Heading as="h2" size={{ base: "3xl", md: "4xl" }} color="ink.900">{title}</Heading>
    {text && <Text color="gray.600" fontSize="lg">{text}</Text>}
  </Stack>
);

const Home = () => {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  // Last finished route lookup; only used while it matches the current pickup/drop.
  const [routeResult, setRouteResult] = useState({ key: null, route: null, error: "" });
  const [cabId, setCabId] = useState(CABS[0].id);
  const [isLocating, setIsLocating] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const mapInset = useBreakpointValue({ base: 0, lg: PANEL_WIDTH + PANEL_OFFSET }) ?? 0;

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
    ? "Pickup and drop are the same place. Please choose a different drop."
    : current?.error;

  useEffect(() => {
    if (!from || !to || samePosition(from, to)) return;
    const key = routeKeyOf(from, to);
    const controller = new AbortController();
    fetchRoute(from.position, to.position, controller.signal)
      .then((result) => setRouteResult({ key, route: { ...result, fetchedAt: Date.now() }, error: "" }))
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
  const fare = route ? fareBreakdown(selectedCab, route.distance) : null;

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
    <>
      <Box
        as="section"
        aria-label="Book a ride"
        position="relative"
        h={{ lg: "calc(100dvh - 65px)" }}
        minH={{ lg: "680px" }}
      >
        <Box position={{ base: "relative", lg: "absolute" }} inset={{ lg: 0 }} h={{ base: "42vh", lg: "auto" }} minH="280px" zIndex={0}>
          <Map from={from} to={to} route={route} insetLeft={mapInset} />
        </Box>

        <Flex
          direction="column"
          position={{ base: "relative", lg: "absolute" }}
          top={{ lg: `${PANEL_OFFSET}px` }}
          left={{ lg: `${PANEL_OFFSET}px` }}
          bottom={{ lg: `${PANEL_OFFSET}px` }}
          w={{ lg: `${PANEL_WIDTH}px` }}
          mt={{ base: -6, lg: 0 }}
          zIndex={1}
          bg="white"
          roundedTop="3xl"
          rounded={{ lg: "3xl" }}
          boxShadow="0 24px 60px -12px rgba(11, 15, 25, 0.35)"
          overflow={{ lg: "hidden" }}
        >
          <Box flex={1} overflowY={{ lg: "auto" }} px={{ base: 5, md: 6 }} pt={6} pb={5}>
            <Stack gap={1} mb={5}>
              <Heading as="h1" size="2xl" color="ink.900">Where to today?</Heading>
              <Text color="gray.600" fontSize="sm">Upfront fares for rides anywhere in India.</Text>
            </Stack>

            <Flex gap={2} align="center">
              <Box position="relative" flex={1} minW={0}>
                <Stack gap={3}>
                  <LocationInput
                    label="Pickup"
                    placeholder="Pickup location"
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
                {/* Dotted connector between the A and B markers. */}
                <Box
                  position="absolute"
                  left="23px"
                  top="38px"
                  h="34px"
                  borderLeftWidth="2px"
                  borderLeftStyle="dotted"
                  borderColor="gray.400"
                  pointerEvents="none"
                  zIndex={3}
                />
              </Box>
              <IconButton
                aria-label="Swap pickup and drop"
                title="Swap pickup and drop"
                variant="outline"
                rounded="full"
                size="sm"
                onClick={swap}
                disabled={!from && !to}
              >
                <ArrowUpDown />
              </IconButton>
            </Flex>

            <Button
              variant="plain"
              color="blue.600"
              size="sm"
              px={0}
              mt={2}
              onClick={locateMe}
              loading={isLocating}
              loadingText="Finding your location…"
            >
              <LocateFixed /> Use my current location
            </Button>

            <Separator my={5} />

            {routeStatus === "idle" && (
              <Stack gap={2}>
                <Text fontSize="xs" fontWeight={700} color="gray.500" textTransform="uppercase" letterSpacing="wider">
                  Popular routes
                </Text>
                {POPULAR_ROUTES.map((trip) => (
                  <Button
                    key={trip.from.id}
                    variant="ghost"
                    justifyContent="space-between"
                    h="auto"
                    py={3}
                    px={3}
                    rounded="xl"
                    fontWeight={600}
                    onClick={() => {
                      setFrom(trip.from);
                      setTo(trip.to);
                    }}
                  >
                    <HStack gap={3}>
                      <Flex w={9} h={9} rounded="lg" bg="brand.50" color="brand.700" align="center" justify="center">
                        <MapPinned size={18} />
                      </Flex>
                      <Text>{trip.from.name} → {trip.to.name}</Text>
                    </HStack>
                    <ChevronRight />
                  </Button>
                ))}
              </Stack>
            )}

            {routeStatus === "error" && (
              <Alert.Root status="error" rounded="xl">
                <Alert.Indicator />
                <Alert.Title>{routeError}</Alert.Title>
              </Alert.Root>
            )}

            {routeStatus === "loading" && (
              <Stack gap={2} aria-label="Calculating route">
                <SimpleGrid columns={3} gap={2}>
                  <Skeleton h="60px" rounded="xl" />
                  <Skeleton h="60px" rounded="xl" />
                  <Skeleton h="60px" rounded="xl" />
                </SimpleGrid>
                {CABS.map((cab) => <Skeleton key={cab.id} h="70px" rounded="xl" />)}
              </Stack>
            )}

            {routeStatus === "done" && route && (
              <Stack gap={4}>
                <SimpleGrid columns={3} gap={2}>
                  <TripStat icon={Route} label="Distance" value={formatDistance(route.distance)} />
                  <TripStat icon={Clock} label="Duration" value={formatDuration(route.duration)} />
                  <TripStat icon={Flag} label="Arrive by" value={formatClockTime(route.fetchedAt + route.duration * 1000)} />
                </SimpleGrid>
                <Heading as="h2" size="md" color="ink.900">Choose a ride</Heading>
                <CarList distance={route.distance} value={cabId} onChange={setCabId} />
                <Text fontSize="xs" color="gray.500">Estimated fares. Tolls, parking and waiting charges are extra.</Text>
              </Stack>
            )}
          </Box>

          {routeStatus === "done" && route && (
            <Flex
              position={{ base: "sticky", lg: "static" }}
              bottom={0}
              align="center"
              gap={4}
              px={{ base: 5, md: 6 }}
              py={4}
              bg="white"
              borderTopWidth="1px"
              borderColor="gray.100"
              roundedBottom={{ lg: "3xl" }}
            >
              <Stack gap={0} flex={1} minW={0}>
                <Text fontSize="xs" color="gray.500" fontWeight={600}>{selectedCab.name} · estimated</Text>
                <Text fontSize="2xl" fontWeight={800} fontFamily="heading" lineHeight={1.1}>{formatPrice(fare.total)}</Text>
              </Stack>
              <Button size="lg" colorPalette="brand" rounded="xl" px={8} onClick={() => setIsConfirmOpen(true)}>
                Book {selectedCab.name}
              </Button>
            </Flex>
          )}
        </Flex>
      </Box>

      <Box as="section" py={{ base: 16, md: 24 }} bg="white">
        <Container maxW="6xl">
          <SectionHeading eyebrow="How it works" title="From search to seat in three steps" />
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {STEPS.map((step, index) => (
              <Stack key={step.title} gap={4} p={7} rounded="2xl" bg="gray.50" position="relative">
                <Text position="absolute" top={5} right={6} fontFamily="heading" fontWeight={800} fontSize="4xl" color="gray.200">
                  0{index + 1}
                </Text>
                <Flex w={12} h={12} rounded="xl" bg="ink.900" color="brand.400" align="center" justify="center">
                  <step.icon size={22} />
                </Flex>
                <Heading as="h3" size="lg" color="ink.900">{step.title}</Heading>
                <Text color="gray.600">{step.text}</Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box as="section" py={{ base: 16, md: 24 }}>
        <Container maxW="6xl">
          <SectionHeading
            eyebrow="Ride types"
            title="A cab for every kind of trip"
            text="Simple, transparent pricing: a base fare plus a fixed rate per kilometre."
          />
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 5 }} gap={4}>
            {CABS.map((cab) => (
              <Stack key={cab.id} gap={3} p={5} rounded="2xl" bg="white" borderWidth="1px" borderColor="gray.200" align="flex-start">
                <Flex w="100%" h={16} rounded="xl" bg="gray.50" align="center" justify="center">
                  <CarIcon color={cab.color} tall={cab.seats > 4} width={88} height={44} />
                </Flex>
                <Heading as="h3" size="md" color="ink.900">{cab.name}</Heading>
                <Text fontSize="sm" color="gray.600">{cab.description}</Text>
                <Text fontSize="sm" color="gray.500">Up to {cab.seats} riders · {cab.bags} bags</Text>
                <Text fontWeight={800} fontFamily="heading" color="ink.900">
                  ₹{cab.perKm}<Text as="span" fontWeight={500} color="gray.500" fontSize="sm">/km</Text>
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Dialog.Root
        open={isConfirmOpen && Boolean(route)}
        onOpenChange={(details) => setIsConfirmOpen(details.open)}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner px={4}>
            <Dialog.Content rounded="2xl">
              <Dialog.Header>
                <Dialog.Title fontFamily="heading">Confirm your ride</Dialog.Title>
              </Dialog.Header>
              {route && fare && (
                <Dialog.Body>
                  <Stack gap={4} fontSize="sm">
                    <Stack gap={3} position="relative" pl={7}>
                      <Box position="absolute" left="7px" top="18px" bottom="18px" borderLeftWidth="2px" borderLeftStyle="dotted" borderColor="gray.400" />
                      <Box>
                        <Box position="absolute" left={0} mt={1} w={4} h={4} rounded="full" bg={PICKUP_COLOR} borderWidth="3px" borderColor="white" boxShadow="sm" />
                        <Text color="gray.500" fontSize="xs">Pickup</Text>
                        <Text fontWeight={600}>{from?.label}</Text>
                      </Box>
                      <Box>
                        <Box position="absolute" left={0} mt={1} w={4} h={4} rounded="full" bg={DROP_COLOR} borderWidth="3px" borderColor="white" boxShadow="sm" />
                        <Text color="gray.500" fontSize="xs">Drop</Text>
                        <Text fontWeight={600}>{to?.label}</Text>
                      </Box>
                    </Stack>
                    <Stack gap={2} bg="gray.50" rounded="xl" p={4}>
                      <Flex justify="space-between">
                        <Text color="gray.600">{selectedCab.name} · {formatDistance(route.distance)} · {formatDuration(route.duration)}</Text>
                      </Flex>
                      <Separator />
                      <Flex justify="space-between"><Text>Base fare</Text><Text>{formatPrice(fare.baseFare)}</Text></Flex>
                      <Flex justify="space-between">
                        <Text>Distance (₹{selectedCab.perKm}/km)</Text>
                        <Text>{formatPrice(fare.distanceCharge)}</Text>
                      </Flex>
                      {fare.minimumApplied && (
                        <Flex justify="space-between" color="gray.600">
                          <Text>Minimum fare applied</Text><Text>{formatPrice(selectedCab.minFare)}</Text>
                        </Flex>
                      )}
                      <Separator />
                      <Flex justify="space-between" fontSize="lg" fontWeight={800} fontFamily="heading">
                        <Text>Estimated total</Text>
                        <Text>{formatPrice(fare.total)}</Text>
                      </Flex>
                    </Stack>
                  </Stack>
                </Dialog.Body>
              )}
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="ghost" rounded="xl">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button colorPalette="brand" rounded="xl" onClick={placeBooking}>Confirm booking</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default Home;
