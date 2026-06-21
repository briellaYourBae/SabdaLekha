/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./*.html",
    "./pages/*.html",
    "./js/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#EEF0F8', 100: '#D6D5E8', 200: '#B8B7D4', 300: '#8A89B8', 400: '#6361A8', 500: '#3F3D9C', 600: '#33318A', 700: '#272578', 800: '#1B1966', 900: '#0F0D54' },
        secondary: { 400: '#C8A951', 500: '#B89A40', 600: '#A88B30' },
      }
    }
  },
  plugins: [],
}