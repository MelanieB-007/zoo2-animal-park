import { useState } from "react";

export function useSort(initialKey = "name") {
  const [sortBy, setSortBy] = useState(initialKey);
  const [sortDirection, setSortDirection] = useState("asc");

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
    sortData: (data) => {
      if (!data || !Array.isArray(data)) {
        return [];
      }

      return [...data].sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortDirection === "asc" ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    },
  };
}