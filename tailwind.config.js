/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050608',
        graphite: '#0c0e12',
        charcoal: '#14171c',
        steel: '#2a2f37',
        mist: '#8b93a1',
        silver: '#c9ced6',
        paint: { DEFAULT: '#1d4489', light: '#3f6fc2', deep: '#0b1d42' },
        signal: '#6aa7ff',
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { ultra: '0.32em' },
    },
  },
  plugins: [],
};
