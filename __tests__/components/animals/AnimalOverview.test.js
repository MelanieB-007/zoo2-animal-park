/**
 * Tests für die AnimalOverview-Komponente
 *
 * Abgedeckte Anforderungen:
 *  1. Wird die Liste der Tiere korrekt gerendert?
 *  2. Funktionieren die Filter (Gehege, Suchbegriff, Level)?
 *  3. Wird der Tooltip mit dem korrekten übersetzten Namen angezeigt?
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { filterAnimals } from "../../../services/AnimalHelper";
import AnimalDesktopTable from "../../../components/animals/AnimalOverview/AnimalDesktopTable";
import ActionGroupIcons from "../../../components/page-structure/Table/ActionGroupIcons";
import AnimalOverviewContent from "../../../components/animals/AnimalOverview/AnimalOverviewContent";

// ─── Externe Abhängigkeiten mocken ────────────────────────────────────────────

// next-i18next: useTranslation gibt einen einfachen Key-Lookup zurück
const DE_TRANSLATIONS = {
  "animals:overview_title": "Übersicht über alle Tiere",
  "animals:search_placeholder": "Suche nach Tieren...",
  "animals:table.species": "Art",
  "animals:table.enclosure": "Gehege",
  "animals:table.price": "Preis",
  "animals:table.stall": "Stall",
  "animals:table.sell": "Verkauf",
  "animals:table.release": "Auswildern",
  "animals:tooltips.level": "Benötigtes Stall-Level",
  "animals:tooltips.xp": "Gesamt-XP Ertrag",
  "animals:tooltips.sell": "Verkaufswert in Zoodollar",
  "animals:tooltips.release": "XP beim Auswildern",
  "animals:tooltips.edit": "Tier bearbeiten",
  "animals:tooltips.delete": "Tier löschen",
  "animals:empty.title": "Oje, kein Tier da!",
  "animals:empty.button": "Suche neu starten",
  "animals:filter.all_enclosures": "Alle Gehege",
  "animals:filter.all_levels": "Alle Level",
  "animals:results_unit": "Tiere gefunden",
  "common:actions": "Aktionen",
  "common:payment:diamonds": "Diamanten",
  "common:payment:zoodollar": "Zoodollar",
  "common:results.show": "Zeige",
  "common:results.of": "von",
};

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key) => DE_TRANSLATIONS[key] ?? key,
    i18n: { language: "de" },
  }),
}));

// next/router: useRouter für LinkedRow und andere Komponenten
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/",
    locale: "de",
    query: {},
  }),
}));

// next/image: einfaches <img>-Element statt des optimierten Next.js-Bildes
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src, width, height }) => (
    <img alt={alt} src={src} width={width} height={height} />
  ),
}));

// ─── Test-Fixtures ────────────────────────────────────────────────────────────

const mockAnimals = [
  {
    id: 1,
    name: "Löwe",
    bild: null,
    preis: 500,
    stalllevel: 1,
    verkaufswert: 200,
    auswildern: 50,
    gehege: { id: 1, name: "Hauptzoo", texte: [] },
    preisart: { name: "Gold" },
    texte: [{ spracheCode: "de", name: "Löwe" }],
    xp: [{ wert: 100, xpart: "0", zeit: 30 }],
    tier_gehege_kapazitaet: [],
    tierherkunft: [],
  },
  {
    id: 2,
    name: "Pinguin",
    bild: null,
    preis: 300,
    stalllevel: 2,
    verkaufswert: 80,
    auswildern: 30,
    gehege: { id: 2, name: "Polarium", texte: [] },
    preisart: { name: "Gold" },
    texte: [
      { spracheCode: "de", name: "Pinguin" },
      { spracheCode: "en", name: "Penguin" },
    ],
    xp: [{ wert: 80, xpart: "0", zeit: 20 }],
    tier_gehege_kapazitaet: [],
    tierherkunft: [],
  },
  {
    id: 3,
    name: "Elefant",
    bild: null,
    preis: 1000,
    stalllevel: 3,
    verkaufswert: 400,
    auswildern: 100,
    gehege: { id: 1, name: "Hauptzoo", texte: [] },
    preisart: { name: "Diamant" },
    texte: [{ spracheCode: "de", name: "Elefant" }],
    xp: [{ wert: 200, xpart: "0", zeit: 60 }],
    tier_gehege_kapazitaet: [],
    tierherkunft: [],
  },
];

/** Standard-Props für AnimalOverviewContent */
function buildOverviewProps(overrides = {}) {
  return {
    animals: mockAnimals,
    currentItems: mockAnimals,
    filteredCount: mockAnimals.length,
    searchTerm: "",
    setSearchTerm: jest.fn(),
    selectedGehege: "Alle",
    setSelectedGehege: jest.fn(),
    selectedLevel: "Alle",
    setSelectedLevel: jest.fn(),
    setCurrentPage: jest.fn(),
    sortBy: "name",
    sortDirection: "asc",
    toggleSort: jest.fn(),
    handleEdit: jest.fn(),
    handleDelete: jest.fn(),
    handleAnimalClick: jest.fn(),
    handleResetFilters: jest.fn(),
    totalPages: 1,
    currentPage: 1,
    handleNextPage: jest.fn(),
    handlePrevPage: jest.fn(),
    ...overrides,
  };
}

// ─── 1. Tierliste korrekt gerendert ──────────────────────────────────────────

describe("1. Tierliste wird korrekt gerendert", () => {
  it("zeigt alle Tiernamen in der Tabelle an", () => {
    render(
      <AnimalDesktopTable
        animals={mockAnimals}
        sortBy="name"
        sortDirection="asc"
        onSort={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("Löwe")).toBeInTheDocument();
    expect(screen.getByText("Pinguin")).toBeInTheDocument();
    expect(screen.getByText("Elefant")).toBeInTheDocument();
  });

  it("zeigt die korrekten Spaltenüberschriften an", () => {
    render(
      <AnimalDesktopTable
        animals={mockAnimals}
        sortBy="name"
        sortDirection="asc"
        onSort={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("Art")).toBeInTheDocument();
    expect(screen.getByText("Gehege")).toBeInTheDocument();
    expect(screen.getByText("Preis")).toBeInTheDocument();
    expect(screen.getByText("Aktionen")).toBeInTheDocument();
  });

  it("zeigt den Leerstand-Hinweis bei leerer Tierliste", () => {
    render(
      <AnimalDesktopTable
        animals={[]}
        sortBy="name"
        sortDirection="asc"
        onSort={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText(/Oje, kein Tier da!/i)).toBeInTheDocument();
  });

  it("rendert AnimalOverviewContent mit vollständiger Tierliste", () => {
    render(<AnimalOverviewContent {...buildOverviewProps()} />);

    // AnimalOverviewContent rendert Desktop-Tabelle + Mobile-Liste → mehrfaches VoErrkommen möglich
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pinguin").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Elefant").length).toBeGreaterThan(0);
  });
});

// ─── 2. Filter-Logik ─────────────────────────────────────────────────────────

describe("2. Filter funktionieren korrekt", () => {
  describe("filterAnimals (reine Filterfunktion)", () => {
    it("gibt alle Tiere zurück wenn keine Filter aktiv sind", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "",
        selectedGehege: "Alle",
        selectedLevel: "Alle",
      });
      expect(result).toHaveLength(3);
    });

    it("filtert nach Gehege-Name", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "",
        selectedGehege: "Hauptzoo",
        selectedLevel: "Alle",
      });

      expect(result).toHaveLength(2);
      expect(result.map((a) => a.name)).toEqual(
        expect.arrayContaining(["Löwe", "Elefant"])
      );
    });

    it("filtert nach Suchbegriff (deutschem Tiernamen)", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "pingu",
        selectedGehege: "Alle",
        selectedLevel: "Alle",
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Pinguin");
    });

    it("filtert nach übersetztem Namen in anderem Sprachcode", () => {
      // Pinguin hat texte: [{ spracheCode: 'en', name: 'Penguin' }]
      const result = filterAnimals(mockAnimals, {
        searchTerm: "peng",
        selectedGehege: "Alle",
        selectedLevel: "Alle",
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Pinguin");
    });

    it("filtert nach Stall-Level", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "",
        selectedGehege: "Alle",
        selectedLevel: "2",
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Pinguin");
    });

    it("kombiniert Gehege- und Suchfilter", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "elef",
        selectedGehege: "Hauptzoo",
        selectedLevel: "Alle",
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Elefant");
    });

    it("gibt leeres Array zurück wenn kein Tier passt", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "xyznotfound",
        selectedGehege: "Alle",
        selectedLevel: "Alle",
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("Suchfeld-Interaktion in AnimalOverviewContent", () => {
    it("ruft setSearchTerm auf wenn Text eingegeben wird", () => {
      const setSearchTermMock = jest.fn();
      render(
        <AnimalOverviewContent
          {...buildOverviewProps({ setSearchTerm: setSearchTermMock })}
        />
      );

      const searchInput = screen.getByPlaceholderText("Suche nach Tieren...");
      fireEvent.change(searchInput, { target: { value: "Löwe" } });

      expect(setSearchTermMock).toHaveBeenCalledWith("Löwe");
    });

    it("zeigt EmptyState wenn currentItems leer ist", () => {
      render(
        <AnimalOverviewContent
          {...buildOverviewProps({ currentItems: [], filteredCount: 0 })}
        />
      );

      // EmptyState zeigt einen Reset-Button
      expect(
        screen.getByRole("button", { name: /neu starten/i })
      ).toBeInTheDocument();
    });
  });
});

// ─── 3. Tooltip mit übersetztem Namen ────────────────────────────────────────

describe("3. Tooltip zeigt korrekten übersetzten Text", () => {
  it("Edit-Button hat den deutschen übersetzten alt-Text", () => {
    render(
      <ActionGroupIcons
        localeFile="animals"
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    // Das <img> im EditButton bekommt den übersetzten Text als alt-Attribut
    expect(screen.getByAltText("Tier bearbeiten")).toBeInTheDocument();
  });

  it("Löschen-Button hat den deutschen übersetzten alt-Text", () => {
    render(
      <ActionGroupIcons
        localeFile="animals"
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByAltText("Tier löschen")).toBeInTheDocument();
  });

  it("Edit-Button ist per aria-label zugänglich", () => {
    render(
      <ActionGroupIcons
        localeFile="animals"
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    // Der Button ist per aria-label für Screen-Reader zugänglich
    expect(
      screen.getByRole("button", { name: "Tier bearbeiten" })
    ).toBeInTheDocument();
  });

  it("onEdit-Callback wird beim Klick auf den Bearbeiten-Button aufgerufen", () => {
    const onEditMock = jest.fn();
    render(
      <ActionGroupIcons
        localeFile="animals"
        onEdit={onEditMock}
        onDelete={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Tier bearbeiten" }));
    expect(onEditMock).toHaveBeenCalledTimes(1);
  });

  it("onDelete-Callback wird beim Klick auf den Löschen-Button aufgerufen", () => {
    const onDeleteMock = jest.fn();
    render(
      <ActionGroupIcons
        localeFile="animals"
        onEdit={jest.fn()}
        onDelete={onDeleteMock}
      />
    );

    fireEvent.click(screen.getByAltText("Tier löschen"));
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });
});