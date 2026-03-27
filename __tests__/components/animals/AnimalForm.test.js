/**
 * Tests für die AnimalForm-Komponente
 *
 * Abgedeckte Anforderungen:
 *  1. Wird das Formular korrekt gerendert (Create- und Edit-Modus)?
 *  2. Funktionieren Formulareingaben und Validierung?
 *  3. Wird beim Submit die richtige HTTP-Methode und URL verwendet?
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";

import AnimalForm from "../../../components/animals/AnimalForm/AnimalForm";

// ─── Externe Abhängigkeiten mocken ────────────────────────────────────────────

const DE_TRANSLATIONS = {
  "animals:basicInfoSection.basicInfo": "Grundinformationen",
  "animals:basicInfoSection.fields.name": "Name",
  "animals:basicInfoSection.fields.releaseDate": "Release",
  "animals:descriptionSection.descriptionPlaceholder": "Beschreibe das Tier...",
  "animals:priceSection.pricesAndValues": "Preise und Werte",
  "animals:breeding.breeding": "Zucht",
  "animals:breeding.breedingChance": "Zuchtchance",
  "animals:table.stall": "Stall",
  "animals:table.release": "Auswildern",
  "animals:xpSection.actionsXp": "Aktionen & EP",
  "animals:actions.feed": "Füttern",
  "animals:actions.play": "Spielen",
  "animals:actions.clean": "Säubern",
  "animals:originSection.originTitle": "Herkunft",
  "animals:originSection.originDescription": "Woher bekommt man dieses Tier?",
  "animals:form.saveAnimal": "Tier speichern",
  "common:enclosure": "Gehege",
  "common:enclosureType": "Gehegetyp",
  "common:payment.price": "Preis",
  "common:payment.sellPrice": "Verkaufspreis",
  "common:popularity": "Popularität",
  "common:costs": "Kosten",
  "common:time": "Zeit",
  "common:saving": "Wird gespeichert...",
  "common:description": "Beschreibung",
};

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key) => DE_TRANSLATIONS[key] ?? key,
    i18n: { language: "de" },
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src, width, height }) => (
    <img alt={alt} src={src} width={width} height={height} />
  ),
}));

// SWR mocken: gibt Biome- und Herkunftsdaten zurück
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn((key) => {
    if (key === "/api/biomes") {
      return {
        data: [
          { id: 1, name: "Hauptzoo" },
          { id: 2, name: "Polarium" },
        ],
      };
    }
    if (key === "/api/origins") {
      return { data: [{ id: 1, name: "Shop" }, { id: 2, name: "Handel" }] };
    }
    return { data: undefined };
  }),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// ─── Test-Fixtures ────────────────────────────────────────────────────────────

const mockInitialData = {
  id: 42,
  nameDe: "Löwe",
  descriptionDe: "Ein stolzes Tier",
  translations: [],
  releaseDate: "2024-01-15",
  price: 500,
  currency: "1",
  sellValue: 200,
  popularity: 80,
  auswildern: 50,
  enclosureType: "1",
  breedingLevel: 1,
  breedingCosts: 100,
  breedingDuration: 24,
  breedingChance: 10,
  actions: {
    feed: { durationHours: 1, durationMinutes: 30, xp: 100 },
    play: { durationHours: 2, durationMinutes: 0, xp: 80 },
    clean: { durationHours: 1, durationMinutes: 0, xp: 60 },
  },
  origins: [],
  enclosureSizes: [{ animalCount: 1, size: 10 }],
};

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 42, nameDe: "Löwe" }),
    })
  );
  global.alert = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

// ─── 1. Formular rendern ──────────────────────────────────────────────────────

describe("1. Formular wird korrekt gerendert", () => {
  it("zeigt den Submit-Button mit dem Text 'Tier speichern'", () => {
    render(<AnimalForm />);
    expect(
      screen.getByRole("button", { name: "Tier speichern" })
    ).toBeInTheDocument();
  });

  it("zeigt alle Akkordeon-Abschnitte an", () => {
    render(<AnimalForm />);

    expect(screen.getByText("Grundinformationen")).toBeInTheDocument();
    expect(screen.getByText("Preise und Werte")).toBeInTheDocument();
    expect(screen.getByText("Zucht")).toBeInTheDocument();
    expect(screen.getByText("Aktionen & EP")).toBeInTheDocument();
    expect(screen.getByText("Herkunft")).toBeInTheDocument();
  });

  it("Tiername-Feld ist im Create-Modus leer", () => {
    render(<AnimalForm />);
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("Submit-Button ist zu Beginn nicht deaktiviert", () => {
    render(<AnimalForm />);
    expect(
      screen.getByRole("button", { name: "Tier speichern" })
    ).not.toBeDisabled();
  });

  it("zeigt die Beschreibungs-Textarea an", () => {
    render(<AnimalForm />);
    expect(
      screen.getByPlaceholderText("Beschreibe das Tier...")
    ).toBeInTheDocument();
  });

  it("zeigt die Aktion-Labels (Füttern, Spielen, Säubern) an", () => {
    render(<AnimalForm />);
    expect(screen.getByText("Füttern")).toBeInTheDocument();
    expect(screen.getByText("Spielen")).toBeInTheDocument();
    expect(screen.getByText("Säubern")).toBeInTheDocument();
  });
});

// ─── 2. Edit-Modus: initialData vorausfüllen ─────────────────────────────────

describe("2. Edit-Modus: Felder werden mit initialData vorausgefüllt", () => {
  it("befüllt das Tiername-Feld mit dem übergebenen Namen", () => {
    render(<AnimalForm initialData={mockInitialData} isEdit={true} />);
    expect(screen.getByLabelText("Name")).toHaveValue("Löwe");
  });

  it("befüllt das Preis-Feld mit dem übergebenen Preis", () => {
    render(<AnimalForm initialData={mockInitialData} isEdit={true} />);
    // Preis-Input hat name="price" und Wert 500
    expect(screen.getByDisplayValue("500")).toBeInTheDocument();
  });

  it("befüllt den Verkaufspreis-Input", () => {
    render(<AnimalForm initialData={mockInitialData} isEdit={true} />);
    expect(screen.getByDisplayValue("200")).toBeInTheDocument();
  });

  it("befüllt das Release-Datum", () => {
    render(<AnimalForm initialData={mockInitialData} isEdit={true} />);
    expect(screen.getByDisplayValue("2024-01-15")).toBeInTheDocument();
  });

  it("zeigt weiterhin den Submit-Button 'Tier speichern' im Edit-Modus", () => {
    render(<AnimalForm initialData={mockInitialData} isEdit={true} />);
    expect(
      screen.getByRole("button", { name: "Tier speichern" })
    ).toBeInTheDocument();
  });
});

// ─── 3. Formulareingaben ─────────────────────────────────────────────────────

describe("3. Formulareingaben werden verarbeitet", () => {
  it("aktualisiert das Tiername-Feld bei Eingabe", () => {
    render(<AnimalForm />);
    const nameInput = screen.getByLabelText("Name");

    fireEvent.change(nameInput, {
      target: { value: "Pinguin", name: "nameDe" },
    });

    expect(nameInput).toHaveValue("Pinguin");
  });

  it("aktualisiert die Beschreibung bei Eingabe", () => {
    render(<AnimalForm />);
    const textarea = screen.getByPlaceholderText("Beschreibe das Tier...");

    fireEvent.change(textarea, {
      target: { value: "Ein lustiger Vogel.", name: "descriptionDe" },
    });

    expect(textarea).toHaveValue("Ein lustiger Vogel.");
  });

  it("aktualisiert einen Preis-Input bei Eingabe", () => {
    render(<AnimalForm />);
    // Preis-Input hat name="price" — via container querien
    const { container } = render(<AnimalForm />);
    const priceInput = container.querySelector('[name="price"]');

    fireEvent.change(priceInput, { target: { value: "750", name: "price" } });

    expect(priceInput).toHaveValue(750);
  });
});

// ─── 4. Validierung ──────────────────────────────────────────────────────────

describe("4. Formular-Validierung", () => {
  it("zeigt einen Alert wenn kein Gehege ausgewählt ist", () => {
    // Create-Modus: enclosureType startet leer
    render(<AnimalForm />);

    fireEvent.submit(screen.getByRole("button", { name: "Tier speichern" }).closest("form"));

    expect(global.alert).toHaveBeenCalledWith("Bitte wähle ein Gehege aus!");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("sendet kein fetch wenn die Validierung fehlschlägt", () => {
    render(<AnimalForm />);

    fireEvent.submit(screen.getByRole("button", { name: "Tier speichern" }).closest("form"));

    expect(global.fetch).not.toHaveBeenCalled();
  });
});

// ─── 5. Submit-Logik ─────────────────────────────────────────────────────────

describe("5. Submit-Logik (HTTP-Methode und URL)", () => {
  it("sendet POST an /api/animals im Create-Modus", async () => {
    // Wir übergeben initialData ohne id, aber mit gültigem enclosureType
    const createData = { ...mockInitialData, id: undefined };
    render(<AnimalForm initialData={createData} isEdit={false} />);

    fireEvent.submit(
      screen.getByRole("button", { name: "Tier speichern" }).closest("form")
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/animals",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("sendet PUT an /api/animals/42 im Edit-Modus", async () => {
    render(<AnimalForm initialData={mockInitialData} isEdit={true} />);

    fireEvent.submit(
      screen.getByRole("button", { name: "Tier speichern" }).closest("form")
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/animals/42",
        expect.objectContaining({ method: "PUT" })
      );
    });
  });

  it("sendet Content-Type: application/json im Header", async () => {
    render(<AnimalForm initialData={mockInitialData} isEdit={true} />);

    fireEvent.submit(
      screen.getByRole("button", { name: "Tier speichern" }).closest("form")
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  it("ruft onSuccess auf wenn der Submit erfolgreich ist", async () => {
    const onSuccessMock = jest.fn();
    render(
      <AnimalForm
        initialData={mockInitialData}
        isEdit={true}
        onSuccess={onSuccessMock}
      />
    );

    fireEvent.submit(
      screen.getByRole("button", { name: "Tier speichern" }).closest("form")
    );

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledWith({ id: 42, nameDe: "Löwe" });
    });
  });

  it("zeigt einen Toast-Fehler wenn die API einen Fehler zurückgibt", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Datenbankfehler" }),
      })
    );

    render(<AnimalForm initialData={mockInitialData} isEdit={true} />);

    fireEvent.submit(
      screen.getByRole("button", { name: "Tier speichern" }).closest("form")
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Datenbankfehler")
      );
    });
  });

  it("zeigt einen Toast-Fehler bei einem Netzwerkfehler", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Netzwerk nicht erreichbar")));

    render(<AnimalForm initialData={mockInitialData} isEdit={true} />);

    fireEvent.submit(
      screen.getByRole("button", { name: "Tier speichern" }).closest("form")
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Netzwerkfehler: Keine Verbindung zur API."
      );
    });
  });
});
