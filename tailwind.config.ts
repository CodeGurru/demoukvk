import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bijli: {
          primary: "#FFC42E",
          hover: "#F2B10F",
          soft: "#FFF4D6",
          dark: "#111827",
          bg: "#0B141A",
          waGreen: "#00A884",
          waBubbleIn: "#202C33",
          waBubbleOut: "#005C4B",
          waBorder: "#2A3942",
        },
      },
    },
  },
  plugins: [],
};
export default config;
