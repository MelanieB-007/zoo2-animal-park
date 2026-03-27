/**
 * Tests für ContestMobileCard
 *
 * Abgedeckt:
 *  1. Datumsanzeige (DD.MM.YYYY)
 *  2. Status-Indikator (aktiv / bevorstehend)
 *  3. Tier-Namen aus statuen
 *  4. onClick-Callback
 *  5. Fallback "Unbekannt" bei fehlenden texten
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContestMobileCard from "../../../components/contests/ContestOverview/ContestMobileCard";

// ─── Externe Abhängigkeiten mocken ────────────────────────────────────────────

const DE_TRANSLATIONS = {
  "contests:contestOverview.status.running":  "Läuft",
  "contests:contestOverview.status.upcoming": "Ausstehend",
};

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key) => DE_TRANSLATIONS[key] ?? key,
    i18n: { language: "de" },
  }),
}));

jest.mock("lucide-react", () => ({
  Calendar: () => <svg data-testid="calendar-icon" />,
}));

jest.mock("../../../components/page-structure/icons/ItemThumbnail", () => ({
  __esModule: true,
  default: ({ name }) => <img alt={name} />,
}));

jest.mock("../../../components/page-structure/Elements/Name", () => ({
  NameDE: ({ children }) => <span>{children}</span>,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/** Aktiver Wettbewerb: start in der Vergangenheit, ende weit in der Zukunft */
const activeContest = {
  id: 1,
  start: "2020-01-01T00:00:00.000Z",
  ende:  "2099-12-31T00:00:00.000Z",
  statuen: [
    {
      id: 1,
      statue: {
        tier: {
          id: 10,
          bild: "loewe.webp",
          gehege: { name: "Savanne" },
          texte: [{ spracheCode: "de", name: "Löwe" }],
        },
      },
    },
  ],
};

/** Bevorstehender Wettbewerb */
const upcomingContest = {
  id: 2,
  start: "2099-01-01T00:00:00.000Z",
  ende:  "2099-12-31T00:00:00.000Z",
  statuen: [],
};

// ─── 1. Datumsanzeige ─────────────────────────────────────────────────────────

describe("1. Datumsanzeige", () => {
  it("zeigt das Startdatum im deutschen Format", () => {
    render(<ContestMobileCard contest={activeContest} onClick={jest.fn()} />);
    expect(screen.getByText(/01\.01\.2020/)).toBeInTheDocument();
  });

  it("zeigt das Enddatum im deutschen Format", () => {
    render(<ContestMobileCard contest={activeContest} onClick={jest.fn()} />);
    expect(screen.getByText(/31\.12\.2099/)).toBeInTheDocument();
  });
});

// ─── 2. Status-Indikator ──────────────────────────────────────────────────────

describe("2. Status-Indikator", () => {
  it("zeigt title 'Läuft' für einen aktiven Wettbewerb", () => {
    render(<ContestMobileCard contest={activeContest} onClick={jest.fn()} />);
    expect(screen.getByTitle("Läuft")).toBeInTheDocument();
  });

  it("zeigt title 'Ausstehend' für einen bevorstehenden Wettbewerb", () => {
    render(<ContestMobileCard contest={upcomingContest} onClick={jest.fn()} />);
    expect(screen.getByTitle("Ausstehend")).toBeInTheDocument();
  });
});

// ─── 3. Tier-Namen ───────────────────────────────────────────────────────────

describe("3. Tier-Namen aus statuen", () => {
  it("zeigt den Tiernamen aus texte[0]", () => {
    render(<ContestMobileCard contest={activeContest} onClick={jest.fn()} />);
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
  });

  it("zeigt 'Unbekannt' wenn texte leer ist", () => {
    const contestNoName = {
      ...activeContest,
      statuen: [{
        id: 9,
        statue: {
          tier: { id: 99, bild: null, gehege: { name: "Zoo" }, texte: [] },
        },
      }],
    };
    render(<ContestMobileCard contest={contestNoName} onClick={jest.fn()} />);
    expect(screen.getAllByText("Unbekannt").length).toBeGreaterThan(0);
  });

  it("rendert mehrere Statuen", () => {
    const contestMulti = {
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
    render(<ContestMobileCard contest={contestMulti} onClick={jest.fn()} />);
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pinguin").length).toBeGreaterThan(0);
  });
});

// ─── 4. onClick-Callback ─────────────────────────────────────────────────────

describe("4. onClick-Callback", () => {
  it("ruft onClick auf wenn die Karte angeklickt wird", () => {
    const onClick = jest.fn();
    const { container } = render(
      <ContestMobileCard contest={activeContest} onClick={onClick} />
    );
    fireEvent.click(container.firstChild);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});