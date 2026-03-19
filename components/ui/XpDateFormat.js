export const formatMinutes = (totalMinutes) => {
  if (!totalMinutes || totalMinutes === 0) return "–";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')} h ${minutes.toString().padStart(2, '0')} min`;
};