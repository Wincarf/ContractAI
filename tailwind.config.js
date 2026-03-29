/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B1220',
        surface: '#111A2E',
        primary: '#4F7DFF',
        text: '#EAF0FF',
        muted: '#A9B5D1',
        border: 'rgba(255,255,255,0.08)',
        severity: {
          low: '#2DD4BF',
          medium: '#F59E0B',
          high: '#EF4444',
        },
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}

