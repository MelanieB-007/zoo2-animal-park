/**
 * Unit-Tests für StatueService
 *
 * Abgedeckt:
 *  1. getAllStatues – Prisma-Aufruf, locale-Parameter, Rückgabe
 */

import { getAllStatues } from "../../services/StatueService";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockFindMany = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    wettbewerbstatuen: {
      findMany: (...args) => mockFindMany(...args),
    },
  },
}));

beforeEach(() => jest.clearAllMocks());

// ─── getAllStatues ─────────────────────────────────────────────────────────────

describe("getAllStatues", () => {
  it("gibt die Statuen-Liste zurück", async () => {
    const mockStatues = [
      { id: 1, tier: { texte: [{ spracheCode: "de", name: "Löwe" }], gehege: { name: "Zoo" } } },
    ];
    mockFindMany.mockResolvedValueOnce(mockStatues);

    const result = await getAllStatues();

    expect(result).toEqual(mockStatues);
  });

  it("verwendet 'de' als Standard-Locale", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    await getAllStatues();

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          tier: expect.objectContaining({
            include: expect.objectContaining({
              texte: expect.objectContaining({
                where: { spracheCode: "de" },
              }),
            }),
          }),
        }),
      })
    );
  });

  it("übergibt den locale-Parameter an die texte-Abfrage", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    await getAllStatues("en");

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          tier: expect.objectContaining({
            include: expect.objectContaining({
              texte: expect.objectContaining({
                where: { spracheCode: "en" },
              }),
            }),
          }),
        }),
      })
    );
  });

  it("sortiert nach id aufsteigend", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    await getAllStatues();

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { id: "asc" } })
    );
  });

  it("gibt leeres Array zurück wenn keine Statuen vorhanden sind", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    const result = await getAllStatues();

    expect(result).toEqual([]);
  });
});
