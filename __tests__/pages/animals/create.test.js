import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AddAnimalPage from "../../../pages/animals/create";

// --- Mocks ---

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (_key, fallback) => fallback || _key,
  }),
}));

const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("../../../src/components/pageStructure/PageWrapper", () => {
  return function MockPageWrapper({ children }) {
    return <div>{children}</div>;
  };
});

jest.mock("../../../components/page-structure/ContentWrapper", () => {
  return function MockContentWrapper({ children }) {
    return <div>{children}</div>;
  };
});

jest.mock("../../../src/components/pageStructure/PageHeader", () => {
  return function MockPageHeader({ text }) {
    return <h1>{text}</h1>;
  };
});

jest.mock("../../../components/animals/AnimalForm/AnimalForm", () => {
  return function MockAnimalForm() {
    return <div data-testid="animal-form">AnimalForm</div>;
  };
});

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import { useSession } from "next-auth/react";

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Punkt 2: Seite "Tier anlegen" nur für eingeloggte User
// ---------------------------------------------------------------------------
describe("Seite /animals/create – Authentifizierungsschutz (Punkt 2)", () => {
  test("leitet nicht eingeloggten User zu /api/auth/signin weiter", async () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<AddAnimalPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/api/auth/signin");
    });
  });

  test("rendert nichts (null) wenn User nicht eingeloggt ist", () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    const { container } = render(<AddAnimalPage />);

    expect(screen.queryByTestId("animal-form")).not.toBeInTheDocument();
  });

  test("zeigt Ladeindikator während Session geprüft wird", () => {
    useSession.mockReturnValue({ data: null, status: "loading" });

    render(<AddAnimalPage />);

    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.queryByTestId("animal-form")).not.toBeInTheDocument();
  });

  test("zeigt AnimalForm wenn User eingeloggt ist", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Alice" } },
      status: "authenticated",
    });

    render(<AddAnimalPage />);

    expect(screen.getByTestId("animal-form")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("leitet nicht ein eingeloggten User NICHT weiter", async () => {
    useSession.mockReturnValue({
      data: { user: { name: "Alice" } },
      status: "authenticated",
    });

    render(<AddAnimalPage />);

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
