/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'velvet-bg': '#0F172A',
        'velvet-card': '#1E293B',
        'velvet-primary': '#334155',
        'velvet-accent': '#22C55E',
        'velvet-text': '#F8FAFC',
        'velvet-muted': '#94A3B8'
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
        sans: ['Fira Sans', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: []
}
