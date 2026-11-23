/**
 * Tailwind CSS v4 is wired up through PostCSS.
 * Next.js 16 (Turbopack and webpack) both pick up this config.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
