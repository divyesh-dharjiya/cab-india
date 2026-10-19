"use client";
import { useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Box, Button, Container, Flex, HStack, IconButton, Link, Stack, Text } from "@chakra-ui/react";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "../../../../public/car.png";

const NAV_ITEMS = [
  { label: "Book a Ride", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const BrandMark = ({ dark = false }) => (
  <HStack gap={2}>
    <Flex w={10} h={10} rounded="xl" bg="brand.50" align="center" justify="center">
      <Image src={Logo} width={30} height={30} alt="" preload />
    </Flex>
    <Text fontFamily="heading" fontSize="xl" fontWeight={800} letterSpacing="tight" color={dark ? "white" : "ink.900"}>
      CAB <Text as="span" color="brand.500">India</Text>
    </Text>
  </HStack>
);

const NavLink = ({ href, label, isActive, mobile }) => (
  <Link
    asChild
    position="relative"
    px={3}
    py={2}
    rounded="lg"
    fontWeight={600}
    fontSize={mobile ? "md" : "sm"}
    color={isActive ? "ink.900" : "gray.600"}
    bg={mobile && isActive ? "brand.50" : "transparent"}
    _hover={{ textDecoration: "none", color: "ink.900", bg: "gray.100" }}
    _after={
      !mobile && isActive
        ? { content: '""', position: "absolute", left: 3, right: 3, bottom: "-13px", h: "3px", roundedTop: "full", bg: "brand.500" }
        : undefined
    }
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
      bg="rgba(255,255,255,0.88)"
      backdropFilter="saturate(180%) blur(12px)"
      borderBottomWidth="1px"
      borderColor="gray.200"
    >
      <Container maxW="full" px={{ base: 4, md: 6 }}>
        <Flex h={16} align="center" justify="space-between" gap={6}>
          <Link asChild _hover={{ textDecoration: "none" }} aria-label="CAB India home">
            <NextLink href="/home">
              <BrandMark />
            </NextLink>
          </Link>

          <HStack as="nav" gap={1} display={{ base: "none", md: "flex" }} aria-label="Main">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} isActive={pathname === item.href} />
            ))}
          </HStack>

          <Button
            asChild
            display={{ base: "none", md: "inline-flex" }}
            size="sm"
            rounded="full"
            bg="ink.900"
            color="white"
            _hover={{ bg: "ink.700" }}
            px={4}
          >
            <NextLink href="/home">
              Get a fare estimate <ArrowRight />
            </NextLink>
          </Button>

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
        <Stack as="nav" gap={1} px={4} pb={4} display={{ md: "none" }} aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} isActive={pathname === item.href} mobile />
          ))}
        </Stack>
      )}
    </Box>
  );
}
