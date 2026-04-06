import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import Navigation from "../../../src/components/pageStructure/Header/Navigation";

// --- Mocks ---

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (_key, fallback) => fallback || _key,
  }),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({ pathname: "/" }),
}));

jest.mock("next/link", () => {
  return function MockLink({ href, children }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("react-icons/io5", () => ({
  IoChevronDown: () => <span />,
}));

import { useSession } from "next-auth/react";

// ---------------------------------------------------------------------------
// Punkt 1: Menüpunkt "Tier anlegen"
// ---------------------------------------------------------------------------
describe("Navigation – Menüpunkt 'Tier anlegen' (Punkt 1)", () => {
  test("zeigt 'Tier anlegen' wenn User eingeloggt ist", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Alice" } },
      status: "authenticated",
    });

    render(<Navigation />);

    expect(screen.getByText("Tier anlegen")).toBeInTheDocument();
  });

  test("versteckt 'Tier anlegen' wenn User NICHT eingeloggt ist", () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navigation />);

    expect(screen.queryByText("Tier anlegen")).not.toBeInTheDocument();
  });

  test("'Tierübersicht' ist immer sichtbar (auch ohne Login)", () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navigation />);

    expect(screen.getByText("Tierübersicht")).toBeInTheDocument();
  });

  test("'Tier anlegen'-Link zeigt auf /animals/create", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Alice" } },
      status: "authenticated",
    });

    render(<Navigation />);

    const link = screen.getByText("Tier anlegen").closest("a");
    expect(link).toHaveAttribute("href", "/animals/create");
  });
});

// ---------------------------------------------------------------------------
// Punkt 6: Menüpunkte "Wettbewerbe" und "Wettbewerb anlegen"
// ---------------------------------------------------------------------------
describe("Navigation – Menüpunkte 'Wettbewerbe' und 'Wettbewerb anlegen' (Punkt 6)", () => {
  test("zeigt 'Wettbewerbe' wenn User eingeloggt ist", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Alice" } },
      status: "authenticated",
    });

    render(<Navigation />);

    expect(screen.getByText("Wettbewerbe")).toBeInTheDocument();
  });

  test("versteckt 'Wettbewerbe' wenn User NICHT eingeloggt ist", () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navigation />);

    expect(screen.queryByText("Wettbewerbe")).not.toBeInTheDocument();
  });

  test("zeigt 'Wettbewerb anlegen' wenn User eingeloggt ist", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Alice" } },
      status: "authenticated",
    });

    render(<Navigation />);

    expect(screen.getByText("Wettbewerb anlegen")).toBeInTheDocument();
  });

  test("versteckt 'Wettbewerb anlegen' wenn User NICHT eingeloggt ist", () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navigation />);

    expect(screen.queryByText("Wettbewerb anlegen")).not.toBeInTheDocument();
  });

  test("'Wettbewerbe'-Link zeigt auf /contests", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Alice" } },
      status: "authenticated",
    });

    render(<Navigation />);

    const link = screen.getByText("Wettbewerbe").closest("a");
    expect(link).toHaveAttribute("href", "/contests");
  });

  test("'Wettbewerb anlegen'-Link zeigt auf /contests/create", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Alice" } },
      status: "authenticated",
    });

    render(<Navigation />);

    const link = screen.getByText("Wettbewerb anlegen").closest("a");
    expect(link).toHaveAttribute("href", "/contests/create");
  });

  test("'Statuen' ist immer sichtbar (auch ohne Login)", () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Navigation />);

    expect(screen.getByText("Statuen")).toBeInTheDocument();
  });
});
