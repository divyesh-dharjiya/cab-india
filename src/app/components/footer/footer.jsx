'use client';

import { Box, Text, Flex, useColorModeValue } from '@chakra-ui/react';

const getYear = new Date().getFullYear();
const Logo = () => {
  return (
    <h4>
      Cab India
    </h4>
  )
}

export default function Footer() {
  return (
    <Box
      color={useColorModeValue('gray.700', 'gray.200')}
      className="bg-white-900">
      <Box py={0}>
        <Flex
          align={'center'}
          _before={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('black.200', 'gray.700'),
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('black.200', 'gray.700'),
            flexGrow: 1,
            ml: 8,
          }}>
          <Logo />
        </Flex>
        <Text pt={2} fontSize={'lg'} textAlign={'center'} fontWeight={600}>
          © {getYear} CAB India. All rights reserved
        </Text>
      </Box>
    </Box>
  )
}