"use client";
import { Center, Spinner } from "@chakra-ui/react";

const Loading = () => (
  <Center minH="60vh">
    <Spinner size="xl" color="brand.500" borderWidth="4px" />
  </Center>
);

export default Loading;
