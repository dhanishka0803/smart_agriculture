/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          light: '#4CAF50',
          dark: '#1B5E20',
        },
        secondary: {
          DEFAULT: '#4FC3F7',
          light: '#81D4FA',
          dark: '#0288D1',
        },
        accent: {
          green: '#2E7D32',
          blue: '#4FC3F7',
        }
      },
    },
  },
  plugins: [],
}
