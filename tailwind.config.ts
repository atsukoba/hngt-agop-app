import type { Config } from "tailwindcss";

const { addDynamicIconSelectors } = require("@iconify/tailwind");

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "tab-bg": "var(--fallback-b1,oklch(var(--b1)/1))",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("tailwindcss-animate"),
    addDynamicIconSelectors(),
  ],
  daisyui: {
    themes: ["synthwave", "dark", "forest"],
  },
};
export default config;
