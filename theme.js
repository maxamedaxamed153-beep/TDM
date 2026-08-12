// theme/theme.js
// ---------------------------------------------------------------------------
// Design language: "Tactical HUD"
// Grounded in PUBG's own iconography — the gold of "Winner Winner Chicken
// Dinner", a cold gunmetal/navy battlefield backdrop, and a live-ops cyan
// used sparingly for anything happening RIGHT NOW (live match, countdown).
// Cards use a clipped top-right corner throughout the app (see ClippedCard)
// to evoke tactical panels/HUD readouts rather than generic rounded cards.
// ---------------------------------------------------------------------------

export const colors = {
  bg: '#0B0E14',          // near-black, faint blue tint — the map at night
  bgElevated: '#0F1420',
  surface: '#141928',      // card surface
  surfaceAlt: '#1A2133',   // secondary card / row surface
  border: '#262C40',
  borderLight: '#333B54',

  gold: '#F2B33D',         // primary accent — "chicken dinner" victory gold
  goldDim: '#8A6A2A',
  cyan: '#3FE0D0',         // live / active / countdown accent
  red: '#FF4655',          // eliminations, danger, losses
  green: '#4CD97B',        // wins, positive deltas

  textPrimary: '#EDEFF4',
  textSecondary: '#9AA3B8',
  textMuted: '#5C6580',

  overlay: 'rgba(6,8,14,0.85)',
};

export const gradients = {
  hero: ['#1A2133', '#0B0E14'],
  gold: ['#F2B33D', '#C7871E'],
  cyanGlow: ['#3FE0D0', '#1B7F79'],
};

// Type scale. Display font is intentionally condensed/technical — pair
// "Rajdhani" (headers, numerals, badges) with "Inter" (body/data).
// Load both via expo-font in App.js — see fonts.js.
export const typography = {
  display: 'Rajdhani_700Bold',
  displaySemi: 'Rajdhani_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodyBold: 'Inter_700Bold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 4,
  md: 10,
  lg: 16,
  pill: 999,
};

export default { colors, gradients, typography, spacing, radius };

