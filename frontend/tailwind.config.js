/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand, #1f2937)',
      },
    },
  },
  plugins: [],
};
