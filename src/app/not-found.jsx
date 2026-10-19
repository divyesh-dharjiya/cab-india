"use client";
import NextLink from "next/link";
import { Button, Center, Heading, Stack, Text } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Center minH="70vh" px={4}>
      <Stack gap={4} align="center" textAlign="center">
        <Text fontFamily="heading" fontWeight={800} fontSize={{ base: "7xl", md: "9xl" }} lineHeight={1} color="brand.400">
          404
        </Text>
        <Heading as="h1" size="2xl" color="ink.900">This road doesn&apos;t go anywhere</Heading>
        <Text color="gray.600" maxW="md">The page you&apos;re looking for doesn&apos;t exist or has moved.</Text>
        <Button asChild colorPalette="brand" rounded="xl" size="lg" mt={2}>
          <NextLink href="/home"><ArrowLeft /> Back to booking</NextLink>
        </Button>
      </Stack>
    </Center>
  );
}
