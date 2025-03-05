/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primaryOrange: "#D67900",
        mainGray: "#F1F1F1",
        tabGray: "#2B2D32",
      },
    },
  },
  plugins: [],
};
