/** @type {import('tailwindcss').Config} */
export default {
  darkMode:"class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        'blue-primary' : '#0F172A',
        'blue-secondary': '#0284C7',
        'blue-3': '#1E293B'
      }
    },
  },
  plugins: [],
}

