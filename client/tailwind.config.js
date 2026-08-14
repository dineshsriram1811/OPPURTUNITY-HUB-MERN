/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1677D2',
          50:  '#EBF3FA',
          100: '#D4E6F6',
          200: '#AACEEE',
          300: '#7FB5E6',
          400: '#559DDD',
          500: '#1677D2',
          600: '#123B73',
          700: '#0E2E5B',
          800: '#0A2143',
          900: '#06142B',
        },
        deepBlue: {
          DEFAULT: '#123B73',
          500: '#123B73',
        },
        secondary: {
          DEFAULT: '#19D3AE',
          light: '#E8FBF6',
          dark: '#14B897',
          50: '#F2FCF9',
          100: '#E8FBF6',
          500: '#19D3AE',
        },
        mint: {
          DEFAULT: '#19D3AE',
          light: '#E8FBF6',
          500: '#19D3AE',
        },
        pageBg: '#F3F8FC',
        surface: '#FFFFFF',
        border: '#D9E5EF',
        textDark: '#102A43',
        textSub: '#62748A',
        'text-primary': '#102A43',
        'text-secondary': '#62748A',
        success: '#19A974',
        warning: '#F4B942',
        danger: '#E05252',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Forum', 'serif'],
        forum:   ['Forum', 'serif'],
      },
      boxShadow: {
        card:        '0 2px 8px 0 rgba(16, 42, 67, 0.04)',
        'card-hover':'0 12px 28px -5px rgba(16, 42, 67, 0.08)',
        glass:       '0 8px 32px 0 rgba(18, 59, 115, 0.08)',
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      screens: { xs: '480px' },
    },
  },
  plugins: [],
};
