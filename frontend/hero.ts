import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: "#115E59",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0D4F4F",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#5EEAD4",
          foreground: "#000000",
        },
      },
    },
    dark: {
      colors: {
        primary: {
          DEFAULT: "#2DD4BF",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#14B8A6",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#5EEAD4",
          foreground: "#000000",
        },
      },
    },
  },
});
