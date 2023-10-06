/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBlue: "#4B97F2",
        lightBlue: "#C4D7EE",
        darkBlue: "#365C8B",
        primaryGreen: "#62A42C",
        primaryBlack: "#66696B",
        primaryRed: "#ff4d5f",
      },
    },
  },
  plugins: [require("daisyui")],
};
