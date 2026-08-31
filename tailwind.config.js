/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060a12',
          900: '#0b1326',
          850: '#101c38',
          800: '#16254a',
          700: '#1d3161',
          600: '#2c4787',
          500: '#3d61b0',
          400: '#6488d9',
          300: '#94b2f2',
          200: '#c5d8fc',
        },
        gold: {
          500: '#f59e0b',
          400: '#fbbf24',
          300: '#fcd34d',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
