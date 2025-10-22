/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'azul-aco': '#2B4C7E',
        'azul-serenity': '#A7C7E7',
        'branco-puro': '#FFFFFF',
        'cinza-urbano': '#6C737F',
        'verde-salvia': '#7AC29A',
        'coral-suave': '#F87171',
        'cinza-nevoa': '#E8ECEF'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'typing': 'typing 3s steps(40, end), blink-caret 0.75s step-end infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        'blink-caret': {
          'from, to': { 'border-color': 'transparent' },
          '50%': { 'border-color': '#2B4C7E' }
        }
      }
    },
  },
  plugins: [],
}

