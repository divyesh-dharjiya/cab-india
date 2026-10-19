"use client";
import { Badge, HStack, RadioCard, Stack, Text } from "@chakra-ui/react";
import { CABS, estimateFare } from "../../lib/fares";
import { formatPrice } from "../../lib/format";
import CarIcon from "./car-icon";

const CarList = ({ distance, value, onChange }) => {
  const fares = CABS.map((cab) => ({ cab, fare: estimateFare(cab, distance) }));
  const cheapest = Math.min(...fares.map(({ fare }) => fare));

  return (
    <RadioCard.Root
      value={value}
      onValueChange={(details) => onChange(details.value)}
      variant="outline"
      colorPalette="brand"
      name="cab"
    >
      <RadioCard.Label srOnly>Choose your ride</RadioCard.Label>
      <Stack gap={3}>
        {fares.map(({ cab, fare }) => (
          <RadioCard.Item
            key={cab.id}
            value={cab.id}
            rounded="xl"
            cursor="pointer"
            _checked={{ bg: "brand.50" }}
          >
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl alignItems="center" gap={{ base: 3, sm: 4 }} px={{ base: 3, sm: 4 }} py={3}>
              <CarIcon color={cab.color} tall={cab.seats > 4} style={{ flexShrink: 0 }} />
              <Stack gap={0} flex={1} minW={0}>
                <HStack gap={2}>
                  <RadioCard.ItemText fontWeight={700}>{cab.name}</RadioCard.ItemText>
                  {fare === cheapest && (
                    <Badge colorPalette="green" size="sm">Best price</Badge>
                  )}
                </HStack>
                <Text fontSize="sm" color="gray.500" lineClamp={1}>
                  {cab.seats} seats · {cab.description}
                </Text>
              </Stack>
              <Stack gap={0} textAlign="right">
                <Text fontWeight={800} fontSize="lg">{formatPrice(fare)}</Text>
                <Text fontSize="xs" color="gray.500">₹{cab.perKm}/km</Text>
              </Stack>
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </Stack>
    </RadioCard.Root>
  );
};

export default CarList;
