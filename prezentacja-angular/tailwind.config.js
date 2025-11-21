/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        legiaGreen: '#006C35',
        legiaRed: '#D22630',
        legiaBlack: '#000000',
        legiaWhite: '#FFFFFF',
        legiaGold: '#C9A214',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}