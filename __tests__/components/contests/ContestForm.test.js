import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContestForm from "../../../components/contests/ContestForm/ContestForm";

// Mocks
jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock("react-toastify", () => ({
  toast: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../../../components/ui/OriginTransfer", () => {
  return function MockOriginTransfer({ available, selected, onMoveRight, onMoveLeft }) {
    return (
      <div data-testid="origin-transfer">
        <div data-testid="available-statues">
          {available.map((s) => (
            <button
              key={s.id}
              data-testid={`add-statue-${s.id}`}
              onClick={() => onMoveRight(s)}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div data-testid="selected-statues">
          {selected.map((s) => (
            <button
              key={s.id}
              data-testid={`remove-statue-${s.id}`}
              onClick={() => onMoveLeft(s)}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    );
  };
});

jest.mock("../../../components/forms/SubmitButton", () => {
  return function MockSubmitButton({ label, isSubmitting }) {
    return (
      <button type="submit" disabled={isSubmitting} data-testid="submit-button">
        {label}
      </button>
    );
  };
});

import { toast } from "react-toastify";

const mockStatues = [
  { id: 1, tier: { texte: [{ name: "Löwe" }] } },
  { id: 2, tier: { texte: [{ name: "Tiger" }] } },
  { id: 3, tier: { texte: [{ name: "Bär" }] } },
  { id: 4, tier: { texte: [{ name: "Wolf" }] } },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ContestForm – Rendering", () => {
  test("rendert Startdatum-, Enddatum- und Aktiv-Felder", () => {
    const { container } = render(<ContestForm statues={mockStatues} onSubmit={jest.fn()} />);

    expect(screen.getByText("Startdatum")).toBeInTheDocument();
    expect(screen.getByText("Enddatum")).toBeInTheDocument();
    expect(screen.getByText("Wettbewerb aktiv")).toBeInTheDocument();
    // Zwei Datumsfelder und eine Checkbox vorhanden
    expect(container.querySelectorAll('input[type="date"]')).toHaveLength(2);
    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
  });

  test("rendert OriginTransfer mit verfügbaren Statuen", () => {
    render(<ContestForm statues={mockStatues} onSubmit={jest.fn()} />);

    expect(screen.getByTestId("origin-transfer")).toBeInTheDocument();
    expect(screen.getByTestId("add-statue-1")).toBeInTheDocument();
    expect(screen.getByTestId("add-statue-2")).toBeInTheDocument();
  });

  test("zeigt initialData im Formular an", () => {
    const initialData = {
      start: "2025-06-01T00:00:00.000Z",
      ende: "2025-06-08T00:00:00.000Z",
      aktiv: 1,
      statuen: [
        {
          statue: {
            id: 1,
            tier: { texte: [{ name: "Löwe" }] },
          },
        },
      ],
    };

    render(
      <ContestForm
        statues={mockStatues}
        initialData={initialData}
        onSubmit={jest.fn()}
      />
    );

    // Löwe sollte bereits ausgewählt sein
    expect(screen.getByTestId("remove-statue-1")).toBeInTheDocument();
    // Löwe sollte nicht mehr in den Verfügbaren sein
    expect(screen.queryByTestId("add-statue-1")).not.toBeInTheDocument();
  });
});

describe("ContestForm – Statuen-Auswahl", () => {
  test("fügt Statue zur Auswahl hinzu", async () => {
    render(<ContestForm statues={mockStatues} onSubmit={jest.fn()} />);

    await userEvent.click(screen.getByTestId("add-statue-1"));

    expect(screen.getByTestId("remove-statue-1")).toBeInTheDocument();
    expect(screen.queryByTestId("add-statue-1")).not.toBeInTheDocument();
  });

  test("entfernt Statue aus der Auswahl", async () => {
    const initialData = {
      start: "2025-06-01T00:00:00.000Z",
      ende: "2025-06-08T00:00:00.000Z",
      aktiv: 1,
      statuen: [{ statue: { id: 1, tier: { texte: [{ name: "Löwe" }] } } }],
    };

    render(
      <ContestForm
        statues={mockStatues}
        initialData={initialData}
        onSubmit={jest.fn()}
      />
    );

    await userEvent.click(screen.getByTestId("remove-statue-1"));

    expect(screen.getByTestId("add-statue-1")).toBeInTheDocument();
    expect(screen.queryByTestId("remove-statue-1")).not.toBeInTheDocument();
  });

  test("zeigt Toast-Warnung wenn mehr als 3 Statuen ausgewählt werden", async () => {
    const initialData = {
      start: "2025-06-01T00:00:00.000Z",
      ende: "2025-06-08T00:00:00.000Z",
      aktiv: 1,
      statuen: [
        { statue: { id: 1, tier: { texte: [{ name: "Löwe" }] } } },
        { statue: { id: 2, tier: { texte: [{ name: "Tiger" }] } } },
        { statue: { id: 3, tier: { texte: [{ name: "Bär" }] } } },
      ],
    };

    render(
      <ContestForm
        statues={mockStatues}
        initialData={initialData}
        onSubmit={jest.fn()}
      />
    );

    // 4. Statue hinzufügen versuchen (schon 3 ausgewählt)
    await userEvent.click(screen.getByTestId("add-statue-4"));

    expect(toast.warn).toHaveBeenCalledWith("Maximal 3 Statuen erlaubt!");
  });
});

describe("ContestForm – Formular-Validierung", () => {
  test("zeigt Fehler wenn nicht genau 3 Statuen ausgewählt", async () => {
    render(<ContestForm statues={mockStatues} onSubmit={jest.fn()} />);

    // Nur 1 Statue hinzufügen
    await userEvent.click(screen.getByTestId("add-statue-1"));

    fireEvent.submit(screen.getByTestId("submit-button").closest("form"));

    expect(toast.error).toHaveBeenCalledWith("Bitte wähle genau 3 Statuen aus!");
  });

  test("zeigt Fehler wenn Enddatum vor Startdatum liegt", async () => {
    const { container } = render(<ContestForm statues={mockStatues} onSubmit={jest.fn()} />);

    // 3 Statuen auswählen
    await userEvent.click(screen.getByTestId("add-statue-1"));
    await userEvent.click(screen.getByTestId("add-statue-2"));
    await userEvent.click(screen.getByTestId("add-statue-3"));

    // Enddatum (2. date-input) auf einen sehr frühen Wert setzen
    const dateInputs = container.querySelectorAll('input[type="date"]');
    const endeInput = dateInputs[1];
    fireEvent.change(endeInput, { target: { value: "2000-01-01" } });

    fireEvent.submit(endeInput.closest("form"));

    expect(toast.error).toHaveBeenCalledWith(
      "Das Enddatum darf nicht vor dem Startdatum liegen!"
    );
  });
});

describe("ContestForm – Submit", () => {
  test("ruft onSubmit mit korrekten Daten auf", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<ContestForm statues={mockStatues} onSubmit={onSubmit} />);

    // 3 Statuen auswählen
    await userEvent.click(screen.getByTestId("add-statue-1"));
    await userEvent.click(screen.getByTestId("add-statue-2"));
    await userEvent.click(screen.getByTestId("add-statue-3"));

    // Submit-Button klicken (type="submit" löst form onSubmit aus)
    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    const submittedData = onSubmit.mock.calls[0][0];
    expect(submittedData.statuenIds).toEqual([1, 2, 3]);
    expect(submittedData.start).toBeDefined();
    expect(submittedData.ende).toBeDefined();
  });
});
