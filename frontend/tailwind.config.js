module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'ns': ['Noto Sans', 'sans-serif'],
      'roboto': ['Roboto', 'sans-serif']
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
