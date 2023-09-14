"use client";
import { Button } from '@chakra-ui/react';
import React from 'react';

const ButtonComponent = ({handleChange}) => {
  return (
    <div>
      <Button colorScheme='blue' margin={'0 auto'} mt={5} display={'block'} onClick={handleChange}>Book</Button>
    </div>
  )
}

export default ButtonComponent