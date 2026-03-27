/**
 * Tests für ContestDesktopTable
 *
 * Abgedeckt:
 *  1. Spaltenüberschriften
 *  2. Zeitraum-Darstellung (DE-Format)
 *  3. Statuen/Tier-Anzeige (Name, Gehege, Fallback)
 *  4. Status-Indikator (aktiv vs. abgelaufen/bevorstehend)
 *  5. Edit- und Delete-Callbacks
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContestDesktopTable from "../../../components/contests/ContestOverview/ContestDesktopTable";

// ─── Externe Abhängigkeiten mocken ────────────────────────────────────────────

const DE_TRANSLATIONS = {
  "contests:contestOverview.table.period":         "Zeitraum",
  "contests:contestOverview.table.statues_animals": "Tiere",
  "contests:contestOverview.table.status":          "Status",
  "common:actions":                                 "Aktionen",
  "contests:status.running":                        "Läuft",
  "contests:status.upcoming":                       "Ausstehend",
  "contests:tooltips.edit":                         "Bearbeiten",
  "contests:tooltips.delete":                       "Löschen",
};

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key, fallback) => DE_TRANSLATIONS[key] ?? fallback ?? key,
    i18n: { language: "de" },
  }),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn(), locale: "de", pathname: "/" }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src }) => <img alt={alt} src={src} />,
}));

// ActionGroupIcons wird mit testbaren Buttons gemockt
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

/** Aktiver Wettbewerb: start < heute < ende */
const activeContest = {
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

/** Bevorstehender Wettbewerb: start in der Zukunft */
const upcomingContest = {
  id: 6,
  start: "2027-01-01T00:00:00.000Z",
  ende:  "2027-01-08T00:00:00.000Z",
  statuen: [],
};

// ─── 1. Spaltenüberschriften ──────────────────────────────────────────────────

describe("1. ContestDesktopTable – Spaltenüberschriften", () => {
  it("zeigt alle vier Überschriften", () => {
    render(
      <ContestDesktopTable
        contests={[activeContest]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText("Zeitraum")).toBeInTheDocument();
    expect(screen.getByText("Tiere")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Aktionen")).toBeInTheDocument();
  });
});

// ─── 2. Zeitraum-Darstellung ─────────────────────────────────────────────────

describe("2. Zeitraum-Darstellung", () => {
  it("zeigt Start- und Enddatum im deutschen Format (DD.MM.YYYY)", () => {
    render(
      <ContestDesktopTable
        contests={[activeContest]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText(/01\.01\.2026/)).toBeInTheDocument();
    expect(screen.getByText(/31\.12\.2026/)).toBeInTheDocument();
  });
});

// ─── 3. Statuen / Tier-Anzeige ───────────────────────────────────────────────

describe("3. Statuen und Tier-Anzeige", () => {
  it("zeigt den Tiernamen aus texte[0].name", () => {
    render(
      <ContestDesktopTable
        contests={[activeContest]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
  });

  it("zeigt den Gehege-Namen als SubText", () => {
    render(
      <ContestDesktopTable
        contests={[activeContest]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText("Hauptzoo")).toBeInTheDocument();
  });

  it("zeigt Fallback 'Unbekannt' wenn texte leer ist", () => {
    const contestNoName = {
      ...activeContest,
      id: 99,
      statuen: [
        {
          id: 9,
          statue: {
            tier: {
              id: 99,
              bild: null,
              gehege: { name: "Hauptzoo" },
              texte: [],
            },
          },
        },
      ],
    };
    render(
      <ContestDesktopTable
        contests={[contestNoName]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getAllByText("Unbekannt").length).toBeGreaterThan(0);
  });

  it("rendert mehrere Statuen eines Wettbewerbs", () => {
    const contestMultiStatues = {
      ...activeContest,
      statuen: [
        {
          id: 1,
          statue: {
            tier: { id: 10, bild: null, gehege: { name: "A" }, texte: [{ spracheCode: "de", name: "Löwe" }] },
          },
        },
        {
          id: 2,
          statue: {
            tier: { id: 11, bild: null, gehege: { name: "B" }, texte: [{ spracheCode: "de", name: "Pinguin" }] },
          },
        },
      ],
    };
    render(
      <ContestDesktopTable
        contests={[contestMultiStatues]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pinguin").length).toBeGreaterThan(0);
  });
});

// ─── 4. Status-Indikator ──────────────────────────────────────────────────────

describe("4. Status-Indikator", () => {
  it("zeigt title 'Läuft' für einen aktiven Wettbewerb", () => {
    render(
      <ContestDesktopTable
        contests={[activeContest]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByTitle("Läuft")).toBeInTheDocument();
  });

  it("zeigt title 'Ausstehend' für einen bevorstehenden Wettbewerb", () => {
    render(
      <ContestDesktopTable
        contests={[upcomingContest]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByTitle("Ausstehend")).toBeInTheDocument();
  });
});

// ─── 5. Edit- und Delete-Callbacks ───────────────────────────────────────────

describe("5. Edit- und Delete-Callbacks", () => {
  it("ruft onEdit(contest.id) auf bei Klick auf Bearbeiten", () => {
    const onEdit = jest.fn();
    render(
      <ContestDesktopTable
        contests={[activeContest]}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />
    );
    fireEvent.click(screen.getByTestId("edit-btn"));
    expect(onEdit).toHaveBeenCalledWith(5);
  });

  it("ruft onDelete(contest.id) auf bei Klick auf Löschen", () => {
    const onDelete = jest.fn();
    render(
      <ContestDesktopTable
        contests={[activeContest]}
        onEdit={jest.fn()}
        onDelete={onDelete}
      />
    );
    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(onDelete).toHaveBeenCalledWith(5);
  });

  it("rendert Edit/Delete-Buttons für jeden Wettbewerb", () => {
    const contests = [
      activeContest,
      { ...upcomingContest, id: 7, statuen: [] },
    ];
    render(
      <ContestDesktopTable
        contests={contests}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getAllByTestId("edit-btn")).toHaveLength(2);
    expect(screen.getAllByTestId("delete-btn")).toHaveLength(2);
  });
});
