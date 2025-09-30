/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7A85C1",
        'background-light': "#f6f7f8",
        'background-dark': "#3C467B",
        'navbar-color': "#212529",
      },
    },
  },
  plugins: [],
}
