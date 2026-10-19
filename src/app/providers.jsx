"use client";
import { ChakraProvider } from "@chakra-ui/react";
import system from "./theme";
import AppToaster from "./components/toaster/toaster";

export default function Providers({ children }) {
  return (
    <ChakraProvider value={system}>
      {children}
      <AppToaster />
    </ChakraProvider>
  );
}
