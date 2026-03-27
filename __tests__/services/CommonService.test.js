/**
 * Unit-Tests für CommonService
 *
 * Abgedeckt:
 *  1. getAllLanguages – Prisma-Aufruf, Sortierung, Rückgabe, Fehlerfall
 */

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => {
  const mock = { sprachen: { findMany: jest.fn() } };
  return { __esModule: true, prisma: mock, default: mock };
});

import prisma from "@/lib/prisma";
import { getAllLanguages } from "../../services/CommonService";

beforeEach(() => jest.clearAllMocks());

// ─── getAllLanguages ──────────────────────────────────────────────────────────

describe("getAllLanguages", () => {
  it("gibt die Sprachen-Liste zurück", async () => {
    const mockLanguages = [{ code: "de", name: "Deutsch" }, { code: "en", name: "English" }];
    prisma.sprachen.findMany.mockResolvedValueOnce(mockLanguages);

    const result = await getAllLanguages();

    expect(result).toEqual(mockLanguages);
  });

  it("sortiert nach name aufsteigend", async () => {
    prisma.sprachen.findMany.mockResolvedValueOnce([]);

    await getAllLanguages();

    expect(prisma.sprachen.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { name: "asc" } })
    );
  });

  it("gibt leeres Array zurück wenn keine Sprachen vorhanden sind", async () => {
    prisma.sprachen.findMany.mockResolvedValueOnce([]);

    const result = await getAllLanguages();

    expect(result).toEqual([]);
  });

  it("gibt leeres Array zurück wenn Prisma einen Fehler wirft", async () => {
    prisma.sprachen.findMany.mockRejectedValueOnce(new Error("DB Error"));

    const result = await getAllLanguages();

    expect(result).toEqual([]);
  });
});