"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Flex, Text } from "@chakra-ui/react";
import Logo from "../../../../public/car.png";

const STORAGE_KEY = "cab-india:splash-seen";

// Shown once per browser session as an overlay, so the page underneath keeps loading.
export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage can be unavailable (private mode); just show the splash.
    }
    if (seen) return;
    setIsVisible(true);
    const timeout = setTimeout(() => setIsVisible(false), 1800);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: "fixed", inset: 0, zIndex: 2000 }}
        >
          <Flex h="100%" direction="column" align="center" justify="center" bg="white" gap={6}>
            <motion.div
              initial={{ x: -160, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
            >
              <Image src={Logo} width={160} height={160} alt="" priority />
            </motion.div>
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <Text fontSize="3xl" fontWeight={800}>
                CAB <Text as="span" color="brand.500">India</Text>
              </Text>
              <Text color="gray.500" textAlign="center">Your ride, anywhere in India</Text>
            </motion.div>
          </Flex>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
