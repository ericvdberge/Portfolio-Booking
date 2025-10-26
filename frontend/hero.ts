import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: "#0070f3",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0052cc",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#00c853",
          foreground: "#ffffff",
        },
      },
    },
    dark: {
      colors: {
        primary: {
          DEFAULT: "#3291ff",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0052cc",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#00c853",
          foreground: "#000000",
        },
      },
    },
  },
});
