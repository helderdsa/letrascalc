/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Desabilita detecção automática de dark mode
  theme: {
    extend: {
      colors: {
        'orange-gradient-start': '#ff8a00',
        'orange-gradient-end': '#e52e71',
        'green-cma': '#28a745',
        'green-light': '#20c997',
        'red-error': '#dc3545',
        'red-dark': '#c82333',
        'blue-info': '#17a2b8',
        'blue-dark': '#138496',
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #ff8a00 0%, #e52e71 100%)',
        'gradient-green': 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        'gradient-red': 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
        'gradient-blue': 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
      },
    },
  },
  plugins: [],
}