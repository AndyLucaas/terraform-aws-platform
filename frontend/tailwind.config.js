/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#F7F8FA',
          secondary: '#FFFFFF',
        },
        surface: '#F2F4F7',
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
        },
        brand: {
          DEFAULT: '#0F766E',
          dark: '#0C5C56',
          light: '#14B8A6',
        },
        secondary: {
          DEFAULT: '#14532D',
        },
        accent: {
          DEFAULT: '#D97706',
        },
        success: '#15803D',
        error: '#B91C1C',
        warning: '#CA8A04',
        info: '#0369A1',
        border: '#E5E7EB',
        hover: '#ECFDF5',
        sidebar: '#FAFAF9',
        navbar: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        lg: '10px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
        popover: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'dialog-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 220ms ease-out',
        'dialog-in': 'dialog-in 200ms ease-out',
      },
    },
  },
  plugins: [],
};
