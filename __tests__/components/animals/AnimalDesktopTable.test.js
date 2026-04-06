import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnimalDesktopTable from "../../../src/components/pages/animals/AnimalOverview/AnimalDesktopTable";

// --- Mocks ---

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (_key, fallback) => fallback || _key,
  }),
}));

// ActionGroupIcons mocken, damit Edit- und Delete-Buttons testbar sind
jest.mock("../../../src/components/pageStructure/ui/ActionGroup", () => {
  return function MockActionGroupIcons({ onEdit, onDelete }) {
    return (
      <div data-testid="action-icons">
        <button data-testid="edit-btn" onClick={onEdit}>
          Editieren
        </button>
        <button data-testid="delete-btn" onClick={onDelete}>
          Löschen
        </button>
      </div>
    );
  };
});

jest.mock("../../../src/components/pageStructure/table/SortableTableHeader", () => {
  return function MockSortableTableHeader({ text }) {
    return <th>{text}</th>;
  };
});

jest.mock("../../../src/components/pageStructure/ui/ActionsHeadline", () => {
  return function MockActionsHeadline({ text }) {
    return <th>{text}</th>;
  };
});

jest.mock("../../../src/components/pageStructure/table/TableLinkedRow", () => {
  return function MockLinkedRow({ children }) {
    return <tr>{children}</tr>;
  };
});

jest.mock("../../../src/components/pageStructure/table/Table", () => {
  return function MockTable({ children }) {
    return <table>{children}</table>;
  };
});

jest.mock("../../../src/components/pageStructure/table/TableNoResult", () => {
  return function MockNoResult({ text }) {
    return <tr><td>{text}</td></tr>;
  };
});

jest.mock("../../../src/components/pageStructure/table/RightAlignedTd", () => {
  return function MockRightAlignedTd({ children }) {
    return <td>{children}</td>;
  };
});

jest.mock("../../../src/components/pageStructure/table/DesktopOnlyTd", () => {
  return function MockDesktopOnlyTd({ children }) {
    return <td>{children}</td>;
  };
});

jest.mock("../../../src/components/pageStructure/table/TableInfoCell", () => {
  return function MockInfoCell({ children }) {
    return <div>{children}</div>;
  };
});

jest.mock("../../../src/components/pageStructure/ui/ItemThumbnail", () => {
  return function MockItemThumbnail({ name }) {
    return <div data-testid="thumbnail">{name}</div>;
  };
});

jest.mock("../../../src/components/pageStructure/ui/PriceDisplay", () => {
  return function MockPriceDisplay({ value }) {
    return <span>{value}</span>;
  };
});

jest.mock("../../../src/components/icons/XPIcon", () => {
  return function MockXPIcon({ label }) {
    return <span>{label}</span>;
  };
});

jest.mock("../../../src/components/icons/ZoodollarIcon", () => {
  return function MockZoodollarIcon({ value }) {
    return <span>{value}</span>;
  };
});

jest.mock("../../../src/components/pageStructure/ui/BiomeBadge", () => {
  return function MockGehegeBadge({ gehege }) {
    return <span>{gehege?.name}</span>;
  };
});

jest.mock("../../../src/components/pageStructure/ui/StallLevelBadge", () => {
  return function MockStallLevelBadge({ level }) {
    return <span>{level}</span>;
  };
});

jest.mock("../../../src/components/pageStructure/ui/Name", () => ({
  NameDE: function MockNameDE({ children }) {
    return <span>{children}</span>;
  },
}));

jest.mock("../../../src/utils/AnimalHelper", () => ({
  calculateTotalXP: jest.fn(() => 100),
}));

// --- Testdaten ---

const mockAnimals = [
  {
    id: 1,
    name: "Löwe",
    bild: "loewe.png",
    preis: 500,
    preisart: { name: "Gold" },
    stalllevel: 3,
    verkaufswert: 250,
    auswildern: 50,
    gehege: { name: "Savanne" },
  },
  {
    id: 2,
    name: "Tiger",
    bild: "tiger.png",
    preis: 800,
    preisart: { name: "Diamant" },
    stalllevel: 5,
    verkaufswert: 400,
    auswildern: 80,
    gehege: { name: "Dschungel" },
  },
];

const defaultProps = {
  animals: mockAnimals,
  sortBy: "name",
  sortDirection: "asc",
  onSort: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Punkt 5: Buttons "Editieren" und "Löschen" werden angezeigt
// ---------------------------------------------------------------------------
describe("AnimalDesktopTable – Edit- und Delete-Buttons (Punkt 5)", () => {
  test("zeigt Edit-Buttons für jedes Tier an", () => {
    render(<AnimalDesktopTable {...defaultProps} />);

    const editButtons = screen.getAllByTestId("edit-btn");
    expect(editButtons).toHaveLength(mockAnimals.length);
  });

  test("zeigt Delete-Buttons für jedes Tier an", () => {
    render(<AnimalDesktopTable {...defaultProps} />);

    const deleteButtons = screen.getAllByTestId("delete-btn");
    expect(deleteButtons).toHaveLength(mockAnimals.length);
  });

  test("zeigt ActionGroupIcons für jedes Tier an", () => {
    render(<AnimalDesktopTable {...defaultProps} />);

    const actionGroups = screen.getAllByTestId("action-icons");
    expect(actionGroups).toHaveLength(mockAnimals.length);
  });

  test("ruft onEdit mit der Tier-ID auf wenn Edit-Button geklickt wird", async () => {
    const onEdit = jest.fn();
    render(<AnimalDesktopTable {...defaultProps} onEdit={onEdit} />);

    const editButtons = screen.getAllByTestId("edit-btn");
    await userEvent.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockAnimals[0].id);
  });

  test("ruft onDelete mit der Tier-ID auf wenn Delete-Button geklickt wird", async () => {
    const onDelete = jest.fn();
    render(<AnimalDesktopTable {...defaultProps} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByTestId("delete-btn");
    await userEvent.click(deleteButtons[1]);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockAnimals[1].id);
  });

  test("zeigt alle Tiernamen in der Tabelle an", () => {
    render(<AnimalDesktopTable {...defaultProps} />);

    expect(screen.getAllByText("Löwe").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Tiger").length).toBeGreaterThanOrEqual(1);
  });

  test("zeigt NoResult an wenn keine Tiere vorhanden", () => {
    render(<AnimalDesktopTable {...defaultProps} animals={[]} />);

    expect(screen.queryAllByTestId("edit-btn")).toHaveLength(0);
    expect(screen.queryAllByTestId("delete-btn")).toHaveLength(0);
  });
});