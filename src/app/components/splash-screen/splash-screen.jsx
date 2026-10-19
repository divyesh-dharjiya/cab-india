"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Flex, Text } from "@chakra-ui/react";
import Logo from "../../../../public/car.png";

const STORAGE_KEY = "cab-india:splash-seen";
const DURATION_MS = 1800;

// Inlined in <head>: marks the document when the splash was already shown this session.
export const SPLASH_SCRIPT = `try{var s=sessionStorage;if(s.getItem("${STORAGE_KEY}"))document.documentElement.setAttribute("data-splash-seen","");s.setItem("${STORAGE_KEY}","1")}catch(e){}`;

// Shown once per browser session as an overlay, so the page underneath keeps loading.
export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const seen = document.documentElement.hasAttribute("data-splash-seen");
    const timeout = setTimeout(() => setIsVisible(false), seen ? 0 : DURATION_MS);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          className="splash-screen"
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
              <Image src={Logo} width={160} height={160} alt="" preload />
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
