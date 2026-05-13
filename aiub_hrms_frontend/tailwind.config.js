const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/hooks/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Plus Jakarta Sans", ...fontFamily.sans],
        heading: ["Plus Jakarta Sans", ...fontFamily.sans],
        mono: ["JetBrains Mono", ...fontFamily.mono],
      },
      colors: {
        primary: {
          DEFAULT: "#1a56db",
          dark: "#1341b4",
          light: "#ebf0ff",
        },
        accent: {
          DEFAULT: "#7c3aed",
          light: "#ede9fe",
        },
        surface: "#ffffff",
        border: "#e5e7eb",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "slide-up": { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        "slide-in-left": { from: { opacity: 0, transform: "translateX(-16px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
      },
      animation: {
        "fade-in": "fade-in 300ms ease forwards",
        "slide-up": "slide-up 400ms ease forwards",
        "slide-in-left": "slide-in-left 350ms ease forwards",
        shimmer: "shimmer 1.5s infinite linear",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        aiub: {
          primary: "#1a56db",
          "primary-content": "#ffffff",
          secondary: "#7c3aed",
          "secondary-content": "#ffffff",
          accent: "#059669",
          "accent-content": "#ffffff",
          neutral: "#374151",
          "neutral-content": "#ffffff",
          "base-100": "#f5f7fa",
          "base-200": "#eef1f6",
          "base-300": "#e5e7eb",
          "base-content": "#111827",
          info: "#0284c7",
          success: "#059669",
          warning: "#d97706",
          error: "#dc2626",
        },
      },
    ],
    defaultTheme: "aiub",
    logs: false,
  },
};
