/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0faf6',
          100: '#e1f5ee',
          200: '#c8e8de',
          300: '#a8c8bf',
          400: '#7aada0',
          500: '#5eead4',
          600: '#2a9d8f',
          700: '#1a7a6e',
          800: '#0f6e56',
          900: '#0d4035',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        'lg': '14px',
        'md': '10px',
        'sm': '8px',
      }
    },
  },
  plugins: [],
}
