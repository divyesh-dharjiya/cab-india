"use client";
import { Badge, HStack, RadioCard, Stack, Text } from "@chakra-ui/react";
import { Briefcase, Users } from "lucide-react";
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
      <Stack gap={2}>
        {fares.map(({ cab, fare }) => (
          <RadioCard.Item
            key={cab.id}
            value={cab.id}
            rounded="xl"
            cursor="pointer"
            borderColor="gray.200"
            transition="background 0.15s, border-color 0.15s"
            _hover={{ borderColor: "gray.300" }}
            _checked={{ bg: "brand.50", borderColor: "brand.500" }}
          >
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl alignItems="center" gap={3} px={3} py={3}>
              <CarIcon color={cab.color} tall={cab.seats > 4} style={{ flexShrink: 0 }} />
              <Stack gap={0.5} flex={1} minW={0}>
                <HStack gap={2}>
                  <RadioCard.ItemText fontWeight={700} fontSize="md">{cab.name}</RadioCard.ItemText>
                  {fare === cheapest && <Badge colorPalette="green" size="sm" rounded="full">Best price</Badge>}
                </HStack>
                <HStack gap={3} fontSize="xs" color="gray.500">
                  <HStack gap={1}><Users size={13} /> {cab.seats}</HStack>
                  <HStack gap={1}><Briefcase size={13} /> {cab.bags}</HStack>
                  <Text lineClamp={1}>{cab.description}</Text>
                </HStack>
              </Stack>
              <Text fontWeight={800} fontSize="lg" fontFamily="heading" whiteSpace="nowrap">
                {formatPrice(fare)}
              </Text>
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </Stack>
    </RadioCard.Root>
  );
};

export default CarList;
