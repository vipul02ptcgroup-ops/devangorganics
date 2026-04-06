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
        gold: "#C9A84C",
        "gold-light": "#E8C96A",
        "gold-dark": "#9A7A2E",
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        raleway: ["Raleway", "sans-serif"],
        cormorant: ["Cormorant Garamond", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;