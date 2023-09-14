"use client";
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

const Chakra = ({ children }) => {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  )
}

export default Chakra