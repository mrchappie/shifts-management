/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{html,ts}",
    "./src/app/**/*.ts",
    "./src/index.html",
  ],
  theme: {
    extend: {
      // colors
      colors: {
        baseColor: "#009FB7",
        secColor: "#FED766",
        thirdColor: "#696773",
        accentColor: "#fe4a49",
        bgColor: "#eff1f3",
        blackColor: "#272727",
      },
      // shadows
      boxShadow: {
        "all-sides": "0 2px 5px 0 rgba(0, 0, 0, 0.2)",
      },

      // sizes
      height: {
        content: "calc(100vh - 100px)",
      },
      darkTheme: {},
      lightTheme: {},
    },
  },
  plugins: [],
};
