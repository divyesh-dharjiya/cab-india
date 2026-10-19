import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: false },
  fonts: {
    heading: "var(--font-inter), system-ui, sans-serif",
    body: "var(--font-inter), system-ui, sans-serif",
  },
  colors: {
    brand: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      200: "#FDE68A",
      300: "#FCD34D",
      400: "#FBBF24",
      500: "#F59E0B",
      600: "#D97706",
      700: "#B45309",
      800: "#92400E",
      900: "#78350F",
    },
  },
  styles: {
    global: {
      body: { bg: "gray.50", color: "gray.800" },
    },
  },
  components: {
    Button: { defaultProps: { colorScheme: "brand" } },
  },
});

export default theme;
