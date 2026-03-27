/**
 * Tests für die AnimalDetails-Komponenten
 *
 * Abgedeckte Anforderungen:
 *  1. Wird der Tiername sprachabhängig (locale) korrekt angezeigt?
 *  2. Werden alle Detailinformationen (Beschreibung, Stats, Zucht, Kapazität) gerendert?
 *  3. Werden Farbvarianten korrekt gerendert?
 *  4. Reagieren Edit- und Delete-Callbacks auf Klick?
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import AnimalDetailContent from "../../../components/animals/AnimalDetails/AnimalDetailContent";
import HeaderCard from "../../../components/animals/AnimalDetails/HeaderCard";
import AccordionCard from "../../../components/animals/AnimalDetails/AccordionCard";
import VariantArea from "../../../components/animals/AnimalDetails/VariantArea";

// ─── Locale-Variable für router-Mock (per Test änderbar) ─────────────────────

let mockLocale = "de";

// ─── Externe Abhängigkeiten mocken ────────────────────────────────────────────

const DE_TRANSLATIONS = {
  "animals:tablePrice": "Kaufpreis",
  "animals:tableSell": "Verkaufswert",
  "animals:tableRelease": "Auswildern",
  "animals:table.stall": "Stall",
  "animals:breeding.breeding": "Zucht",
  "animals:breeding.breedingChance": "Zuchtchance",
  "animals:breeding.xpAndActions": "XP & Aktionen",
  "animals:biomesCapacity": "Gehegekapazität",
  "animals:animalCount": "Anzahl Tiere",
  "animals:biomeSize": "Gehegegröße",
  "animals:colorVariants": "Farbvarianten",
  "common:description": "Beschreibung",
  "common:enclosure": "Gehege",
  "common:release": "Release",
  "common:popularity": "Popularität",
  "common:costs": "Kosten",
  "common:time": "Zeit",
  "common:action": "Aktion",
  "common:not_found": "Nicht gefunden",
  "common:noDescriptionAvailable": "Keine Beschreibung vorhanden",
  "common:loading_data": "Daten werden gerade vom System erfasst...",
  "animals:tooltips.edit": "Tier bearbeiten",
  "animals:tooltips.delete": "Tier löschen",
};

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key) => DE_TRANSLATIONS[key] ?? key,
    i18n: { language: "de" },
  }),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/",
    locale: mockLocale,
    query: {},
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src, width, height }) => (
    <img alt={alt} src={src} width={width} height={height} />
  ),
}));

// ─── Test-Fixture ─────────────────────────────────────────────────────────────

const mockAnimal = {
  id: 1,
  name: "Löwe",
  bild: "loewe.webp",
  release: "15.03.2024",
  preis: 500,
  popularitaet: 80,
  verkaufswert: 200,
  auswildern: 50,
  stalllevel: 2,
  zuchtkosten: 100,
  zuchtdauer: 24,
  startprozent: 10,
  beschreibung: "Fallback Beschreibung",
  gehege: { id: 1, name: "Hauptzoo" },
  preisart: { name: "Gold" },
  texte: [
    {
      spracheCode: "de",
      name: "Löwe",
      beschreibung: "Der König der Tiere",
    },
    {
      spracheCode: "en",
      name: "Lion",
      beschreibung: "The king of animals",
    },
  ],
  xp: [
    { id: 1, xpart: 0, wert: 100, zeit: 60 },
    { id: 2, xpart: 1, wert: 80, zeit: 120 },
  ],
  tier_gehege_kapazitaet: [
    { anzahlTiere: 1, felder: 10 },
    { anzahlTiere: 2, felder: 20 },
  ],
  tierherkunft: [],
  variants: [],
};

beforeEach(() => {
  mockLocale = "de";
});

// ─── 1. Tiername sprachabhängig (AnimalDetailContent & HeaderCard) ────────────

describe("1. Tiername wird sprachabhängig angezeigt", () => {
  it("zeigt den deutschen Namen bei locale='de'", () => {
    mockLocale = "de";
    render(
      <AnimalDetailContent
        animal={mockAnimal}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByRole("heading", { name: "Löwe" })).toBeInTheDocument();
  });

  it("zeigt den englischen Namen bei locale='en'", () => {
    mockLocale = "en";
    render(
      <HeaderCard animal={mockAnimal} />
    );
    expect(screen.getByRole("heading", { name: "Lion" })).toBeInTheDocument();
  });

  it("fällt auf den deutschen Namen zurück wenn kein Locale-Text existiert", () => {
    mockLocale = "nl"; // Kein niederländischer Text in mockAnimal
    render(<HeaderCard animal={mockAnimal} />);
    // Fallback: deutscher Text aus texte oder root .name
    expect(screen.getByRole("heading", { name: "Löwe" })).toBeInTheDocument();
  });

  it("zeigt 'Nicht gefunden' wenn kein animal übergeben wird", () => {
    render(
      <AnimalDetailContent
        animal={null}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText("Nicht gefunden")).toBeInTheDocument();
  });
});

// ─── 2. Beschreibung & Stats ──────────────────────────────────────────────────

describe("2. Beschreibung und Stats werden korrekt angezeigt", () => {
  it("zeigt die deutsche Beschreibung aus texte", () => {
    mockLocale = "de";
    render(
      <AnimalDetailContent
        animal={mockAnimal}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText("Der König der Tiere")).toBeInTheDocument();
  });

  it("zeigt die englische Beschreibung bei locale='en'", () => {
    mockLocale = "en";
    render(
      <AnimalDetailContent
        animal={mockAnimal}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText("The king of animals")).toBeInTheDocument();
  });

  it("zeigt Fallback-Text wenn keine Beschreibung für die Locale existiert", () => {
    mockLocale = "nl";
    const animalWithoutNl = {
      ...mockAnimal,
      texte: [{ spracheCode: "de", name: "Löwe", beschreibung: null }],
      beschreibung: null,
    };
    render(
      <AnimalDetailContent
        animal={animalWithoutNl}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText("Keine Beschreibung vorhanden")).toBeInTheDocument();
  });

  it("zeigt das Release-Datum in der HeaderCard", () => {
    render(<HeaderCard animal={mockAnimal} />);
    // Das Datum wird von FormattedDate gerendert — wir prüfen den Label-Text
    expect(screen.getByText(/Release/i)).toBeInTheDocument();
  });

  it("zeigt den Kaufpreis-Label in der HeaderCard", () => {
    render(<HeaderCard animal={mockAnimal} />);
    expect(screen.getByText("Kaufpreis")).toBeInTheDocument();
  });

  it("zeigt den Verkaufswert-Label in der HeaderCard", () => {
    render(<HeaderCard animal={mockAnimal} />);
    expect(screen.getByText("Verkaufswert")).toBeInTheDocument();
  });

  it("zeigt den Popularitäts-Label in der HeaderCard", () => {
    render(<HeaderCard animal={mockAnimal} />);
    expect(screen.getByText("Popularität")).toBeInTheDocument();
  });
});

// ─── 3. AccordionCard: Zucht, XP und Kapazität ───────────────────────────────

describe("3. AccordionCard zeigt Zucht-, XP- und Kapazitätsdaten", () => {
  it("zeigt den Zucht-Akkordeon-Titel", () => {
    render(<AccordionCard animal={mockAnimal} />);
    expect(screen.getByText("Zucht")).toBeInTheDocument();
  });

  it("zeigt die Zuchtdauer", () => {
    render(<AccordionCard animal={mockAnimal} />);
    expect(screen.getByText(/24 h/)).toBeInTheDocument();
  });

  it("zeigt die Zuchtchance", () => {
    render(<AccordionCard animal={mockAnimal} />);
    expect(screen.getByText(/10 %/)).toBeInTheDocument();
  });

  it("zeigt den XP-Aktionen-Akkordeon-Titel", () => {
    render(<AccordionCard animal={mockAnimal} />);
    expect(screen.getByText("XP & Aktionen")).toBeInTheDocument();
  });

  it("zeigt die Kapazitätstabelle wenn Daten vorhanden", () => {
    render(<AccordionCard animal={mockAnimal} />);
    // Kapazitätsdaten: 1 Tier → 10 Felder, 2 Tiere → 20 Felder
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("zeigt Leerstand-Text wenn keine Kapazitätsdaten vorhanden", () => {
    const animalWithoutCapacity = {
      ...mockAnimal,
      tier_gehege_kapazitaet: [],
    };
    render(<AccordionCard animal={animalWithoutCapacity} />);
    expect(
      screen.getByText(/Daten werden gerade vom System erfasst/i)
    ).toBeInTheDocument();
  });
});

// ─── 4. Farbvarianten (VariantArea & VariantCard) ────────────────────────────

describe("4. Farbvarianten werden korrekt gerendert", () => {
  it("rendert nichts wenn keine Varianten vorhanden", () => {
    const { container } = render(<VariantArea animal={mockAnimal} />);
    expect(container.firstChild).toBeNull();
  });

  it("zeigt den Farbvarianten-Abschnittstitel wenn Varianten vorhanden", () => {
    const animalWithVariants = {
      ...mockAnimal,
      variants: [
        {
          id: 101,
          name: "Weißer Löwe",
          farbe: "Weiß",
          bild: "weisser-loewe.webp",
          release: "01.06.2024",
          herkunft: null,
        },
      ],
    };
    render(<VariantArea animal={animalWithVariants} />);
    expect(screen.getByText("Farbvarianten")).toBeInTheDocument();
  });

  it("zeigt den Farbnamen der Variante", () => {
    const animalWithVariants = {
      ...mockAnimal,
      variants: [
        {
          id: 101,
          name: "Weißer Löwe",
          farbe: "Weiß",
          bild: "weisser-loewe.webp",
          release: "01.06.2024",
          herkunft: null,
        },
      ],
    };
    render(<VariantArea animal={animalWithVariants} />);
    expect(screen.getByText("Weiß")).toBeInTheDocument();
  });

  it("zeigt das Release-Datum der Variante", () => {
    const animalWithVariants = {
      ...mockAnimal,
      variants: [
        {
          id: 101,
          name: "Weißer Löwe",
          farbe: "Weiß",
          bild: "weisser-loewe.webp",
          release: "01.06.2024",
          herkunft: null,
        },
      ],
    };
    render(<VariantArea animal={animalWithVariants} />);
    expect(screen.getByText(/Release: 01\.06\.2024/)).toBeInTheDocument();
  });

  it("zeigt mehrere Varianten-Karten", () => {
    const animalWithVariants = {
      ...mockAnimal,
      variants: [
        { id: 101, name: "Weißer Löwe", farbe: "Weiß", bild: "v1.webp", release: "01.06.2024", herkunft: null },
        { id: 102, name: "Schwarzer Löwe", farbe: "Schwarz", bild: "v2.webp", release: "15.07.2024", herkunft: null },
      ],
    };
    render(<VariantArea animal={animalWithVariants} />);
    expect(screen.getByText("Weiß")).toBeInTheDocument();
    expect(screen.getByText("Schwarz")).toBeInTheDocument();
  });
});

// ─── 5. Edit- und Delete-Callbacks ───────────────────────────────────────────

describe("5. Edit- und Delete-Callbacks reagieren auf Klick", () => {
  it("ruft onEdit auf wenn der Bearbeiten-Button geklickt wird", () => {
    const onEditMock = jest.fn();
    render(
      <AnimalDetailContent
        animal={mockAnimal}
        onEdit={onEditMock}
        onDelete={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Tier bearbeiten" }));
    expect(onEditMock).toHaveBeenCalledTimes(1);
  });

  it("ruft onDelete auf wenn der Löschen-Button geklickt wird", () => {
    const onDeleteMock = jest.fn();
    render(
      <AnimalDetailContent
        animal={mockAnimal}
        onEdit={jest.fn()}
        onDelete={onDeleteMock}
      />
    );
    fireEvent.click(screen.getByAltText("Tier löschen"));
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  it("stoppt die Event-Propagation beim Klick auf die Action-Gruppe", () => {
    const parentClickMock = jest.fn();
    render(
      <div onClick={parentClickMock}>
        <AnimalDetailContent
          animal={mockAnimal}
          onEdit={jest.fn()}
          onDelete={jest.fn()}
        />
      </div>
    );
    fireEvent.click(screen.getByRole("button", { name: "Tier bearbeiten" }));
    // ActionGroupIcons ruft e.stopPropagation() auf → Parent wird nicht getriggert
    expect(parentClickMock).not.toHaveBeenCalled();
  });
});