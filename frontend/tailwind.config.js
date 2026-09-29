/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          darkest: '#EDE8F5',  // App background (softest lavender)
          base: '#F5F3FA',     // Card surfaces & modal panels
          panel: '#ADBBDA',    // Subtle borders & outline rings
          hover: '#C2CEE8',    // Interactive hover state
          muted: '#8697C4',    // Secondary text & meta info
          accent: '#7091E6',   // Primary buttons, active tabs, waveform
          accentDark: '#5676cb',
          navy: '#3D52A0',     // Bold titles & strong headers
          light: '#233166',    // Deep high-contrast body text
          danger: '#E04858',   // Clear clinical alert red
          warning: '#E89234',  // Clinical warning amber
          success: '#2E9F6E',  // Normal / Stable green
        }
      }
    },
  },
  plugins: [],
}