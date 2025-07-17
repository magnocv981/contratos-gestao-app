// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        azul: {
          claro: '#60A5FA',     // Azul claro (para destaques e ícones)
          escuro: '#1E3A8A',    // Azul escuro (para botões ou barras)
        },
        fundo: '#0f172a',        // Cor de fundo principal (Dashboard)
        cinza: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Fonte moderna para todo o app
      },
      boxShadow: {
        card: '0 2px 10px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
