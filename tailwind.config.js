export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#fbf8f3', panel: '#ffffff', panel2: '#f3ede2', line: '#e4d9c6',
        ink: '#2a2420', muted: '#6b6257',
        gold: '#d9b24c', gold2: '#85650f',
        deep: '#14120f', deepline: '#2a2622', deepink: '#ece6d8', deepmuted: '#a8a090',
        good: '#1b8a5c', bad: '#c0413b', warn: '#a8680f',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
