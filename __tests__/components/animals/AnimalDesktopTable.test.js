/**
 * Tests für AnimalDesktopTable
 *
 * Abgedeckt:
 *  1. Spaltenüberschriften
 *  2. Tier-Daten (Name, Gehege)
 *  3. NoResult bei leerer Tierliste
 *  4. Sort-Callbacks
 *  5. Edit- und Delete-Callbacks
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AnimalDesktopTable from "../../../components/animals/AnimalOverview/AnimalDesktopTable";

// ─── Externe Abhängigkeiten mocken ────────────────────────────────────────────

const DE_TRANSLATIONS = {
  "animals:table.species":     "Tierart",
  "animals:table.enclosure":   "Gehege",
  "animals:table.price":       "Preis",
  "animals:table.stall":       "Stalllevel",
  "animals:table.sell":        "Verkauf",
  "animals:table.release":     "Auswildern",
  "common:actions":            "Aktionen",
  "animals:empty.title":       "Keine Ergebnisse",
  "animals:tooltips.level":    "Stalllevel",
  "animals:tooltips.xp":       "XP",
  "animals:tooltips.sell":     "Verkaufswert",
  "animals:tooltips.release":  "Auswilderungswert",
  "common:payment:diamonds":   "Diamanten",
  "common:payment:zoodollar":  "Zoodollar",
};

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key) => DE_TRANSLATIONS[key] ?? key,
    i18n: { language: "de" },
  }),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn(), locale: "de" }),
}));

// Tabellen-Primitives
jest.mock("../../../components/page-structure/Table/Table", () => ({
  __esModule: true,
  default: ({ children }) => <table>{children}</table>,
}));
jest.mock("../../../components/page-structure/Table/LinkedRow", () => ({
  __esModule: true,
  default: ({ children }) => <tr>{children}</tr>,
}));
jest.mock("../../../components/page-structure/Table/InfoCell", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock("../../../components/page-structure/Table/RightAlignedTd", () => ({
  __esModule: true,
  default: ({ children }) => <td>{children}</td>,
}));
jest.mock("../../../components/page-structure/Table/DesktopOnlyTd", () => ({
  __esModule: true,
  default: ({ children }) => <td>{children}</td>,
}));
jest.mock("../../../components/page-structure/Table/NoResult", () => ({
  __esModule: true,
  default: ({ text }) => <tr><td>{text}</td></tr>,
}));
jest.mock("../../../components/page-structure/Table/ActionsHeadline", () => ({
  __esModule: true,
  default: ({ text }) => <th>{text}</th>,
}));

// SortableTableHeader: gibt den Text aus und ruft onSort auf bei Klick
jest.mock("../../../components/page-structure/Table/SortableTableHeader", () => ({
  __esModule: true,
  default: ({ text, onSort, columnKey }) => (
    <th data-columnkey={columnKey} onClick={onSort}>{text}</th>
  ),
}));

// ActionGroupIcons mit testbaren Buttons
jest.mock("../../../components/page-structure/Table/ActionGroupIcons", () => ({
  __esModule: true,
  default: ({ onEdit, onDelete }) => (
    <div>
      <button data-testid="edit-btn" onClick={onEdit}>Bearbeiten</button>
      <button data-testid="delete-btn" onClick={onDelete}>Löschen</button>
    </div>
  ),
}));

// UI-Elemente
jest.mock("../../../components/page-structure/Elements/Name", () => ({
  NameDE: ({ children }) => <span>{children}</span>,
}));
jest.mock("../../../components/ui/GehegeBadge", () => ({
  __esModule: true,
  default: ({ gehege }) => <span>{gehege?.name}</span>,
}));
jest.mock("../../../components/page-structure/icons/PriceDisplay", () => ({
  __esModule: true,
  default: ({ value }) => <span>{value}</span>,
}));
jest.mock("../../../components/ui/StallLevelBadge", () => ({
  __esModule: true,
  default: ({ level }) => <span>{level}</span>,
}));
jest.mock("../../../components/page-structure/icons/XPIcon", () => ({
  __esModule: true,
  default: ({ label }) => <span>{label}</span>,
}));
jest.mock("../../../components/page-structure/icons/ZoodollarIcon", () => ({
  __esModule: true,
  default: ({ value }) => <span>{value}</span>,
}));
jest.mock("../../../components/page-structure/icons/ItemThumbnail", () => ({
  __esModule: true,
  default: ({ name }) => <img alt={name} />,
}));
jest.mock("../../../services/AnimalHelper", () => ({
  calculateTotalXP: jest.fn(() => 100),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockAnimal = {
  id: 1,
  name: "Löwe",
  bild: "loewe.webp",
  preis: 500,
  preisart: { name: "Gold" },
  stalllevel: 3,
  verkaufswert: 50,
  auswildern: 10,
  gehege: { name: "Savanne" },
  xp: [],
};

function buildProps(overrides = {}) {
  return {
    animals:       [mockAnimal],
    sortBy:        "name",
    sortDirection: "asc",
    onSort:        jest.fn(),
    onEdit:        jest.fn(),
    onDelete:      jest.fn(),
    ...overrides,
  };
}

// ─── 1. Spaltenüberschriften ──────────────────────────────────────────────────

describe("1. Spaltenüberschriften", () => {
  it("zeigt alle Spaltenüberschriften", () => {
    render(<AnimalDesktopTable {...buildProps()} />);
    expect(screen.getByText("Tierart")).toBeInTheDocument();
    expect(screen.getByText("Gehege")).toBeInTheDocument();
    expect(screen.getByText("Preis")).toBeInTheDocument();
    expect(screen.getByText("Stalllevel")).toBeInTheDocument();
    expect(screen.getByText("XP")).toBeInTheDocument();
    expect(screen.getByText("Aktionen")).toBeInTheDocument();
  });
});

// ─── 2. Tier-Daten ────────────────────────────────────────────────────────────

describe("2. Tier-Daten", () => {
  it("zeigt den Tiernamen", () => {
    render(<AnimalDesktopTable {...buildProps()} />);
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
  });

  it("zeigt den Gehege-Namen", () => {
    render(<AnimalDesktopTable {...buildProps()} />);
    expect(screen.getByText("Savanne")).toBeInTheDocument();
  });

  it("rendert mehrere Tiere", () => {
    const animals = [
      mockAnimal,
      { ...mockAnimal, id: 2, name: "Tiger", gehege: { name: "Dschungel" } },
    ];
    render(<AnimalDesktopTable {...buildProps({ animals })} />);
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Tiger").length).toBeGreaterThan(0);
  });
});

// ─── 3. NoResult bei leerer Liste ─────────────────────────────────────────────

describe("3. NoResult bei leerer Liste", () => {
  it("zeigt NoResult wenn animals leer ist", () => {
    render(<AnimalDesktopTable {...buildProps({ animals: [] })} />);
    expect(screen.getByText(/Keine Ergebnisse/)).toBeInTheDocument();
  });

  it("zeigt KEINE Zeilen wenn animals leer ist", () => {
    render(<AnimalDesktopTable {...buildProps({ animals: [] })} />);
    expect(screen.queryByText("Löwe")).not.toBeInTheDocument();
  });
});

// ─── 4. Sort-Callbacks ────────────────────────────────────────────────────────

describe("4. Sort-Callbacks", () => {
  it("ruft onSort('name') auf bei Klick auf Tierart-Spalte", () => {
    const onSort = jest.fn();
    render(<AnimalDesktopTable {...buildProps({ onSort })} />);
    fireEvent.click(screen.getByText("Tierart"));
    expect(onSort).toHaveBeenCalledWith("name");
  });

  it("ruft onSort('gehege.name') auf bei Klick auf Gehege-Spalte", () => {
    const onSort = jest.fn();
    render(<AnimalDesktopTable {...buildProps({ onSort })} />);
    fireEvent.click(screen.getByText("Gehege"));
    expect(onSort).toHaveBeenCalledWith("gehege.name");
  });

  it("ruft onSort('stalllevel') auf bei Klick auf Stalllevel-Spalte", () => {
    const onSort = jest.fn();
    render(<AnimalDesktopTable {...buildProps({ onSort })} />);
    fireEvent.click(screen.getByText("Stalllevel"));
    expect(onSort).toHaveBeenCalledWith("stalllevel");
  });
});

// ─── 5. Edit- und Delete-Callbacks ───────────────────────────────────────────

describe("5. Edit- und Delete-Callbacks", () => {
  it("ruft onEdit(animal.id) auf bei Klick auf Bearbeiten", () => {
    const onEdit = jest.fn();
    render(<AnimalDesktopTable {...buildProps({ onEdit })} />);
    fireEvent.click(screen.getByTestId("edit-btn"));
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it("ruft onDelete(animal.id) auf bei Klick auf Löschen", () => {
    const onDelete = jest.fn();
    render(<AnimalDesktopTable {...buildProps({ onDelete })} />);
    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("rendert Edit/Delete-Buttons für jedes Tier", () => {
    const animals = [mockAnimal, { ...mockAnimal, id: 2, name: "Tiger" }];
    render(<AnimalDesktopTable {...buildProps({ animals })} />);
    expect(screen.getAllByTestId("edit-btn")).toHaveLength(2);
    expect(screen.getAllByTestId("delete-btn")).toHaveLength(2);
  });
});
