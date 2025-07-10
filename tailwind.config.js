/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        electricBlue: "#2F80FF", // ⚡️ Custom color
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        wiggle: "wiggle 6s ease-in-out infinite",
        text: "text 5s ease infinite",         // Already present
        "gradient-x": "gradient-x 5s ease infinite", // ✅ Add this
      },
      keyframes: {
        wiggle: {
          "0%,100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-30px) translateX(15px)" },
        },
        text: {
          "0%, 100%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "left center",
          },
          "50%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "right center",
          },
        },
        // ✅ Add this keyframe
        "gradient-x": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
      },
    },
  },
  plugins: [
  ],
};