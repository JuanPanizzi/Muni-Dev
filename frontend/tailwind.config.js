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
      }
    },
  },
  plugins: [],
}

