/**
 * Tests für ContestOverviewContent (Integration)
 *
 * Abgedeckt:
 *  1. Überschrift und Ergebnisinfo
 *  2. Tabelle wird bei vorhandenen Einträgen gerendert
 *  3. EmptyState bei leerer Liste
 *  4. Pagination (sichtbar / versteckt)
 *  5. Edit- und Delete-Callbacks aus der Desktop-Tabelle
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContestOverviewContent from "../../../components/contests/ContestOverview/ContestOverviewContent";

// ─── Externe Abhängigkeiten mocken ────────────────────────────────────────────

const DE_TRANSLATIONS = {
  "contests:contestOverview.table.period":          "Zeitraum",
  "contests:contestOverview.table.statues_animals":  "Tiere",
  "contests:contestOverview.table.status":           "Status",
  "common:actions":                                  "Aktionen",
  "contests:status.running":                         "Läuft",
  "contests:status.upcoming":                        "Ausstehend",
  "animals:empty.button":                            "Suche neu starten",
  "animals:empty.title":                             "Keine Ergebnisse",
  "animals:empty.message":                           "Keine Wettbewerbe gefunden.",
  "animals:empty.uppySad":                           "Uppy traurig",
  "common:results.show":                             "Angezeigt",
  "common:results.of":                               "von",
  "animals:results_unit":                            "Wettbewerbe",
};

const mockReload = jest.fn();

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key, fallback) => DE_TRANSLATIONS[key] ?? fallback ?? key,
    i18n: { language: "de" },
  }),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    reload: mockReload,
    locale: "de",
    pathname: "/contests",
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src }) => <img alt={alt} src={src} />,
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

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockContest = {
  id: 5,
  start: "2026-01-01T00:00:00.000Z",
  ende:  "2026-12-31T00:00:00.000Z",
  statuen: [
    {
      id: 1,
      statue: {
        tier: {
          id: 10,
          bild: "loewe.webp",
          gehege: { name: "Hauptzoo" },
          texte: [{ spracheCode: "de", name: "Löwe" }],
        },
      },
    },
  ],
};

function buildProps(overrides = {}) {
  return {
    contests:           [mockContest],
    currentItems:       [mockContest],
    handleContestClick: jest.fn(),
    handleEdit:         jest.fn(),
    handleDelete:       jest.fn(),
    totalPages:         1,
    currentPage:        1,
    handleNextPage:     jest.fn(),
    handlePrevPage:     jest.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  mockReload.mockClear();
});

// ─── 1. Überschrift und Ergebnisinfo ──────────────────────────────────────────

describe("1. ContestOverviewContent – Überschrift und Ergebnisinfo", () => {
  it("zeigt die Überschrift 'Zoo 2 Wettbewerbe'", () => {
    render(<ContestOverviewContent {...buildProps()} />);
    expect(screen.getByText("Zoo 2 Wettbewerbe")).toBeInTheDocument();
  });

  it("zeigt die Ergebnisanzahl", () => {
    render(<ContestOverviewContent {...buildProps()} />);
    // ResultsInfo: "Angezeigt 1 von 1 ..."
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });
});

// ─── 2. Tabelle bei vorhandenen Einträgen ─────────────────────────────────────

describe("2. Tabelle bei vorhandenen Einträgen", () => {
  it("rendert die Tabelle mit Zeitraum-Spalte", () => {
    render(<ContestOverviewContent {...buildProps()} />);
    expect(screen.getByText("Zeitraum")).toBeInTheDocument();
  });

  it("zeigt den Tiernamen des Wettbewerbs", () => {
    render(<ContestOverviewContent {...buildProps()} />);
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
  });

  it("zeigt das Startdatum im deutschen Format", () => {
    render(<ContestOverviewContent {...buildProps()} />);
    expect(screen.getAllByText(/01\.01\.2026/).length).toBeGreaterThan(0);
  });
});

// ─── 3. EmptyState bei leerer Liste ──────────────────────────────────────────

describe("3. EmptyState bei leerer Liste", () => {
  it("zeigt EmptyState wenn currentItems leer ist", () => {
    render(
      <ContestOverviewContent
        {...buildProps({ currentItems: [], contests: [] })}
      />
    );
    expect(screen.getByText("Keine Ergebnisse")).toBeInTheDocument();
  });

  it("zeigt die Tabelle NICHT wenn currentItems leer ist", () => {
    render(
      <ContestOverviewContent
        {...buildProps({ currentItems: [], contests: [] })}
      />
    );
    expect(screen.queryByText("Zeitraum")).not.toBeInTheDocument();
  });
});

// ─── 4. Pagination ────────────────────────────────────────────────────────────

describe("4. Pagination", () => {
  it("zeigt keine Pagination-Buttons bei totalPages = 1", () => {
    render(<ContestOverviewContent {...buildProps({ totalPages: 1 })} />);
    // PaginationSignpost wird nicht gerendert → keine Wegweiser-Buttons
    expect(screen.queryByRole("button", { name: /weiter/i })).not.toBeInTheDocument();
  });

  it("zeigt Pagination-Buttons bei totalPages > 1", () => {
    render(
      <ContestOverviewContent
        {...buildProps({ totalPages: 3, currentPage: 2 })}
      />
    );
    // 2 Wegweiser-Buttons (prev + next) + 2 ActionGroupIcons-Buttons
    const paginationButtons = screen.getAllByRole("button").filter(
      (btn) => !btn.dataset.testid
    );
    expect(paginationButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("prev-Button ist disabled auf Seite 1", () => {
    render(
      <ContestOverviewContent
        {...buildProps({ totalPages: 3, currentPage: 1 })}
      />
    );
    const allButtons = screen.getAllByRole("button");
    const disabledButtons = allButtons.filter((b) => b.disabled && !b.dataset.testid);
    expect(disabledButtons.length).toBeGreaterThan(0);
  });

  it("next-Button ist disabled auf der letzten Seite", () => {
    render(
      <ContestOverviewContent
        {...buildProps({ totalPages: 3, currentPage: 3 })}
      />
    );
    const allButtons = screen.getAllByRole("button");
    const disabledButtons = allButtons.filter((b) => b.disabled && !b.dataset.testid);
    expect(disabledButtons.length).toBeGreaterThan(0);
  });
});

// ─── 5. Edit- und Delete-Callbacks ───────────────────────────────────────────

describe("5. Edit- und Delete-Callbacks", () => {
  it("ruft handleEdit(contest.id) auf bei Klick auf Bearbeiten (Desktop-Tabelle)", () => {
    const handleEdit = jest.fn();
    render(<ContestOverviewContent {...buildProps({ handleEdit })} />);
    fireEvent.click(screen.getByTestId("edit-btn"));
    expect(handleEdit).toHaveBeenCalledWith(5);
  });

  it("ruft handleDelete(contest.id) auf bei Klick auf Löschen (Desktop-Tabelle)", () => {
    const handleDelete = jest.fn();
    render(<ContestOverviewContent {...buildProps({ handleDelete })} />);
    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(handleDelete).toHaveBeenCalledWith(5);
  });
});
