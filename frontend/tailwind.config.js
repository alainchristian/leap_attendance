/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          asyv: {
            green: {
              light: '#4CAF50',  // Light Green
              DEFAULT: '#2E7D32', // Main Green
              dark: '#1B5E20',   // Dark Green
            },
            orange: {
              DEFAULT: '#FF5722', // Orange
            },
            white: '#FFFFFF',
          }
        }
      },
    },
    plugins: [],
  }