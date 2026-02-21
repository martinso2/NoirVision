import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: "#08080a",
          900: "#0d0d10",
          800: "#15151a",
          700: "#1c1c24",
          600: "#252530",
          500: "#2e2e3a",
        },
        cobalt: {
          950: "#0a0f1a",
          900: "#0f1729",
          800: "#162238",
          700: "#1e2f47",
          600: "#243b55",
        },
        accent: {
          DEFAULT: "#2dd4bf",
          dim: "#0d9488",
          glow: "#5eead4",
        },
      },
    },
  },
  plugins: [],
};

export default config;
