export const SPICE_MAX = 4;

export function formatTime(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function spiceLevels(level) {
  return Array.from({ length: SPICE_MAX }, (_, i) => i < level);
}
