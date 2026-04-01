export const xpMap = {
  0: { key: "feed", icon: "/images/icons/feed.png" },
  1: { key: "play", icon: "/images/icons/play.png" },
  2: { key: "clean", icon: "/images/icons/clean.png" },
} as const;

// Ein kleiner Helper, um von "feed" auf "0" zu kommen (für den Service)
export const getXpIdByKey = (key: string): string => {
  const entry = Object.entries(xpMap).find(([_, value]) => value.key === key);
  return entry ? entry[0] : key; // Fallback auf den Key selbst, falls nichts gefunden wird
};