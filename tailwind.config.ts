import type { Config } from 'tailwindcss';
const config: Config = { darkMode: "class",
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { brand: { DEFAULT: "#059669", dark: "#036c4b" }, },} },
  plugins: [],
};
export default config;
