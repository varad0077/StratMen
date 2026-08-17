/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Page Backgrounds ──
        bg: {
          warm: '#F7F7F2',   // Primary page background (warm off-white)
          white: '#FFFFFF',  // Cards, nav, surfaces
        },
        // ── Text Colors ──
        text: {
          dark: '#202420',   // Primary headings and body
          mid: '#68706A',    // Secondary text, labels, meta
          muted: '#9BA89D',  // Placeholders, captions
        },
        // ── Green Brand Palette ──
        green: {
          deep: '#315B45',   // Primary buttons, CTAs, important UI
          mint: '#63D9A3',   // Signature accent — selective heading highlights only
          soft: '#E4F1E8',   // Active nav, tags, selected states, bg accents
        },
        // ── Borders ──
        border: {
          subtle: '#E1E5DF', // All standard borders
          mid: '#C8D0C8',    // Slightly stronger borders when needed
        },
        // ── Functional Colors (unchanged) ──
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
        },
        warning: '#F59E0B',
        success: '#22C55E',
        info: '#3B82F6',
      },
      fontFamily: {
        manrope: ['Manrope', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.06)',
        card: '0 2px 12px rgba(0, 0, 0, 0.07)',
        'card-hover': '0 6px 24px rgba(0, 0, 0, 0.10)',
        nav: '0 2px 12px rgba(0, 0, 0, 0.06)',
        modal: '0 20px 60px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'scale-in': 'scaleIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
