/**
 * Tests für die ContestDetailView-Komponente
 *
 * Abgedeckte Anforderungen:
 *  1. Werden Kopfzeile und Zeitraum korrekt gerendert?
 *  2. Wird der "Eigene Tiere melden"-Button nur bei aktivem Wettbewerb angezeigt?
 *  3. Werden Tier-Karten (Name, Gesamtpunktzahl, Rang-Liste) korrekt gerendert?
 *  4. Wird der Leerstand "Noch keine Meldungen" korrekt angezeigt?
 *  5. Werden mehrere Tier-Karten gerendert?
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import ContestDetailView from "../../../components/contests/ContestDetail/ContestDetailView";

// ─── Externe Abhängigkeiten mocken ────────────────────────────────────────────

const DE_TRANSLATIONS = {
  "contests:details.headline": "Wettbewerbs-Planung",
  "contests:details.add_my_animals": "Eigene Tiere melden",
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

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }) => <a href={href}>{children}</a>,
}));

// ─── Test-Fixtures ────────────────────────────────────────────────────────────

/** Aktiver Wettbewerb (Enddatum in der Zukunft) */
const activeContest = {
  id: 5,
  start: "2026-04-01T00:00:00.000Z",
  ende: "2026-12-31T00:00:00.000Z",
  aktiv: 1,
};

/** Abgelaufener Wettbewerb (Enddatum in der Vergangenheit) */
const expiredContest = {
  id: 6,
  start: "2025-01-01T00:00:00.000Z",
  ende: "2025-01-08T00:00:00.000Z",
  aktiv: 0,
};

const mockAnalyses = [
  {
    tier: {
      id: 10,
      bild: "loewe.webp",
      gehege: { name: "Hauptzoo" },
      texte: [{ spracheCode: "de", name: "Löwe" }],
    },
    stats: {
      totalWeighted: 12500,
      rankedMembers: [
        { name: "Alice", rawSum: 500, multiplier: 15, weighted: 7500 },
        { name: "Bob",   rawSum: 250, multiplier: 20, weighted: 5000 },
      ],
    },
  },
];

const mockAnalysesEmpty = [
  {
    tier: {
      id: 11,
      bild: "pinguin.webp",
      gehege: { name: "Polarium" },
      texte: [{ spracheCode: "de", name: "Pinguin" }],
    },
    stats: {
      totalWeighted: 0,
      rankedMembers: [],
    },
  },
];

// ─── 1. Kopfzeile und Zeitraum ────────────────────────────────────────────────

describe("1. ContestDetailView – Kopfzeile und Zeitraum", () => {
  it("zeigt die Überschrift 'Wettbewerbs-Planung'", () => {
    render(<ContestDetailView contest={activeContest} analyses={mockAnalyses} />);
    expect(screen.getByText("Wettbewerbs-Planung")).toBeInTheDocument();
  });

  it("zeigt das Startdatum im deutschen Format", () => {
    render(<ContestDetailView contest={activeContest} analyses={mockAnalyses} />);
    // "2026-04-01" → "01.04.2026"
    expect(screen.getByText(/01\.04\.2026/)).toBeInTheDocument();
  });

  it("zeigt das Enddatum im deutschen Format", () => {
    render(<ContestDetailView contest={activeContest} analyses={mockAnalyses} />);
    // "2026-12-31" → "31.12.2026"
    expect(screen.getByText(/31\.12\.2026/)).toBeInTheDocument();
  });
});

// ─── 2. Aktiver vs. abgelaufener Wettbewerb ───────────────────────────────────

describe("2. 'Eigene Tiere melden'-Button – aktiv vs. abgelaufen", () => {
  it("zeigt den Button bei aktivem Wettbewerb (Enddatum in der Zukunft)", () => {
    render(<ContestDetailView contest={activeContest} analyses={mockAnalyses} />);
    expect(
      screen.getByRole("button", { name: "Eigene Tiere melden" })
    ).toBeInTheDocument();
  });

  it("verlinkt den Button zur richtigen Eintrags-URL", () => {
    render(<ContestDetailView contest={activeContest} analyses={mockAnalyses} />);
    const link = screen.getByRole("link", { name: /Eigene Tiere melden/i });
    expect(link).toHaveAttribute("href", "/contests/5/entries");
  });

  it("zeigt den Button NICHT bei abgelaufenem Wettbewerb", () => {
    render(<ContestDetailView contest={expiredContest} analyses={mockAnalyses} />);
    expect(
      screen.queryByRole("button", { name: "Eigene Tiere melden" })
    ).not.toBeInTheDocument();
  });
});

// ─── 3. Tier-Karten mit Mitgliederliste ──────────────────────────────────────

describe("3. Tier-Karten – Inhalt", () => {
  it("zeigt den Tiernamen in der Karte", () => {
    render(<ContestDetailView contest={activeContest} analyses={mockAnalyses} />);
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
  });

  it("zeigt die Gesamtpunktzahl (totalWeighted)", () => {
    render(<ContestDetailView contest={activeContest} analyses={mockAnalyses} />);
    // 12500 → "12.500 Pkt." (toLocaleString im de-Format)
    expect(screen.getByText(/Pkt\./)).toBeInTheDocument();
  });

  it("zeigt Mitgliedernamen in der Rang-Liste", () => {
    render(<ContestDetailView contest={activeContest} analyses={mockAnalyses} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("zeigt Rang-Badges (1, 2, …) für Mitglieder", () => {
    render(<ContestDetailView contest={activeContest} analyses={mockAnalyses} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("zeigt Multiplikator-Info 'rawSum × multiplier'", () => {
    render(<ContestDetailView contest={activeContest} analyses={mockAnalyses} />);
    // z.B. "500 × 15" und "250 × 20"
    expect(screen.getByText(/500 × 15/)).toBeInTheDocument();
    expect(screen.getByText(/250 × 20/)).toBeInTheDocument();
  });

  it("zeigt die Spaltenüberschriften Rang, Mitglied und Punkte", () => {
    render(<ContestDetailView contest={activeContest} analyses={mockAnalyses} />);
    expect(screen.getByText("Rang")).toBeInTheDocument();
    expect(screen.getByText("Mitglied")).toBeInTheDocument();
    expect(screen.getByText(/Punkte/i)).toBeInTheDocument();
  });
});

// ─── 4. Leerstand ─────────────────────────────────────────────────────────────

describe("4. Leerstand – keine Meldungen", () => {
  it("zeigt 'Noch keine Meldungen' wenn rankedMembers leer ist", () => {
    render(
      <ContestDetailView contest={activeContest} analyses={mockAnalysesEmpty} />
    );
    expect(screen.getByText("Noch keine Meldungen")).toBeInTheDocument();
  });

  it("zeigt auch bei leerer Liste den Tiernamen", () => {
    render(
      <ContestDetailView contest={activeContest} analyses={mockAnalysesEmpty} />
    );
    expect(screen.getAllByText("Pinguin").length).toBeGreaterThan(0);
  });
});

// ─── 5. Mehrere Tier-Karten ───────────────────────────────────────────────────

describe("5. Mehrere Tier-Karten", () => {
  const multiAnalyses = [
    ...mockAnalyses,
    {
      tier: {
        id: 12,
        bild: "elefant.webp",
        gehege: { name: "Hauptzoo" },
        texte: [{ spracheCode: "de", name: "Elefant" }],
      },
      stats: {
        totalWeighted: 8000,
        rankedMembers: [
          { name: "Charlie", rawSum: 400, multiplier: 20, weighted: 8000 },
        ],
      },
    },
  ];

  it("rendert für jede Analyse eine Tier-Karte", () => {
    render(<ContestDetailView contest={activeContest} analyses={multiAnalyses} />);
    expect(screen.getAllByText("Löwe").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Elefant").length).toBeGreaterThan(0);
  });

  it("zeigt Mitglieder aus verschiedenen Karten", () => {
    render(<ContestDetailView contest={activeContest} analyses={multiAnalyses} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });
});
