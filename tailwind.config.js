/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#6366f1',
          DEFAULT: '#4f46e5',
          dark: '#4338ca',
        },
        secondary: {
          light: '#f97316',
          DEFAULT: '#ea580c',
          dark: '#c2410c',
        },
        accent: {
          light: '#f59e0b',
          DEFAULT: '#d97706',
          dark: '#b45309',
        },
        dark: {
          100: '#1e293b',
          200: '#1a2438',
          300: '#162033',
          400: '#121c2e',
        },
        light: {
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(99, 102, 241, 0.5)',
        'glow-sm': '0 0 8px rgba(99, 102, 241, 0.4)',
      }
    }
  },
  plugins: [],
};
