/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azul: {
          claro: "#38BDF8", // azul-celeste
          escuro: "#0F172A", // azul-escuro
        },
        cinza: {
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
        },
      },
    },
  },
  plugins: [],
}
