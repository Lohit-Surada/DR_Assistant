/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 12px 30px rgba(14, 165, 233, 0.18)',
      },
    },
  },
  plugins: [],
}

