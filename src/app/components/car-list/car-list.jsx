"use client";
import { Badge, Box, Flex, HStack, Stack, Text, useRadio, useRadioGroup } from "@chakra-ui/react";
import { CABS, estimateFare } from "../../lib/fares";
import { formatPrice } from "../../lib/format";
import CarIcon from "./car-icon";

const CabOption = ({ cab, fare, isCheapest, ...radioProps }) => {
  const { getInputProps, getRadioProps, state } = useRadio(radioProps);

  return (
    <Box as="label" cursor="pointer" display="block">
      <input {...getInputProps()} />
      <Flex
        {...getRadioProps()}
        align="center"
        gap={{ base: 3, sm: 4 }}
        px={{ base: 3, sm: 4 }}
        py={3}
        border="2px solid"
        borderColor={state.isChecked ? "brand.400" : "gray.200"}
        bg={state.isChecked ? "brand.50" : "white"}
        rounded="xl"
        transition="all 0.15s"
        _hover={{ borderColor: state.isChecked ? "brand.400" : "gray.300" }}
        _focusVisible={{ boxShadow: "outline" }}
      >
        <CarIcon color={cab.color} tall={cab.seats > 4} style={{ flexShrink: 0 }} />
        <Stack spacing={0} flex={1} minW={0}>
          <HStack spacing={2}>
            <Text fontWeight={700}>{cab.name}</Text>
            {isCheapest && <Badge colorScheme="green" fontSize="0.65em">Best price</Badge>}
          </HStack>
          <Text fontSize="sm" color="gray.500" noOfLines={1}>
            {cab.seats} seats · {cab.description}
          </Text>
        </Stack>
        <Stack spacing={0} textAlign="right">
          <Text fontWeight={800} fontSize="lg">{formatPrice(fare)}</Text>
          <Text fontSize="xs" color="gray.500">₹{cab.perKm}/km</Text>
        </Stack>
      </Flex>
    </Box>
  );
};

const CarList = ({ distance, value, onChange }) => {
  const { getRootProps, getRadioProps } = useRadioGroup({ name: "cab", value, onChange });
  const fares = CABS.map((cab) => ({ cab, fare: estimateFare(cab, distance) }));
  const cheapest = Math.min(...fares.map(({ fare }) => fare));

  return (
    <Stack spacing={3} {...getRootProps()}>
      {fares.map(({ cab, fare }) => (
        <CabOption
          key={cab.id}
          cab={cab}
          fare={fare}
          isCheapest={fare === cheapest}
          {...getRadioProps({ value: cab.id })}
        />
      ))}
    </Stack>
  );
};

export default CarList;
