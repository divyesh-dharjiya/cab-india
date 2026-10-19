"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import LocationInput from "../components/location-input/location-input";
import CarList from "../components/car-list/car-list";
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

const Home = () => {
  const toast = useToast();
  const confirm = useDisclosure();
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeStatus, setRouteStatus] = useState("idle"); // idle | loading | done | error
  const [routeError, setRouteError] = useState("");
  const [cabId, setCabId] = useState(CABS[0].id);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    setRoute(null);
    setRouteError("");
    if (!from || !to) {
      setRouteStatus("idle");
      return;
    }
    if (samePosition(from, to)) {
      setRouteStatus("error");
      setRouteError("Pickup and drop locations are the same. Please choose a different drop.");
      return;
    }
    const controller = new AbortController();
    setRouteStatus("loading");
    fetchRoute(from.position, to.position, controller.signal)
      .then((result) => {
        setRoute(result);
        setRouteStatus("done");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setRouteStatus("error");
        setRouteError(error.message || "Couldn't calculate the route. Please try again.");
      });
    return () => controller.abort();
  }, [from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      toast({ status: "error", title: "Location is not supported by your browser." });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          setFrom(await reversePlace([coords.latitude, coords.longitude]));
        } catch (error) {
          toast({ status: "error", title: "Couldn't use your location", description: error.message });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        toast({ status: "error", title: "Couldn't get your location", description: error.message });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const selectedCab = CABS.find((cab) => cab.id === cabId);

  const placeBooking = () => {
    confirm.onClose();
    toast({
      status: "success",
      title: `${selectedCab.name} requested`,
      description: "This is a demo — no driver will actually be dispatched.",
      duration: 6000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="7xl" py={{ base: 5, md: 8 }}>
      <Stack spacing={1} mb={6}>
        <Heading size="lg">Book a cab anywhere in India</Heading>
        <Text color="gray.600">Enter your pickup and drop to see the route and compare fares.</Text>
      </Stack>

      <Grid
        templateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(380px, 440px) minmax(0, 1fr)" }}
        templateAreas={{ base: `"form" "map" "cabs"`, lg: `"form map" "cabs map"` }}
        templateRows={{ lg: "auto 1fr" }}
        gap={6}
      >
        <GridItem area="form">
          <Card variant="outline" rounded="2xl" boxShadow="sm">
            <CardBody>
              <Stack spacing={4}>
                <Flex gap={2} align="flex-end">
                  <Stack spacing={4} flex={1} minW={0}>
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
                  <Tooltip label="Swap pickup and drop" hasArrow>
                    <IconButton
                      icon={<ArrowUpDownIcon />}
                      aria-label="Swap pickup and drop"
                      variant="outline"
                      colorScheme="gray"
                      rounded="full"
                      mb={10}
                      onClick={swap}
                      isDisabled={!from && !to}
                    />
                  </Tooltip>
                </Flex>
                <Button
                  variant="link"
                  colorScheme="blue"
                  alignSelf="flex-start"
                  size="sm"
                  onClick={locateMe}
                  isLoading={isLocating}
                  loadingText="Finding your location…"
                >
                  ◎ Use my current location as pickup
                </Button>
                <Text fontSize="xs" color="gray.500">Service available for locations within India only.</Text>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem area="map" position={{ lg: "sticky" }} top={{ lg: "88px" }} alignSelf="start">
          <Box
            h={{ base: "50vh", lg: "calc(100vh - 120px)" }}
            minH="320px"
            rounded="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
            position="relative"
            zIndex={0}
          >
            <Map from={from} to={to} route={route} />
          </Box>
        </GridItem>

        <GridItem area="cabs">
          {routeStatus === "idle" && (
            <Card variant="outline" rounded="2xl" borderStyle="dashed">
              <CardBody textAlign="center" color="gray.500" py={10}>
                <Text fontSize="3xl" mb={2}>🚕</Text>
                <Text fontWeight={600}>Choose a pickup and drop</Text>
                <Text fontSize="sm">Fares for every cab type will appear here.</Text>
              </CardBody>
            </Card>
          )}

          {routeStatus === "error" && (
            <Alert status="error" rounded="xl">
              <AlertIcon />
              <AlertDescription>{routeError}</AlertDescription>
            </Alert>
          )}

          {routeStatus === "loading" && (
            <Stack spacing={3}>
              <Skeleton h="80px" rounded="xl" />
              {CABS.map((cab) => <Skeleton key={cab.id} h="72px" rounded="xl" />)}
            </Stack>
          )}

          {routeStatus === "done" && route && (
            <Card variant="outline" rounded="2xl" boxShadow="sm">
              <CardBody>
                <SimpleGrid columns={2} spacing={4} mb={4}>
                  <Stat bg="gray.50" rounded="xl" px={4} py={3}>
                    <StatLabel color="gray.500">Distance</StatLabel>
                    <StatNumber fontSize="xl">{formatDistance(route.distance)}</StatNumber>
                  </Stat>
                  <Stat bg="gray.50" rounded="xl" px={4} py={3}>
                    <StatLabel color="gray.500">Est. travel time</StatLabel>
                    <StatNumber fontSize="xl">{formatDuration(route.duration)}</StatNumber>
                  </Stat>
                </SimpleGrid>
                <Heading size="sm" mb={3}>Choose your ride</Heading>
                <CarList distance={route.distance} value={cabId} onChange={setCabId} />
                <Divider my={4} />
                <Button size="lg" w="100%" onClick={confirm.onOpen}>
                  Book {selectedCab.name} · {formatPrice(estimateFare(selectedCab, route.distance))}
                </Button>
                <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
                  Estimated fare. Tolls, parking and waiting charges are extra.
                </Text>
              </CardBody>
            </Card>
          )}
        </GridItem>
      </Grid>

      {route && (
        <Modal isOpen={confirm.isOpen} onClose={confirm.onClose} isCentered>
          <ModalOverlay />
          <ModalContent mx={4}>
            <ModalHeader>Confirm your ride</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3} fontSize="sm">
                <Box>
                  <Text color="gray.500">Pickup</Text>
                  <Text fontWeight={600}>{from?.label}</Text>
                </Box>
                <Box>
                  <Text color="gray.500">Drop</Text>
                  <Text fontWeight={600}>{to?.label}</Text>
                </Box>
                <Divider />
                <Flex justify="space-between"><Text>Cab</Text><Text fontWeight={600}>{selectedCab.name}</Text></Flex>
                <Flex justify="space-between"><Text>Distance</Text><Text fontWeight={600}>{formatDistance(route.distance)}</Text></Flex>
                <Flex justify="space-between"><Text>Travel time</Text><Text fontWeight={600}>{formatDuration(route.duration)}</Text></Flex>
                <Flex justify="space-between" fontSize="lg">
                  <Text fontWeight={700}>Estimated fare</Text>
                  <Text fontWeight={800}>{formatPrice(estimateFare(selectedCab, route.distance))}</Text>
                </Flex>
              </Stack>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button variant="ghost" colorScheme="gray" onClick={confirm.onClose}>Cancel</Button>
              <Button onClick={placeBooking}>Confirm booking</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Home;
