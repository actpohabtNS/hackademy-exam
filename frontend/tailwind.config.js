module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'ns': ['Noto Sans', 'sans-serif'],
      'roboto': ['Roboto', 'sans-serif']
    },
    extend: {
      colors: {
        yellow: {
          350: "#FCD620",
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
