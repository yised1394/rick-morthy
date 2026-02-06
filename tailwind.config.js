/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#EEE3FF',
          600: '#8054C7',
          700: '#5A3696',
          DEFAULT: '#8054C7',
        },
        secondary: {
          600: '#63D838',
          DEFAULT: '#63D838',
        },
        // Legacy brand colors mapped to new primary
        brand: {
          DEFAULT: '#8054C7',
          light: '#EEE3FF',
          dark: '#5A3696',
        },
        danger: '#ef4444',
        success: '#63D838',
        warning: '#f59e0b',
        background: '#FFFFFF',
        foreground: '#171717',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#171717',
        },
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#737373',
        },
        gray: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'dropdown-in': 'dropdown-in 0.2s ease-out',
        'dropdown-out': 'dropdown-out 0.15s ease-in forwards',
        'sheet-slide-up': 'sheet-slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'overlay-fade-in': 'overlay-fade-in 0.3s ease-out',
      },
      keyframes: {
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(1rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'dropdown-in': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'dropdown-out': {
          from: { opacity: '1', transform: 'translateY(0)' },
          to: { opacity: '0', transform: 'translateY(-8px)' },
        },
        'sheet-slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'overlay-fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
