/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fdfcfb',
          100: '#fdfbf7',
          200: '#f9f5ed',
          300: '#f4ecd9',
        },
        charcoal: {
          DEFAULT: '#1a1a1a',
        },
      },
      borderColor: {
        charcoal: '#1a1a1a',
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        display: ['"Libre Baskerville"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
