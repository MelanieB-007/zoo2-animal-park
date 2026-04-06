import { useState } from "react";

// Wir definieren die erlaubten Richtungen
type SortDirection = "asc" | "desc";

/**
 * Ein generischer Hook zum Sortieren.
 * T ist ein Platzhalter für deine Datenstruktur (z.B. Animal)
 */
export function useSort<T>(initialKey: string = "name", initialDirection: SortDirection = "asc") {
  const [sortBy, setSortBy] = useState<string>(initialKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialDirection);

  const toggleSort = (key: string): void => {
    if (sortBy === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  return {
    sortBy,
    sortDirection,
    toggleSort,
    // Die Funktion gibt einen String (das Icon) zurück
    getSortIcon: (key: string): string => {
      if (sortBy !== key) return "↕";
      return sortDirection === "asc" ? "▲" : "▼";
    }
  };
}