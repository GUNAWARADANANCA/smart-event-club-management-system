/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gallery-bg': '#F8FAFC',
        'gallery-dark': '#0F172A',
        'gallery-text': '#0F172A',
        'gallery-border': '#E2E8F0',
        'gallery-primary': '#14B8A6',
        'gallery-primary-dark': '#0F766E',
        'gallery-accent-orange': '#F97316',
        'gallery-accent-blue': '#2980b9',
        'gallery-light-teal': '#E0F2F1',
      },
      backgroundColor: {
        'page': '#F8FAFC',
      }
    },
  },
  plugins: [],
}
