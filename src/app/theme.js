import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: { bg: "gray.50", color: "gray.800" },
    "h1, h2, h3": { letterSpacing: "-0.02em" },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-display), var(--font-inter), system-ui, sans-serif" },
        body: { value: "var(--font-inter), system-ui, sans-serif" },
      },
      colors: {
        ink: {
          700: { value: "#1E2433" },
          800: { value: "#141925" },
          900: { value: "#0B0F19" },
        },
        brand: {
          50: { value: "#FFFBEB" },
          100: { value: "#FEF3C7" },
          200: { value: "#FDE68A" },
          300: { value: "#FCD34D" },
          400: { value: "#FBBF24" },
          500: { value: "#F59E0B" },
          600: { value: "#D97706" },
          700: { value: "#B45309" },
          800: { value: "#92400E" },
          900: { value: "#78350F" },
          950: { value: "#451A03" },
        },
      },
    },
    // Lets components use colorPalette="brand".
    semanticTokens: {
      colors: {
        ink: {
          700: { value: "#1E2433" },
          800: { value: "#141925" },
          900: { value: "#0B0F19" },
        },
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "white" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.200}" },
          subtle: { value: "{colors.brand.100}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.400}" },
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;
