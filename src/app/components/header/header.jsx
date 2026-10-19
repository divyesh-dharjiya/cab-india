"use client";
import { useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Box, Container, Flex, HStack, IconButton, Link, Stack, Text } from "@chakra-ui/react";
import { Menu, X } from "lucide-react";
import Logo from "../../../../public/car.png";

const NAV_ITEMS = [
  { label: "Book a Ride", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const NavLink = ({ href, label, isActive, ...props }) => (
  <Link
    asChild
    px={3}
    py={2}
    rounded="md"
    fontWeight={600}
    color={isActive ? "brand.700" : "gray.600"}
    bg={isActive ? "brand.50" : "transparent"}
    _hover={{ textDecoration: "none", color: "gray.900", bg: "gray.100" }}
    {...props}
  >
    <NextLink href={href} aria-current={isActive ? "page" : undefined}>
      {label}
    </NextLink>
  </Link>
);

export default function Header() {
  const pathname = usePathname();
  // Remember which page the menu was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState(null);
  const isOpen = openOn === pathname;

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={1100}
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      boxShadow="xs"
    >
      <Container maxW="7xl">
        <Flex h={16} align="center" justify="space-between">
          <Link asChild display="flex" alignItems="center" gap={2} _hover={{ textDecoration: "none" }}>
            <NextLink href="/home">
              <Image src={Logo} width={40} height={40} alt="" preload />
              <Text fontSize="xl" fontWeight={800} letterSpacing="tight" color="gray.900">
                CAB <Text as="span" color="brand.500">India</Text>
              </Text>
            </NextLink>
          </Link>

          <HStack as="nav" gap={1} display={{ base: "none", md: "flex" }}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} isActive={pathname === item.href} />
            ))}
          </HStack>

          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={() => setOpenOn(isOpen ? null : pathname)}
            variant="ghost"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            {isOpen ? <X /> : <Menu />}
          </IconButton>
        </Flex>
      </Container>

      {isOpen && (
        <Stack as="nav" gap={1} px={4} pb={4} display={{ md: "none" }}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} isActive={pathname === item.href} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
