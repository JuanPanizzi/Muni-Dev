/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(266deg, rgba(14,137,129,1) 0%, rgba(105,224,217,1) 100%)',
      },
      colors: {
        'celeste-1': '#00A99C',
        'celeste-2': '#60D8D1',
        'verde-claro': '#05ac9e',
        'verde-oscuro': '#047465',
        'celeste-claro': '#90cbca',
        'rojo-claro': '#e46c6c',
        'marron': '#b99d92',
        'cv-celeste-claro': "#90CBCA",
        'cv-celeste-oscuro': "#05AC9E",
        'cv-verde-oscuro': '#047465'

      }
      
    },
  },
  plugins: [],
}

