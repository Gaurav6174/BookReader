/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        patrick: ['"Patrick Hand"', 'cursive'],
        gaegu: ['Gaegu', 'cursive'],
      },
      colors: {
        cream: '#fffbf2',
        paper: '#fff7df',
        charcoal: '#111111',
        sketch: {
          yellow: '#fde047',
          purple: '#d8c7ff',
          green: '#bbf7d0',
          pink: '#fbcfe8',
          blue: '#bfdbfe',
          orange: '#fed7aa',
          gray: '#e5e7eb',
          red: '#fecaca',
          sky: '#bae6fd',
        },
      },
      keyframes: {
        'toast-in': {
          '0%': { opacity: 0, transform: 'translateX(60px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 0.3s ease-out',
        wiggle: 'wiggle 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};
