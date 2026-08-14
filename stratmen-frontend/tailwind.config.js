/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#0F0F0F',
          light: '#F7F7F7',
        },
        surface: {
          dark: '#1A1A1A',
          light: '#FFFFFF',
          elevated: '#242424',
        },
        accent: {
          DEFAULT: '#A8E63D',
          hover: '#96D12E',
          muted: 'rgba(168, 230, 61, 0.15)',
        },
        border: {
          DEFAULT: '#2A2A2A',
          light: '#3A3A3A',
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#A0A0A0',
          muted: '#6B6B6B',
        },
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
        },
        warning: '#F59E0B',
        success: '#22C55E',
        info: '#3B82F6',
      },
      fontFamily: {
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
        md: '0 4px 12px rgba(0, 0, 0, 0.4)',
        lg: '0 10px 30px rgba(0, 0, 0, 0.5)',
        glow: '0 0 20px rgba(168, 230, 61, 0.2)',
        'glow-strong': '0 0 40px rgba(168, 230, 61, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 230, 61, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(168, 230, 61, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
