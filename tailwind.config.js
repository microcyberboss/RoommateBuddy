/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // blue-500
          dark: '#1d4ed8', // blue-700
          light: '#60a5fa', // blue-400
        },
        secondary: {
          DEFAULT: '#6b7280', // gray-500
          dark: '#374151', // gray-700
          light: '#9ca3af', // gray-400
        }
      }
    },
  },
  plugins: [],
}
