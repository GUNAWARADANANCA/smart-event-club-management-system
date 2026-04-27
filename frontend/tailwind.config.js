/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        'gallery-bg': '#FFFFFF',
        'gallery-dark': '#1F2937',
        'gallery-text': '#1F2937',
        'gallery-border': '#C8E6C9',
        'gallery-primary': '#4CAF50',
        'gallery-primary-dark': '#2E7D32',
        'gallery-accent-orange': '#F97316',
        'gallery-accent-blue': '#2980b9',
        'gallery-light-teal': '#E8F5E9',
        'brand-green': '#4CAF50',
        'brand-green-dark': '#2E7D32',
        'brand-mint': '#E8F5E9',
      },
      backgroundColor: {
        page: '#FFFFFF',
        'page-soft': '#F7FCF7',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
}
