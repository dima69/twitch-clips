/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        custom_300_1fr: "repeat(auto-fill, minmax(300px, 1fr))",
        custom_200_1fr: "repeat(auto-fill, minmax(200px, 1fr))",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          "-ms-overflow-style": "none",  /* IE and Edge */
          "scrollbar-width": "none",  /* Firefox */
        },
        ".no-scrollbar::-webkit-scrollbar": {
          "display": "none",
        },
      });
    }),
  ],
};
