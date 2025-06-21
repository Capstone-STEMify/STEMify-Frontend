export const formatDuration = (minutes: number) => {
  if (typeof minutes !== 'number' || isNaN(minutes) || minutes < 0) return '00:00:00';
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = Math.floor(minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}:00`;
};