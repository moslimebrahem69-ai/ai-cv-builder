import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#14213D", paper: "#FAFAF7", teal: { DEFAULT: "#0F766E", soft: "#E3F1EF" } } } },
  plugins: [],
};
export default config;
