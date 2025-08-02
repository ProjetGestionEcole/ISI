/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      keyframes: {
        scalein: {
          '0%': {
            opacity: '0',
            transform: 'scaleX(0.9) scaleY(0.9)'
          },
          '50%': {
            opacity: '0.3',
            transform: 'scaleX(1.05) scaleY(1.05)'
          },
          '100%': {
            opacity: '1',
            transform: 'scaleX(1) scaleY(1)'
          }
        },
        fadeout: {
          '0%': {
            opacity: '1'
          },
          '100%': {
            opacity: '0'
          }
        }
      },
      animation: {
        scalein: 'scalein 150ms ease-in-out',
        fadeout: 'fadeout 150ms ease-in-out'
      }
    },
  },
  plugins: [],
}
