/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0a1628",
        "deep-blue": "#1a2f4f",
        "steel-gray": "#2a3d5f",
        "light-gray": "#c0c8d4",
        cyan: "#00d4ff",
        "cyan-dark": "#0099cc",
      },
      animation: {
        "pulse-cyan": "pulse-cyan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-cyan": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" },
        },
        "glow": {
          "0%, 100%": { 
            boxShadow: "0 0 5px rgba(0, 212, 255, 0.5)" 
          },
          "50%": { 
            boxShadow: "0 0 20px rgba(0, 212, 255, 0.8)" 
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
}
