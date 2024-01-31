/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{html,ts}",
    "./src/app/**/*.ts",
    "./src/index.html",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",
      // => @media (max/min-width: 640px) { ... }

      md: "768px",
      // => @media (max/min-width: 768px) { ... }

      lg: "1024px",
      // => @media (max/min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (max/min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (max/min-width: 1536px) { ... }
    },
    extend: {
      // colors
      colors: {
        // light theme
        lightPrimary: "#2673D0",
        lightSecondary: "",
        lightAccent: "rgba(255,122,69,0.87)",
        lightError: "#EE2C4A",
        lightSucces: "#44CC77",
        lightWarning: "#FF8800",
        lightBgPrimary: "#F0F2F5",
        lightBgSecondary: "#FAFAFA",
        lightBorder: "#E8E8E8",
        lightTextPrimary: "rgba(0,0,0,0.87)",
        lightTextSecondary: "rgba(0,0,0,0.60)",

        // dark theme
        darkPrimary: "#2673D0",
        darkSecondary: "",
        darkAccent: "rgba(255,122,69,0.87)",
        darkError: "#A82B30",
        darkSucces: "#309053",
        darkWarning: "#B2B400",
        darkBgPrimary: "#121212",
        darkBgSecondary: "#222222",
        darkBorder: "#272727",
        darkTextPrimary: "rgba(255,255,255,0.87)",
        darkTextSecondary: "rgba(255,255,255,0.6)",
      },
      // shadows
      boxShadow: {
        light: "0 2px 5px 0 rgba(0, 0, 0, 0.2)",
        dark: "0 2px 5px 0 rgba(230, 230, 230, 0.15)",
      },

      // sizes
      height: {
        content: "calc(100vh - 100px)",
      },
    },
  },
  plugins: [],
};
