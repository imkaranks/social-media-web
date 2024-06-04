/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // colors: {
      //   background: "#1A1A1A",
      //   foreground: "#282828",
      //   accent: "#FFFD00",
      //   softwhite: "#FAFAFA",
      // },
      screens: {
        sm: "40em", // Equivalent to 640px
        md: "48em", // Equivalent to 768px
        lg: "64em", // Equivalent to 1024px
        xl: "80em", // Equivalent to 1280px
        "2xl": "96em", // Equivalent to 1536px
      },
    },
  },
  plugins: [],
};
