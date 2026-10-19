"use client";
import { Center, Spinner } from "@chakra-ui/react";

const Loading = () => (
  <Center minH="60vh">
    <Spinner size="xl" color="brand.500" thickness="4px" />
  </Center>
);

export default Loading;
