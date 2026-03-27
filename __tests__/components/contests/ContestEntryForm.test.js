/**
 * Tests für die ContestEntryForm-Komponente
 *
 * Abgedeckte Anforderungen:
 *  1. Wird das Formular korrekt gerendert (Überschrift, Datum, Mitglied-Select)?
 *  2. Werden Tier-Abschnitte mit DynamicRowInput korrekt gerendert?
 *  3. Reagieren die Interaktionen (Select, addRow, removeRow, onChange, Submit) korrekt?
 *  4. Werden Mitglieder korrekt dargestellt (upjersname vs. name)?
 *  5. Werden mehrere Tier-Abschnitte gerendert?
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContestEntryForm from "../../../components/contests/ContestEntryForm/ContestEntryForm";

// ─── Externe Abhängigkeiten mocken ────────────────────────────────────────────

const DE_TRANSLATIONS = {
  "contests:entry.title": "Tiere eintragen",
  "contests:entry.chooseMember": "Mitglied wählen",
  "common:addRow": "Zeile hinzufügen",
  "common:allLanguages": "Alle Sprachen belegt",
};

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key, fallback) => DE_TRANSLATIONS[key] ?? fallback ?? key,
    i18n: { language: "de" },
  }),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/",
    locale: "de",
    query: {},
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src }) => <img alt={alt} src={src} />,
}));

// ─── Test-Fixtures ────────────────────────────────────────────────────────────

const mockContest = {
  id: 5,
  start: "2026-04-01T00:00:00.000Z",
  ende: "2026-12-31T00:00:00.000Z",
  statuen: [
    {
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

const mockMembers = [
  { id: 1, upjersname: "Alice",  name: "AliceReal" },
  { id: 2, upjersname: null,     name: "Bob" },
];

const mockColumns = [
  { key: "level", label: "Level",  type: "number", placeholder: "", $flex: 1 },
  { key: "count", label: "Anzahl", type: "number", placeholder: "", $flex: 1 },
];

const mockEntries = {
  10: [{ id: 1, level: "", count: "" }],
};

function makeMockHandlers() {
  return {
    addRow:         jest.fn(),
    removeRow:      jest.fn(),
    handleRowChange: jest.fn(),
  };
}

/** Standard-Props — alle Mocks austauschbar per overrides */
function buildProps(overrides = {}) {
  return {
    contest:         mockContest,
    members:         mockMembers,
    selectedMember:  "",
    setSelectedMember: jest.fn(),
    entries:         mockEntries,
    columns:         mockColumns,
    handlers:        makeMockHandlers(),
    onSubmit:        jest.fn(),
    ...overrides,
  };
}

// ─── 1. Formular rendern ──────────────────────────────────────────────────────

describe("1. ContestEntryForm wird korrekt gerendert", () => {
  it("zeigt die Überschrift 'Tiere eintragen'", () => {
    render(<ContestEntryForm {...buildProps()} />);
    expect(screen.getByText("Tiere eintragen")).toBeInTheDocument();
  });

  it("zeigt den Zeitraum im deutschen Datumsformat", () => {
    render(<ContestEntryForm {...buildProps()} />);
    expect(screen.getByText(/01\.04\.2026/)).toBeInTheDocument();
    expect(screen.getByText(/31\.12\.2026/)).toBeInTheDocument();
  });

  it("zeigt das Label 'Klubmitglied'", () => {
    render(<ContestEntryForm {...buildProps()} />);
    expect(screen.getByText("Klubmitglied")).toBeInTheDocument();
  });

  it("zeigt den Mitglied-Select mit Placeholder", () => {
    render(<ContestEntryForm {...buildProps()} />);
    expect(screen.getByDisplayValue("Mitglied wählen")).toBeInTheDocument();
  });

  it("zeigt alle Mitglieder als Optionen im Select", () => {
    render(<ContestEntryForm {...buildProps()} />);
    expect(screen.getByRole("option", { name: "Alice" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Bob" })).toBeInTheDocument();
  });

  it("zeigt den Submit-Button 'Speichern'", () => {
    render(<ContestEntryForm {...buildProps()} />);
    expect(
      screen.getByRole("button", { name: "Speichern" })
    ).toBeInTheDocument();
  });
});

// ─── 2. Tier-Abschnitte ───────────────────────────────────────────────────────

describe("2. Tier-Abschnitte werden korrekt gerendert", () => {
  it("zeigt den Tiernamen aus contest.statuen", () => {
    render(<ContestEntryForm {...buildProps()} />);
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
  });

  it("zeigt die Spaltenüberschriften des DynamicRowInput", () => {
    render(<ContestEntryForm {...buildProps()} />);
    expect(screen.getByText("Level")).toBeInTheDocument();
    expect(screen.getByText("Anzahl")).toBeInTheDocument();
  });

  it("zeigt den 'Zeile hinzufügen'-Button", () => {
    render(<ContestEntryForm {...buildProps()} />);
    expect(screen.getByRole("button", { name: "Zeile hinzufügen" })).toBeInTheDocument();
  });

  it("zeigt den Löschen-Button für vorhandene Zeilen", () => {
    render(<ContestEntryForm {...buildProps()} />);
    expect(screen.getByTitle("Löschen")).toBeInTheDocument();
  });

  it("zeigt Fallback 'Unbekannt' wenn kein Tiertext vorhanden", () => {
    const contestNoName = {
      ...mockContest,
      statuen: [
        {
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
      <ContestEntryForm
        {...buildProps({
          contest: contestNoName,
          entries: { 99: [{ id: 1, level: "", count: "" }] },
        })}
      />
    );
    expect(screen.getAllByText("Unbekannt").length).toBeGreaterThan(0);
  });
});

// ─── 3. Mitglieder-Darstellung ────────────────────────────────────────────────

describe("3. Mitglieder im Select – upjersname vs. name", () => {
  it("verwendet upjersname als Label wenn vorhanden", () => {
    render(<ContestEntryForm {...buildProps()} />);
    // upjersname: "Alice" — NICHT "AliceReal"
    expect(screen.getByRole("option", { name: "Alice" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "AliceReal" })).not.toBeInTheDocument();
  });

  it("verwendet name als Fallback wenn upjersname null ist", () => {
    render(<ContestEntryForm {...buildProps()} />);
    // upjersname: null → name: "Bob"
    expect(screen.getByRole("option", { name: "Bob" })).toBeInTheDocument();
  });
});

// ─── 4. Interaktionen ─────────────────────────────────────────────────────────

describe("4. Interaktionen", () => {
  it("ruft setSelectedMember auf wenn ein Mitglied ausgewählt wird", () => {
    const setSelectedMember = jest.fn();
    render(<ContestEntryForm {...buildProps({ setSelectedMember })} />);
    const select = screen.getByDisplayValue("Mitglied wählen");
    fireEvent.change(select, { target: { value: "1" } });
    expect(setSelectedMember).toHaveBeenCalledWith("1");
  });

  it("ruft handlers.addRow(tierId) auf bei Klick auf 'Zeile hinzufügen'", () => {
    const handlers = makeMockHandlers();
    render(<ContestEntryForm {...buildProps({ handlers })} />);
    fireEvent.click(screen.getByRole("button", { name: "Zeile hinzufügen" }));
    expect(handlers.addRow).toHaveBeenCalledWith(10);
  });

  it("ruft handlers.removeRow(tierId, rowId) auf bei Klick auf Löschen", () => {
    const handlers = makeMockHandlers();
    render(<ContestEntryForm {...buildProps({ handlers })} />);
    fireEvent.click(screen.getByTitle("Löschen"));
    expect(handlers.removeRow).toHaveBeenCalledWith(10, 1);
  });

  it("ruft handlers.handleRowChange auf bei Input-Änderung", () => {
    const handlers = makeMockHandlers();
    render(<ContestEntryForm {...buildProps({ handlers })} />);
    // Zwei number-Inputs: Level (index 0) und Anzahl (index 1)
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "5" } });
    expect(handlers.handleRowChange).toHaveBeenCalledWith(10, 1, "level", "5");
  });

  it("ruft onSubmit auf beim Absenden des Formulars", () => {
    const onSubmit = jest.fn((e) => e.preventDefault());
    render(<ContestEntryForm {...buildProps({ onSubmit })} />);
    fireEvent.submit(screen.getByRole("button", { name: "Speichern" }).closest("form"));
    expect(onSubmit).toHaveBeenCalled();
  });
});

// ─── 5. Mehrere Tier-Abschnitte ───────────────────────────────────────────────

describe("5. Mehrere Tier-Abschnitte", () => {
  const multiContest = {
    ...mockContest,
    statuen: [
      {
        statue: {
          tier: {
            id: 10,
            bild: "loewe.webp",
            gehege: { name: "Hauptzoo" },
            texte: [{ spracheCode: "de", name: "Löwe" }],
          },
        },
      },
      {
        statue: {
          tier: {
            id: 11,
            bild: "pinguin.webp",
            gehege: { name: "Polarium" },
            texte: [{ spracheCode: "de", name: "Pinguin" }],
          },
        },
      },
    ],
  };

  const multiEntries = {
    10: [{ id: 1, level: "", count: "" }],
    11: [{ id: 2, level: "", count: "" }],
  };

  it("rendert für jedes Tier einen eigenen Abschnitt", () => {
    render(
      <ContestEntryForm
        {...buildProps({ contest: multiContest, entries: multiEntries })}
      />
    );
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pinguin").length).toBeGreaterThan(0);
  });

  it("rendert für jedes Tier einen eigenen 'Zeile hinzufügen'-Button", () => {
    render(
      <ContestEntryForm
        {...buildProps({ contest: multiContest, entries: multiEntries })}
      />
    );
    expect(screen.getAllByRole("button", { name: "Zeile hinzufügen" })).toHaveLength(2);
  });
});
