/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e', // Primary Rose Pink
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        mood: {
          yellow: { DEFAULT: '#FFD966', light: '#FFF9E6', text: '#8F6B00' },
          blue: { DEFAULT: '#6C9BCF', light: '#EEF4FC', text: '#2C5E94' },
          purple: { DEFAULT: '#A78BFA', light: '#F5EEFF', text: '#5B21B6' },
          green: { DEFAULT: '#81C784', light: '#E8F5E9', text: '#2E7D32' },
          pink: { DEFAULT: '#F48FB1', light: '#FCE4EC', text: '#C2185B' },
          orange: { DEFAULT: '#FFB74D', light: '#FFF3E0', text: '#E65100' },
          gray: { DEFAULT: '#B0BEC5', light: '#ECEFF1', text: '#37474F' },
          red: { DEFAULT: '#E57373', light: '#FFEBEE', text: '#C62828' },
        }
      },
      boxShadow: {
        'clay-sm': '2px 2px 4px rgba(0,0,0,0.02), inset 1px 1px 2px rgba(255,255,255,0.7), inset -1px -1px 2px rgba(0,0,0,0.02)',
        'clay-md': '4px 4px 10px rgba(0,0,0,0.04), inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(0,0,0,0.03)',
        'clay-lg': '8px 8px 24px rgba(0,0,0,0.06), inset 4px 4px 8px rgba(255,255,255,0.9), inset -4px -4px 8px rgba(0,0,0,0.04)',
        'clay-btn': '2px 2px 4px rgba(0,0,0,0.03), inset 2px 2px 3px rgba(255,255,255,0.9), inset -2px -2px 3px rgba(0,0,0,0.02)'
      }
    },
  },
  plugins: [],
}
