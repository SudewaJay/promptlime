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
        text: "text 5s ease infinite", // 👈 Add this line
      },
      keyframes: {
        wiggle: {
          "0%,100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-30px) translateX(15px)" },
        },
        text: {
          // 👇 Add this keyframe block
          "0%, 100%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "left center",
          },
          "50%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "right center",
          },
        },
      },
    },
  },
  plugins: [],
};