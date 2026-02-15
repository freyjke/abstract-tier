/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tier-s': '#ff7f7f',
        'tier-a': '#ffbf7f',
        'tier-b': '#ffdf7f',
        'tier-c': '#ffff7f',
        'tier-d': '#bfff7f',
        'tier-skip': '#7fff7f', // Adjusted based on image, looks green
        'tier-bg': '#1a1a1a',
      }
    },
  },
  plugins: [],
}
