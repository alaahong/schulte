/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'pulse-fast': 'pulse 0.4s ease-in-out',
        'shake': 'shake 0.3s ease-in-out',
        'cell-pop': 'cellPop 0.32s ease-out',
        'cell-burst': 'cellBurst 0.42s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' }
        },
        cellPop: {
          '0%':   { transform: 'scale(1)' },
          '35%':  { transform: 'scale(1.18)' },
          '70%':  { transform: 'scale(0.94)' },
          '100%': { transform: 'scale(1)' }
        },
        cellBurst: {
          '0%':   { transform: 'scale(1)',    filter: 'brightness(1)' },
          '40%':  { transform: 'scale(1.12)', filter: 'brightness(1.3)' },
          '100%': { transform: 'scale(1)',    filter: 'brightness(1)' }
        }
      }
    }
  },
  plugins: []
}
