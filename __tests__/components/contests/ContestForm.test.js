/**
 * Tests für die ContestForm-Komponente
 *
 * Abgedeckte Anforderungen:
 *  1. Wird das Formular korrekt gerendert?
 *  2. Funktioniert die Statuen-Auswahl (OriginTransfer)?
 *  3. Funktioniert die Datums-Logik (Auto-Enddatum, Validierung)?
 *  4. Werden Validierungsfehler korrekt per Toast ausgegeben?
 *  5. Funktioniert der Submit (POST, Toast, Navigation)?
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContestForm from "../../../components/contests/ContestForm/ContestForm";

// ─── Externe Abhängigkeiten mocken ────────────────────────────────────────────

const DE_TRANSLATIONS = {
  "common:available": "Verfügbar",
  "common:chosen": "Ausgewählt",
};

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key) => DE_TRANSLATIONS[key] ?? key,
    i18n: { language: "de" },
  }),
}));

const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: "/contests/create",
    locale: "de",
    query: {},
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src }) => <img alt={alt} src={src} />,
}));

const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
jest.mock("react-toastify", () => ({
  toast: {
    success: (...args) => mockToast.success(...args),
    error: (...args) => mockToast.error(...args),
    warn: (...args) => mockToast.warn(...args),
  },
}));

// ─── Test-Fixtures ────────────────────────────────────────────────────────────

const mockStatues = [
  { id: 1, tier: { texte: [{ spracheCode: "de", name: "Löwe" }] } },
  { id: 2, tier: { texte: [{ spracheCode: "de", name: "Pinguin" }] } },
  { id: 3, tier: { texte: [{ spracheCode: "de", name: "Elefant" }] } },
  { id: 4, tier: { texte: [{ spracheCode: "de", name: "Zebra" }] } },
];

beforeEach(() => {
  mockPush.mockClear();
  mockToast.success.mockClear();
  mockToast.error.mockClear();
  mockToast.warn.mockClear();
  global.fetch = jest.fn();
});

// ─── 1. Formular rendern ──────────────────────────────────────────────────────

describe("1. ContestForm wird korrekt gerendert", () => {
  it("zeigt die Abschnittsüberschriften", () => {
    render(<ContestForm statues={mockStatues} />);
    expect(screen.getByText("Zeitraum & Status")).toBeInTheDocument();
    expect(screen.getByText(/Statuen-Auswahl/)).toBeInTheDocument();
  });

  it("zeigt Start- und Enddatum-Felder", () => {
    render(<ContestForm statues={mockStatues} />);
    // Labels haben kein htmlFor → über Typ-Query
    expect(screen.getByText("Startdatum")).toBeInTheDocument();
    expect(screen.getByText("Enddatum")).toBeInTheDocument();
    expect(
      screen.getAllByDisplayValue(/^\d{4}-\d{2}-\d{2}$/)
    ).toHaveLength(2);
  });

  it("Checkbox 'Wettbewerb aktiv' ist standardmäßig angekreuzt", () => {
    render(<ContestForm statues={mockStatues} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("zeigt den Submit-Button", () => {
    render(<ContestForm statues={mockStatues} />);
    expect(
      screen.getByRole("button", { name: "Wettbewerb anlegen" })
    ).toBeInTheDocument();
  });

  it("zeigt den OriginTransfer mit Spalten 'Verfügbar' und 'Ausgewählt'", () => {
    render(<ContestForm statues={mockStatues} />);
    expect(screen.getByText("Verfügbar")).toBeInTheDocument();
    expect(screen.getByText("Ausgewählt")).toBeInTheDocument();
  });

  it("zeigt alle verfügbaren Statuen im Transfer", () => {
    render(<ContestForm statues={mockStatues} />);
    expect(screen.getByText("Löwe")).toBeInTheDocument();
    expect(screen.getByText("Pinguin")).toBeInTheDocument();
    expect(screen.getByText("Elefant")).toBeInTheDocument();
    expect(screen.getByText("Zebra")).toBeInTheDocument();
  });

  it("zeigt Zähler '0 / 3' bei leerer Auswahl", () => {
    render(<ContestForm statues={mockStatues} />);
    expect(screen.getByText(/0 \/ 3/)).toBeInTheDocument();
  });
});

// ─── 2. Statuen-Auswahl ───────────────────────────────────────────────────────

describe("2. Statuen-Auswahl – OriginTransfer-Logik", () => {
  it("verschiebt eine Statue in die Auswahl bei Klick", () => {
    render(<ContestForm statues={mockStatues} />);
    fireEvent.click(screen.getByText("Löwe"));
    expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument();
  });

  it("entfernt eine Statue aus der Auswahl bei erneutem Klick", () => {
    render(<ContestForm statues={mockStatues} />);
    // Erst hinzufügen …
    fireEvent.click(screen.getByText("Löwe"));
    expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument();
    // … dann wieder entfernen
    fireEvent.click(screen.getByText("Löwe"));
    expect(screen.getByText(/0 \/ 3/)).toBeInTheDocument();
  });

  it("3 Statuen lassen sich auswählen", () => {
    render(<ContestForm statues={mockStatues} />);
    fireEvent.click(screen.getByText("Löwe"));
    fireEvent.click(screen.getByText("Pinguin"));
    fireEvent.click(screen.getByText("Elefant"));
    expect(screen.getByText(/3 \/ 3/)).toBeInTheDocument();
  });

  it("zeigt toast.warn wenn mehr als 3 Statuen ausgewählt werden sollen", () => {
    render(<ContestForm statues={mockStatues} />);
    fireEvent.click(screen.getByText("Löwe"));
    fireEvent.click(screen.getByText("Pinguin"));
    fireEvent.click(screen.getByText("Elefant"));
    // Vierte Statue → Limit erreicht
    fireEvent.click(screen.getByText("Zebra"));
    expect(mockToast.warn).toHaveBeenCalledWith("Maximal 3 Statuen erlaubt!");
  });

  it("Fallback-Name 'Statue #N' wenn texte-Array leer ist", () => {
    const statuesWithoutName = [{ id: 99, tier: { texte: [] } }];
    render(<ContestForm statues={statuesWithoutName} />);
    expect(screen.getByText("Statue #99")).toBeInTheDocument();
  });
});

// ─── 3. Datums-Logik ──────────────────────────────────────────────────────────

describe("3. Datums-Logik", () => {
  it("passt das Enddatum automatisch auf Start + 7 Tage an", () => {
    const { container } = render(<ContestForm statues={mockStatues} />);
    const [startInput, endInput] = container.querySelectorAll('input[type="date"]');
    fireEvent.change(startInput, { target: { value: "2026-05-06" } });
    expect(endInput).toHaveValue("2026-05-13");
  });

  it("toggling der Checkbox ändert den aktiv-Wert", () => {
    render(<ContestForm statues={mockStatues} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("Enddatum kann manuell geändert werden", () => {
    const { container } = render(<ContestForm statues={mockStatues} />);
    const [, endInput] = container.querySelectorAll('input[type="date"]');
    fireEvent.change(endInput, { target: { value: "2026-12-31" } });
    expect(endInput).toHaveValue("2026-12-31");
  });
});

// ─── 4. Validierungsfehler beim Submit ────────────────────────────────────────

describe("4. Validierung beim Submit", () => {
  it("zeigt toast.error wenn weniger als 3 Statuen ausgewählt sind", async () => {
    render(<ContestForm statues={mockStatues} />);
    // Nur 2 Statuen auswählen
    fireEvent.click(screen.getByText("Löwe"));
    fireEvent.click(screen.getByText("Pinguin"));
    fireEvent.click(screen.getByRole("button", { name: "Wettbewerb anlegen" }));
    expect(mockToast.error).toHaveBeenCalledWith(
      "Bitte wähle genau 3 Statuen aus!"
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("zeigt toast.error wenn Enddatum vor Startdatum liegt", async () => {
    const { container } = render(<ContestForm statues={mockStatues} />);
    // 3 Statuen wählen
    fireEvent.click(screen.getByText("Löwe"));
    fireEvent.click(screen.getByText("Pinguin"));
    fireEvent.click(screen.getByText("Elefant"));
    // Sicherstellen, dass 3 Statuen gewählt sind
    expect(screen.getByText(/3 \/ 3/)).toBeInTheDocument();
    // Enddatum weit vor dem automatisch gesetzten Startdatum
    // (min-Attribut des Inputs beachten: in JSDOM kein Enforcement,
    //  aber setzen wir Startdatum zuerst auf eine sichere Zukunft,
    //  dann Enddatum davor)
    const [startInput, endInput] = container.querySelectorAll('input[type="date"]');
    fireEvent.change(startInput, { target: { value: "2026-06-01" } });
    // Nach Auto-Update: ende = 2026-06-08. Jetzt Enddatum DAVOR setzen:
    fireEvent.change(endInput, { target: { value: "2026-05-01" } });
    // fireEvent.submit(form) statt click — stellt sicher, dass der State
    // nach den vorherigen fireEvent.change-Aufrufen vollständig geflusht ist
    fireEvent.submit(endInput.closest("form"));
    expect(mockToast.error).toHaveBeenCalledWith(
      "Das Enddatum darf nicht vor dem Startdatum liegen!"
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

// ─── 5. Submit-Logik ──────────────────────────────────────────────────────────

describe("5. Submit-Logik", () => {
  /** Hilfs-Funktion: rendert und wählt genau 3 Statuen aus */
  function renderAndSelect3() {
    render(<ContestForm statues={mockStatues} />);
    fireEvent.click(screen.getByText("Löwe"));
    fireEvent.click(screen.getByText("Pinguin"));
    fireEvent.click(screen.getByText("Elefant"));
  }

  it("sendet POST-Request an /api/contests/create mit korrekten Daten", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    renderAndSelect3();
    fireEvent.click(screen.getByRole("button", { name: "Wettbewerb anlegen" }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("/api/contests/create");
    expect(options.method).toBe("POST");

    const body = JSON.parse(options.body);
    expect(body.statuenIds).toEqual(
      expect.arrayContaining([1, 2, 3])
    );
    expect(body.aktiv).toBe(1);
  });

  it("zeigt toast.success und navigiert zu /contests bei Erfolg", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    renderAndSelect3();
    fireEvent.click(screen.getByRole("button", { name: "Wettbewerb anlegen" }));

    await waitFor(() =>
      expect(mockToast.success).toHaveBeenCalledWith(
        "Wettbewerb erfolgreich angelegt!"
      )
    );
    expect(mockPush).toHaveBeenCalledWith("/contests");
  });

  it("zeigt toast.error bei Server-Fehler (response.ok === false)", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    renderAndSelect3();
    fireEvent.click(screen.getByRole("button", { name: "Wettbewerb anlegen" }));

    await waitFor(() =>
      expect(mockToast.error).toHaveBeenCalledWith("Fehler beim Speichern.")
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("zeigt toast.error bei Netzwerkfehler", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));
    renderAndSelect3();
    fireEvent.click(screen.getByRole("button", { name: "Wettbewerb anlegen" }));

    await waitFor(() =>
      expect(mockToast.error).toHaveBeenCalledWith("Netzwerkfehler.")
    );
  });

  it("deaktiviert den Submit-Button während des Sendens", async () => {
    // fetch hängt — bleibt im pending-Zustand
    global.fetch.mockReturnValueOnce(new Promise(() => {}));
    renderAndSelect3();
    const submitButton = screen.getByRole("button", { name: "Wettbewerb anlegen" });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Wird gespeichert..." })
      ).toBeDisabled()
    );
  });
});
