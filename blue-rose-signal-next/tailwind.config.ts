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
        crt: {
          amber: "#ffcc00",
          green: "#00ff00",
          bezel: "#5a5a58",
          screen: "#000000",
        },
      },
      fontFamily: {
        vt323: ['"VT323"', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
