/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#07070c', // near-black canvas
          900: '#0c0c16', // dark navy panel
          800: '#13131f',
          700: '#1b1b2b',
          600: '#26263a',
        },
        line: 'rgba(255,255,255,0.08)',
        violet: {
          400: '#8b7bff',
          500: '#7c5cff',
          600: '#6d3bff',
        },
        indigo: {
          500: '#4f46e5',
          600: '#4338ca',
        },
        mint: {
          400: '#4ff0b7',
          500: '#22d896',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'nuzio-gradient': 'linear-gradient(135deg, #6d3bff 0%, #4338ca 100%)',
        'nuzio-glow': 'radial-gradient(60% 60% at 50% 30%, rgba(124,92,255,0.25) 0%, rgba(7,7,12,0) 70%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(124,92,255,0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
