/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Dark luxury palette
        obsidian: "#0A0A0F",
        "obsidian-light": "#12121A",
        "obsidian-card": "#1A1A26",
        "obsidian-border": "#2A2A3E",
        // Accent — warm gold
        gold: "#C9A84C",
        "gold-light": "#E8C96A",
        "gold-muted": "#8A6E2F",
        // Accent — jade green
        jade: "#4ECDC4",
        "jade-dark": "#2A9A93",
        // Text
        "text-primary": "#F0EDE8",
        "text-secondary": "#8A8A9A",
        "text-muted": "#4A4A6A",
        // Spicy red
        spicy: "#E84545",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
