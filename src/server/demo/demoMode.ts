import 'server-only';

/**
 * DEMO MODE (client presentation, no database): on when DEMO_MODE=true or when MONGODB_URI is
 * missing. Data comes from scripts/seed-data.json and changes live in memory only — they reset
 * when the server restarts (on Vercel, also between cold starts). Production with MongoDB
 * (MONGODB_URI set) is never in demo mode.
 */
export const IS_DEMO_MODE = process.env.DEMO_MODE === 'true' || !process.env.MONGODB_URI;

/** Demo login, shown on the login page while in demo mode. */
export const DEMO_ADMIN = {
  email: 'demo@santanita.pe',
  password: 'santanita2026',
  name: 'Santanita',
};
