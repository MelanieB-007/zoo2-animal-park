import handler from "../../../pages/api/contests/get-entry";

jest.mock("../../../lib/prisma", () => ({
  prisma: {
    wettbewerb_ergebnisse: {
      findMany: jest.fn(),
    },
  },
}));

import { prisma } from "../../../lib/prisma";

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/contests/get-entry", () => {
  test("gibt 405 zurück bei nicht-GET Methode", async () => {
    const req = { method: "POST", query: { contestId: "1", memberId: "1" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  test("gibt formatierte Einträge zurück", async () => {
    const mockResults = [
      { id: 1, tier_id: 10, level: 5, anzahl: 3 },
      { id: 2, tier_id: 10, level: 8, anzahl: 2 },
      { id: 3, tier_id: 20, level: 3, anzahl: 5 },
    ];
    prisma.wettbewerb_ergebnisse.findMany.mockResolvedValue(mockResults);

    const req = { method: "GET", query: { contestId: "1", memberId: "42" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.data).toBeDefined();
    // Tier 10 hat 2 Einträge
    expect(responseData.data[10]).toHaveLength(2);
    expect(responseData.data[10][0]).toEqual({ id: 1, level: 5, count: 3 });
    // Tier 20 hat 1 Eintrag
    expect(responseData.data[20]).toHaveLength(1);
    expect(responseData.data[20][0]).toEqual({ id: 3, level: 3, count: 5 });
  });

  test("gibt leeres Objekt zurück wenn keine Einträge vorhanden", async () => {
    prisma.wettbewerb_ergebnisse.findMany.mockResolvedValue([]);

    const req = { method: "GET", query: { contestId: "1", memberId: "42" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: {} });
  });

  test("filtert nach contestId und memberId als Integer", async () => {
    prisma.wettbewerb_ergebnisse.findMany.mockResolvedValue([]);

    const req = { method: "GET", query: { contestId: "5", memberId: "99" } };
    const res = createMockRes();

    await handler(req, res);

    const callArg = prisma.wettbewerb_ergebnisse.findMany.mock.calls[0][0];
    expect(callArg.where).toEqual({ contest_id: 5, member_id: 99 });
  });

  test("gibt 500 zurück wenn Datenbankabfrage fehlschlägt", async () => {
    prisma.wettbewerb_ergebnisse.findMany.mockRejectedValue(new Error("DB Error"));

    const req = { method: "GET", query: { contestId: "1", memberId: "1" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
