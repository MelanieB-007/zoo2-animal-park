import { useState } from "react";

export function useSort(initialKey = "name", initialDirection = "asc") {
  const [sortBy, setSortBy] = useState(initialKey);
  const [sortDirection, setSortDirection] = useState(initialDirection);

  const toggleSort = (key) => {
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
    getSortIcon: (key) => {
      if (sortBy !== key) return "↕";
      return sortDirection === "asc" ? "▲" : "▼";
    }
  };
}