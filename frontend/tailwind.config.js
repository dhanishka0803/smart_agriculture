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
          DEFAULT: '#3E5F44',
          light: '#5E936C',
          lighter: '#93DA97',
          pale: '#E8FFD7',
          dark: '#2d4532',
        },
        accent: {
          mint: '#A8DF8E',
          cream: '#F0FFDF',
          pink: '#FFAAB8',
          pinkLight: '#FFD8DF',
        },
        secondary: {
          DEFAULT: '#5E936C',
          light: '#93DA97',
          dark: '#4a7355',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(62, 95, 68, 0.1), 0 10px 20px -2px rgba(62, 95, 68, 0.05)',
        'medium': '0 4px 25px -5px rgba(62, 95, 68, 0.15), 0 10px 30px -5px rgba(62, 95, 68, 0.1)',
        'hard': '0 10px 40px -10px rgba(62, 95, 68, 0.25), 0 20px 50px -10px rgba(62, 95, 68, 0.15)',
      },
    },
  },
  plugins: [],
}
