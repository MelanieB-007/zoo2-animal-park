/**
 * Unit-Tests für BiomeService
 *
 * Abgedeckt:
 *  1. getAllBiomes – Prisma-Aufruf, Sortierung, Rückgabe, Fehlerfall
 */

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => {
  const mock = { gehege: { findMany: jest.fn() } };
  return { __esModule: true, prisma: mock, default: mock };
});

import prisma from "@/lib/prisma";
import { getAllBiomes } from "../../services/BiomeService";

beforeEach(() => jest.clearAllMocks());

// ─── getAllBiomes ─────────────────────────────────────────────────────────────

describe("getAllBiomes", () => {
  it("gibt die Gehege-Liste zurück", async () => {
    const mockBiomes = [{ id: 1, name: "Savanne" }, { id: 2, name: "Arktis" }];
    prisma.gehege.findMany.mockResolvedValueOnce(mockBiomes);

    const result = await getAllBiomes();

    expect(result).toEqual(mockBiomes);
  });

  it("sortiert nach name aufsteigend", async () => {
    prisma.gehege.findMany.mockResolvedValueOnce([]);

    await getAllBiomes();

    expect(prisma.gehege.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { name: "asc" } })
    );
  });

  it("gibt leeres Array zurück wenn keine Gehege vorhanden sind", async () => {
    prisma.gehege.findMany.mockResolvedValueOnce([]);

    const result = await getAllBiomes();

    expect(result).toEqual([]);
  });

  it("gibt leeres Array zurück wenn Prisma einen Fehler wirft", async () => {
    prisma.gehege.findMany.mockRejectedValueOnce(new Error("DB Error"));

    const result = await getAllBiomes();

    expect(result).toEqual([]);
  });
});
