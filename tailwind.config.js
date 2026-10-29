/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'Segoe UI', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        // Forge Aurora preset colors
        forge: {
          bg: '#060a17',
          bg2: '#0c1330',
          text: '#eaf1ff',
          muted: '#a7b6d6',
          accent: '#5eead4',
          accent2: '#a78bfa',
          surface: 'rgba(255,255,255,.06)',
          border: 'rgba(255,255,255,.14)',
          glow: 'rgba(94,234,212,.35)',
        },
        // Car wash specific - water/blue theme
        carwash: {
          bg: '#030712',
          bgDeep: '#00050a',
          text: '#f0f9ff',
          muted: '#7dd3fc',
          accent: '#0ea5e9',
          accentLight: '#38bdf8',
          accentDeep: '#0369a1',
          foam: '#f0fdf4',
          foamMuted: '#dcfce7',
          water: '#06b6d4',
          waterDeep: '#0e7490',
          surface: 'rgba(14, 165, 233, 0.08)',
          border: 'rgba(14, 165, 233, 0.18)',
          glow: 'rgba(14, 165, 233, 0.4)',
        },
      },
      borderRadius: {
        'forge': '20px',
        'forge-sm': '12px',
        'forge-lg': '28px',
        'forge-xl': '36px',
      },
      animation: {
        'drift': 'drift 20s ease-in-out infinite alternate',
        'spin': 'spin 16s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate3d(-3%, -2%, 0) scale(1)' },
          '100%': { transform: 'translate3d(5%, 4%, 0) scale(1.12)' },
        },
        spin: {
          'to': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(14, 165, 233, 0.6), 0 0 60px rgba(56, 189, 248, 0.4)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      backdropBlur: {
        'forge': '20px',
      },
    },
  },
  plugins: [],
}