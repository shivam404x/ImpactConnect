/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'Monaco', 'monospace'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        type: {
          bg: '#0f172a',
          surface: '#1e293b',
          surfaceLight: '#334155',
          correct: '#10b981',
          wrong: '#ef4444',
          current: '#38bdf8',
          textMuted: '#64748b',
          accent: '#6366f1',
        },
        finger: {
          lp: '#f43f5e', // left pinky (red)
          lr: '#fb923c', // left ring (orange)
          lm: '#facc15', // left middle (yellow)
          li: '#4ade80', // left index (green)
          th: '#38bdf8', // thumbs (sky)
          ri: '#818cf8', // right index (indigo)
          rm: '#c084fc', // right middle (purple)
          rr: '#f472b6', // right ring (pink)
          rp: '#fb7185', // right pinky (rose)
        }
      },
      boxShadow: {
        'glow-accent': '0 0 20px -3px rgba(99, 102, 241, 0.4)',
        'glow-correct': '0 0 15px -3px rgba(16, 185, 129, 0.4)',
        'key-press': 'inset 0 3px 6px rgba(0, 0, 0, 0.4)',
        'key-idle': '0 4px 0 #0f172a, 0 5px 6px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'blink': 'blink 1s infinite',
        'pop': 'pop 0.15s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
