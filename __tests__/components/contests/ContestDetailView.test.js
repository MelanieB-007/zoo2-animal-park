import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContestDetailView from "../../../components/contests/ContestDetail/ContestDetailView";

// Mocks
jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key, fallback) => fallback || key,
  }),
}));

jest.mock("next/link", () => {
  return function MockLink({ href, children }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("../../../components/page-structure/icons/ItemThumbnail", () => {
  return function MockItemThumbnail({ name }) {
    return <div data-testid="item-thumbnail">{name}</div>;
  };
});

jest.mock("../../../components/page-structure/PageHeader", () => {
  return function MockPageHeader({ text }) {
    return <h1>{text}</h1>;
  };
});

jest.mock("../../../components/page-structure/Table/ActionGroupIcons", () => {
  return function MockActionGroupIcons({ onEdit, onDelete }) {
    return (
      <div data-testid="action-icons">
        <button data-testid="edit-btn" onClick={onEdit}>
          Bearbeiten
        </button>
        <button data-testid="delete-btn" onClick={onDelete}>
          Löschen
        </button>
      </div>
    );
  };
});

// Hilfsfunktion: Contest-Daten erstellen
function makeContest({ isExpired = false } = {}) {
  const now = new Date();
  const start = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  const ende = isExpired
    ? new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    : new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

  return { id: 1, start: start.toISOString(), ende: ende.toISOString() };
}

const mockAnalyses = [
  {
    tier: {
      id: 10,
      bild: "loewe.png",
      texte: [{ name: "Löwe" }],
      gehege: { name: "Savanne" },
    },
    stats: {
      totalWeighted: 620,
      rankedMembers: [
        { name: "Alice", rawSum: 100, multiplier: 4, weighted: 400 },
        { name: "Bob", rawSum: 50, multiplier: 3, weighted: 150 },
      ],
    },
  },
  {
    tier: {
      id: 20,
      bild: "tiger.png",
      texte: [{ name: "Tiger" }],
      gehege: { name: "Dschungel" },
    },
    stats: {
      totalWeighted: 0,
      rankedMembers: [],
    },
  },
];

describe("ContestDetailView – Rendering", () => {
  test("zeigt Datum-Bereich des Wettbewerbs an", () => {
    render(
      <ContestDetailView
        contest={makeContest()}
        analyses={mockAnalyses}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    // Datum-Bereich wird angezeigt (enthält ein "–" Trennzeichen)
    const metaText = document.body.textContent;
    expect(metaText).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });

  test("rendert Tier-Karten für alle Analysen", () => {
    render(
      <ContestDetailView
        contest={makeContest()}
        analyses={mockAnalyses}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    // "Löwe" erscheint in Thumbnail + h3, daher getAllByText
    expect(screen.getAllByText("Löwe").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Tiger").length).toBeGreaterThanOrEqual(1);
  });

  test("zeigt Gesamtpunkte pro Tier an", () => {
    render(
      <ContestDetailView
        contest={makeContest()}
        analyses={mockAnalyses}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("620 Pkt.")).toBeInTheDocument();
    expect(screen.getByText("0 Pkt.")).toBeInTheDocument();
  });

  test("zeigt Mitglieder mit Rang, Multiplikator und Punkten an", () => {
    render(
      <ContestDetailView
        contest={makeContest()}
        analyses={mockAnalyses}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    // Multiplikator-Anzeige
    expect(screen.getByText("100 × 4")).toBeInTheDocument();
    expect(screen.getByText("50 × 3")).toBeInTheDocument();
  });

  test("zeigt 'Noch keine Meldungen' wenn rankedMembers leer ist", () => {
    render(
      <ContestDetailView
        contest={makeContest()}
        analyses={mockAnalyses}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("Noch keine Meldungen")).toBeInTheDocument();
  });

  test("zeigt ActionGroupIcons (Edit/Delete)", () => {
    render(
      <ContestDetailView
        contest={makeContest()}
        analyses={mockAnalyses}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByTestId("action-icons")).toBeInTheDocument();
  });
});

describe("ContestDetailView – Aktiver vs. abgelaufener Wettbewerb", () => {
  test("zeigt 'Eigene Tiere melden'-Button wenn Wettbewerb noch aktiv", () => {
    render(
      <ContestDetailView
        contest={makeContest({ isExpired: false })}
        analyses={[]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("Eigene Tiere melden")).toBeInTheDocument();
  });

  test("versteckt 'Eigene Tiere melden'-Button wenn Wettbewerb abgelaufen", () => {
    render(
      <ContestDetailView
        contest={makeContest({ isExpired: true })}
        analyses={[]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.queryByText("Eigene Tiere melden")).not.toBeInTheDocument();
  });

  test("Link zum Eintragen zeigt auf /contests/[id]/entries", () => {
    render(
      <ContestDetailView
        contest={makeContest({ isExpired: false })}
        analyses={[]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const link = screen.getByText("Eigene Tiere melden").closest("a");
    expect(link).toHaveAttribute("href", "/contests/1/entries");
  });
});

describe("ContestDetailView – Aktionen", () => {
  test("ruft onEdit mit contest.id auf", async () => {
    const onEdit = jest.fn();
    render(
      <ContestDetailView
        contest={makeContest()}
        analyses={[]}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />
    );

    await userEvent.click(screen.getByTestId("edit-btn"));

    expect(onEdit).toHaveBeenCalledWith(1);
  });

  test("ruft onDelete mit contest.id auf", async () => {
    const onDelete = jest.fn();
    render(
      <ContestDetailView
        contest={makeContest()}
        analyses={[]}
        onEdit={jest.fn()}
        onDelete={onDelete}
      />
    );

    await userEvent.click(screen.getByTestId("delete-btn"));

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
