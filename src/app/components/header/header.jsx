"use client";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Box,
  Collapse,
  Container,
  Flex,
  HStack,
  IconButton,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import Logo from "../../../../public/car.png";

const NAV_ITEMS = [
  { label: "Book a Ride", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const NavLink = ({ href, label, isActive, ...props }) => (
  <Link
    as={NextLink}
    href={href}
    px={3}
    py={2}
    rounded="md"
    fontWeight={600}
    color={isActive ? "brand.700" : "gray.600"}
    bg={isActive ? "brand.50" : "transparent"}
    _hover={{ textDecoration: "none", color: "gray.900", bg: "gray.100" }}
    aria-current={isActive ? "page" : undefined}
    {...props}
  >
    {label}
  </Link>
);

export default function Header() {
  const pathname = usePathname();
  const { isOpen, onToggle, onClose } = useDisclosure();

  // Close the mobile menu after navigating.
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={1100}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
    >
      <Container maxW="7xl">
        <Flex h={16} align="center" justify="space-between">
          <Link as={NextLink} href="/home" display="flex" alignItems="center" gap={2} _hover={{ textDecoration: "none" }}>
            <Image src={Logo} width={40} height={40} alt="" priority />
            <Text fontSize="xl" fontWeight={800} letterSpacing="tight">
              CAB <Text as="span" color="brand.500">India</Text>
            </Text>
          </Link>

          <HStack as="nav" spacing={1} display={{ base: "none", md: "flex" }}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} isActive={pathname === item.href} />
            ))}
          </HStack>

          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            colorScheme="gray"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          />
        </Flex>
      </Container>

      <Collapse in={isOpen} animateOpacity>
        <Stack as="nav" spacing={1} px={4} pb={4} display={{ md: "none" }}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} isActive={pathname === item.href} />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}
