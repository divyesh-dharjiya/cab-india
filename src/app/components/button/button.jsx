"use client";
import { Button } from '@chakra-ui/react';
import React from 'react';

const ButtonComponent = ({handleChange, color, name}) => {
  return (
    <>
      <Button colorScheme={color} mt={5} mx={2} display={'inline'} onClick={handleChange}>{name}</Button>
    </>
  )
}

export default ButtonComponent