// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: "#000000", // solid black for primary actions
        accent: "#C5A880", // gold / beige accent used throughout
        muted: "#5C5042", // subtle dark-gray for body text
        success: "#2F4F4F", // muted green for in‑stock
        warning: "#B8860B", // muted amber for low‑stock
        background: "#FAF9F5", // light beige background for sections
        "border-beige": "#E5E1D9",
      },
      fontFamily: {
        body: ["Inter var", "system-ui", "sans-serif"],
        heading: ["Playfair Display", "serif"],
      },
      spacing: {
        // 8‑pixel baseline grid
        1: "0.125rem", // 2px
        2: "0.25rem", // 4px
        3: "0.375rem", // 6px
        4: "0.5rem", // 8px
        5: "0.75rem", // 12px
        6: "1rem", // 16px
        7: "1.5rem", // 24px
        8: "2rem", // 32px
        9: "2.5rem", // 40px
        10: "3rem", // 48px
      },
      fontSize: {
        // modular typographic scale based on 16 px base
        xs: ["0.75rem", { lineHeight: "1.25" }], // 12 px
        sm: ["0.875rem", { lineHeight: "1.375" }], // 14 px
        base: ["1rem", { lineHeight: "1.5" }], // 16 px
        lg: ["1.125rem", { lineHeight: "1.75" }], // 18 px
        xl: ["1.25rem", { lineHeight: "1.75" }], // 20 px
        "2xl": ["1.5rem", { lineHeight: "1.75" }], // 24 px
        "3xl": ["1.875rem", { lineHeight: "2.25" }], // 30 px
        "4xl": ["2.25rem", { lineHeight: "2.5" }], // 36 px
        "5xl": ["3rem", { lineHeight: "1" }], // 48 px
        "6xl": ["3.75rem", { lineHeight: "1" }], // 60 px
        // extra tiny sizes for legacy utilities
        xxs: ["0.625rem", { lineHeight: "1.2" }], // 10 px
        xxxs: ["0.5625rem", { lineHeight: "1.1" }], // 9 px
      },
    },
  },
  plugins: [],
};
