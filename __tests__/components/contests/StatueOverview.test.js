/**
 * Tests für die StatueOverview-Komponenten
 *
 * Abgedeckte Anforderungen:
 *  1. Werden Statuen korrekt gerendert (Tabellenansicht & Mobile-Karte)?
 *  2. Funktioniert die Filter- und Sortierlogik (filterStatues, sortStatues)?
 *  3. Reagiert die Suchleiste korrekt und zeigt EmptyState wenn keine Treffer?
 *  4. Navigiert ein Klick auf eine Mobile-Karte zur richtigen Tier-Seite?
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import StatueDesktopTable from "../../../components/contests/statues/StatueOverview/StatueDesktopTable";
import StatueMobileCard from "../../../components/contests/statues/StatueOverview/StatueMobileCard";
import StatueOverviewContent from "../../../components/contests/statues/StatueOverview/StatueOverviewContent";
import {
  filterStatues,
  sortStatues,
  paginate,
} from "../../../services/StatueHelper";

// ─── Externe Abhängigkeiten mocken ────────────────────────────────────────────

const DE_TRANSLATIONS = {
  // StatueOverviewContent
  "contests:statues.overview_title": "Übersicht über alle Statuen",
  // StatueDesktopTable (Namespace: "contest" singular — Eigenheit im Code)
  "contest:statues.species": "Art",
  "contest:statues.animal": "Tier",
  // StatueMobileCard
  "contest:statues.card_label": "Statue",
  // Gemeinsame Animal/Common-Keys
  "animals:table.enclosure": "Gehege",
  "animals:table.stall": "Stall",
  "animals:tooltips.level": "Benötigtes Stall-Level",
  "animals:search_placeholder": "Suche nach Tieren...",
  "animals:filter.all_enclosures": "Alle Gehege",
  "animals:filter.all_levels": "Alle Level",
  "animals:results_unit": "Tiere gefunden",
  "animals:empty.button": "Suche neu starten",
  "common:results.show": "Angezeigt",
  "common:results.of": "von",
  "common:actions": "Aktionen",
};

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key) => DE_TRANSLATIONS[key] ?? key,
    i18n: { language: "de" },
  }),
}));

const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: "/",
    locale: "de",
    query: {},
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src, width, height }) => (
    <img alt={alt} src={src} width={width} height={height} />
  ),
}));

// ─── Test-Fixtures ────────────────────────────────────────────────────────────

const mockStatues = [
  {
    id: 1,
    name: "Löwen-Statue",
    bild: "loewe-statue.webp",
    tier: {
      id: 10,
      name: "Löwe",
      stalllevel: 2,
      gehege: { id: 1, name: "Hauptzoo", texte: [] },
      texte: [{ spracheCode: "de", name: "Löwe" }],
    },
  },
  {
    id: 2,
    name: "Pinguin-Statue",
    bild: "pinguin-statue.webp",
    tier: {
      id: 11,
      name: "Pinguin",
      stalllevel: 1,
      gehege: { id: 2, name: "Polarium", texte: [] },
      texte: [{ spracheCode: "de", name: "Pinguin" }],
    },
  },
  {
    id: 3,
    name: "Elefant-Statue",
    bild: "elefant-statue.webp",
    tier: {
      id: 12,
      name: "Elefant",
      stalllevel: 3,
      gehege: { id: 1, name: "Hauptzoo", texte: [] },
      texte: [{ spracheCode: "de", name: "Elefant" }],
    },
  },
];

/** Standard-Props für StatueOverviewContent */
function buildOverviewProps(overrides = {}) {
  return {
    statues: mockStatues,
    currentItems: mockStatues,
    filteredCount: mockStatues.length,
    searchTerm: "",
    setSearchTerm: jest.fn(),
    selectedGehege: "Alle",
    setSelectedGehege: jest.fn(),
    selectedLevel: "Alle",
    setSelectedLevel: jest.fn(),
    setCurrentPage: jest.fn(),
    handleStatueClick: jest.fn(),
    handleResetFilters: jest.fn(),
    sortBy: "tier.name",
    sortDirection: "asc",
    toggleSort: jest.fn(),
    totalPages: 1,
    currentPage: 1,
    handleNextPage: jest.fn(),
    handlePrevPage: jest.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  mockPush.mockClear();
});

// ─── 1. StatueDesktopTable rendern ────────────────────────────────────────────

describe("1. StatueDesktopTable wird korrekt gerendert", () => {
  it("zeigt alle Statuen-Namen in der Tabelle", () => {
    render(
      <StatueDesktopTable
        statues={mockStatues}
        sortBy="tier.name"
        sortDirection="asc"
        onSort={jest.fn()}
      />
    );
    expect(screen.getByText("Löwen-Statue")).toBeInTheDocument();
    expect(screen.getByText("Pinguin-Statue")).toBeInTheDocument();
    expect(screen.getByText("Elefant-Statue")).toBeInTheDocument();
  });

  it("zeigt die Tiernamen aus dem texte-Array", () => {
    render(
      <StatueDesktopTable
        statues={mockStatues}
        sortBy="tier.name"
        sortDirection="asc"
        onSort={jest.fn()}
      />
    );
    // Tiername erscheint zweimal (InfoCell + separate Spalte)
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pinguin").length).toBeGreaterThan(0);
  });

  it("zeigt die Spaltenüberschriften", () => {
    render(
      <StatueDesktopTable
        statues={mockStatues}
        sortBy="tier.name"
        sortDirection="asc"
        onSort={jest.fn()}
      />
    );
    expect(screen.getAllByText("Art").length).toBeGreaterThan(0);
    expect(screen.getByText("Gehege")).toBeInTheDocument();
    expect(screen.getByText("Stall")).toBeInTheDocument();
  });

  it("zeigt Fallback 'Unbekannt' wenn kein Tiername in texte vorhanden", () => {
    const statuesWithMissingName = [
      {
        id: 99,
        name: "Geheimnis-Statue",
        bild: null,
        tier: { id: 99, stalllevel: 1, gehege: { id: 1, name: "Hauptzoo", texte: [] }, texte: [] },
      },
    ];
    render(
      <StatueDesktopTable
        statues={statuesWithMissingName}
        sortBy="tier.name"
        sortDirection="asc"
        onSort={jest.fn()}
      />
    );
    expect(screen.getAllByText("Unbekannt").length).toBeGreaterThan(0);
  });

  it("ruft onSort auf wenn auf einen Spalten-Header geklickt wird", () => {
    const onSortMock = jest.fn();
    render(
      <StatueDesktopTable
        statues={mockStatues}
        sortBy="tier.name"
        sortDirection="asc"
        onSort={onSortMock}
      />
    );
    fireEvent.click(screen.getByText("Gehege"));
    expect(onSortMock).toHaveBeenCalled();
  });
});

// ─── 2. filterStatues & sortStatues (reine Funktionen) ───────────────────────

describe("2. filterStatues – Filterlogik", () => {
  it("gibt alle Statuen zurück wenn keine Filter aktiv sind", () => {
    const result = filterStatues(mockStatues, {
      searchTerm: "",
      selectedGehege: "Alle",
      selectedLevel: "Alle",
    });
    expect(result).toHaveLength(3);
  });

  it("filtert nach Tiernamen (Suche)", () => {
    const result = filterStatues(mockStatues, {
      searchTerm: "pingu",
      selectedGehege: "Alle",
      selectedLevel: "Alle",
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Pinguin-Statue");
  });

  it("filtert nach Gehege", () => {
    const result = filterStatues(mockStatues, {
      searchTerm: "",
      selectedGehege: "Hauptzoo",
      selectedLevel: "Alle",
    });
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.name)).toEqual(
      expect.arrayContaining(["Löwen-Statue", "Elefant-Statue"])
    );
  });

  it("filtert nach Stall-Level", () => {
    const result = filterStatues(mockStatues, {
      searchTerm: "",
      selectedGehege: "Alle",
      selectedLevel: "1",
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Pinguin-Statue");
  });

  it("kombiniert Suche und Gehege-Filter", () => {
    const result = filterStatues(mockStatues, {
      searchTerm: "elef",
      selectedGehege: "Hauptzoo",
      selectedLevel: "Alle",
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Elefant-Statue");
  });

  it("gibt leeres Array zurück wenn nichts passt", () => {
    const result = filterStatues(mockStatues, {
      searchTerm: "xyznotfound",
      selectedGehege: "Alle",
      selectedLevel: "Alle",
    });
    expect(result).toHaveLength(0);
  });
});

describe("2. sortStatues – Sortierlogik", () => {
  it("sortiert nach Tiername aufsteigend", () => {
    const result = sortStatues(mockStatues, {
      sortBy: "tier.name",
      sortDirection: "asc",
    });
    expect(result[0].tier.name).toBe("Elefant");
    expect(result[1].tier.name).toBe("Löwe");
    expect(result[2].tier.name).toBe("Pinguin");
  });

  it("sortiert nach Tiername absteigend", () => {
    const result = sortStatues(mockStatues, {
      sortBy: "tier.name",
      sortDirection: "desc",
    });
    expect(result[0].tier.name).toBe("Pinguin");
    expect(result[2].tier.name).toBe("Elefant");
  });

  it("sortiert nach Stalllevel aufsteigend", () => {
    const result = sortStatues(mockStatues, {
      sortBy: "tier.stalllevel",
      sortDirection: "asc",
    });
    expect(result[0].tier.stalllevel).toBe(1);
    expect(result[2].tier.stalllevel).toBe(3);
  });

  it("sortiert nach Gehege-Name", () => {
    const result = sortStatues(mockStatues, {
      sortBy: "tier.gehege.name",
      sortDirection: "asc",
    });
    // Hauptzoo < Polarium
    expect(result[0].tier.gehege.name).toBe("Hauptzoo");
    expect(result[result.length - 1].tier.gehege.name).toBe("Polarium");
  });
});

describe("2. paginate – Seitenlogik", () => {
  it("gibt die erste Seite zurück", () => {
    const result = paginate(mockStatues, 1, 2);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
  });

  it("gibt die zweite Seite zurück", () => {
    const result = paginate(mockStatues, 2, 2);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });
});

// ─── 3. StatueOverviewContent Integration ────────────────────────────────────

describe("3. StatueOverviewContent – Integration", () => {
  it("zeigt den Seitentitel", () => {
    render(<StatueOverviewContent {...buildOverviewProps()} />);
    expect(
      screen.getByText("Übersicht über alle Statuen")
    ).toBeInTheDocument();
  });

  it("zeigt alle Statuen in der Tabelle", () => {
    render(<StatueOverviewContent {...buildOverviewProps()} />);
    // Desktop-Tabelle + Mobile-Karten rendern beide → mehrfach im DOM
    expect(screen.getAllByText("Löwen-Statue").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pinguin-Statue").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Elefant-Statue").length).toBeGreaterThan(0);
  });

  it("ruft setSearchTerm auf wenn in das Suchfeld getippt wird", () => {
    const setSearchTermMock = jest.fn();
    render(
      <StatueOverviewContent
        {...buildOverviewProps({ setSearchTerm: setSearchTermMock })}
      />
    );
    const input = screen.getByPlaceholderText("Suche nach Tieren...");
    fireEvent.change(input, { target: { value: "Löwe" } });
    expect(setSearchTermMock).toHaveBeenCalledWith("Löwe");
  });

  it("zeigt EmptyState wenn currentItems leer ist", () => {
    render(
      <StatueOverviewContent
        {...buildOverviewProps({ currentItems: [], filteredCount: 0 })}
      />
    );
    expect(
      screen.getByRole("button", { name: /neu starten/i })
    ).toBeInTheDocument();
  });

  it("zeigt die Ergebnisanzahl", () => {
    render(<StatueOverviewContent {...buildOverviewProps()} />);
    // ResultsInfo: "Angezeigt 3 von 3 Tiere gefunden" → "3" erscheint mehrfach
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("zeigt Pagination nicht wenn nur eine Seite vorhanden", () => {
    render(
      <StatueOverviewContent {...buildOverviewProps({ totalPages: 1 })} />
    );
    // PaginationSignpost wird bei totalPages <= 1 nicht gerendert → keine Buttons
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("zeigt Pagination-Buttons bei mehreren Seiten", () => {
    render(
      <StatueOverviewContent {...buildOverviewProps({ totalPages: 3, currentPage: 2 })} />
    );
    // PaginationSignpost rendert 2 Wegweiser-Buttons (prev + next) ohne Text
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    // Auf Seite 2 von 3: beide Buttons aktiv (nicht disabled)
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).not.toBeDisabled();
  });
});

// ─── 4. StatueMobileCard ─────────────────────────────────────────────────────

describe("4. StatueMobileCard wird korrekt gerendert", () => {
  it("zeigt den Statuen-Namen", () => {
    render(<StatueMobileCard statue={mockStatues[0]} />);
    expect(screen.getByText("Löwen-Statue")).toBeInTheDocument();
  });

  it("zeigt den zugehörigen Tiernamen", () => {
    render(<StatueMobileCard statue={mockStatues[0]} />);
    expect(screen.getByText("Löwe")).toBeInTheDocument();
  });

  it("zeigt das Label 'Statue'", () => {
    render(<StatueMobileCard statue={mockStatues[0]} />);
    expect(screen.getByText("Statue")).toBeInTheDocument();
  });

  it("navigiert bei Klick zur Tier-Detailseite", () => {
    render(<StatueMobileCard statue={mockStatues[0]} />);
    fireEvent.click(screen.getByText("Löwen-Statue"));
    expect(mockPush).toHaveBeenCalledWith("/animals/10");
  });

  it("zeigt 'Unbekannt' wenn kein Tiername in texte vorhanden", () => {
    const statueWithoutName = {
      id: 99,
      name: "Rätsel-Statue",
      bild: null,
      tier: {
        id: 99,
        stalllevel: 1,
        gehege: { id: 1, name: "Hauptzoo", texte: [] },
        texte: [],
      },
    };
    render(<StatueMobileCard statue={statueWithoutName} />);
    expect(screen.getByText("Unbekannt")).toBeInTheDocument();
  });
});
