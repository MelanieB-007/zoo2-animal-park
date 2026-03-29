import handler from "../../../pages/api/contests/[id]";

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("../../../pages/api/auth/[...nextauth]", () => ({
  authOptions: {},
}));

jest.mock("../../../lib/prisma", () => ({
  prisma: {
    wettbewerbe: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { getServerSession } from "next-auth/next";
import { prisma } from "../../../lib/prisma";

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// GET /api/contests/[id]
// ---------------------------------------------------------------------------
describe("GET /api/contests/[id]", () => {
  test("gibt Wettbewerb per ID zurück", async () => {
    const mockContest = { id: 1 };
    prisma.wettbewerbe.findUnique.mockResolvedValue(mockContest);

    const req = { method: "GET", query: { id: "1" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockContest);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/contests/[id]
// ---------------------------------------------------------------------------
describe("PUT /api/contests/[id]", () => {
  test("gibt 401 zurück wenn nicht eingeloggt", async () => {
    getServerSession.mockResolvedValue(null);

    const req = {
      method: "PUT",
      query: { id: "1" },
      body: {},
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(prisma.wettbewerbe.update).not.toHaveBeenCalled();
  });

  test("aktualisiert Wettbewerb und gibt 200 zurück", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Admin" } });
    const mockUpdated = { id: 1, statuen: [] };
    prisma.wettbewerbe.update.mockResolvedValue(mockUpdated);

    const req = {
      method: "PUT",
      query: { id: "1" },
      body: {
        start: "2025-03-01",
        ende: "2025-03-08",
        aktiv: 1,
        statuenIds: [5, 6, 7],
      },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(prisma.wettbewerbe.update).toHaveBeenCalledTimes(1);
    const callArg = prisma.wettbewerbe.update.mock.calls[0][0];
    expect(callArg.where.id).toBe(1);
    expect(callArg.data.statuen.deleteMany).toBeDefined();
    expect(callArg.data.statuen.create).toHaveLength(3);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUpdated);
  });

  test("gibt 500 zurück wenn Update fehlschlägt", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Admin" } });
    prisma.wettbewerbe.update.mockRejectedValue(new Error("DB Error"));

    const req = {
      method: "PUT",
      query: { id: "1" },
      body: { start: "2025-01-01", ende: "2025-01-08", aktiv: 1, statuenIds: [1, 2, 3] },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/contests/[id]
// ---------------------------------------------------------------------------
describe("DELETE /api/contests/[id]", () => {
  test("gibt 401 zurück wenn nicht eingeloggt", async () => {
    getServerSession.mockResolvedValue(null);

    const req = { method: "DELETE", query: { id: "1" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(prisma.wettbewerbe.delete).not.toHaveBeenCalled();
  });

  test("löscht Wettbewerb und gibt 200 zurück", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Admin" } });
    prisma.wettbewerbe.delete.mockResolvedValue({});

    const req = { method: "DELETE", query: { id: "3" } };
    const res = createMockRes();

    await handler(req, res);

    expect(prisma.wettbewerbe.delete).toHaveBeenCalledWith({
      where: { id: 3 },
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("gibt 500 zurück wenn Löschen fehlschlägt", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Admin" } });
    prisma.wettbewerbe.delete.mockRejectedValue(new Error("FK Constraint"));

    const req = { method: "DELETE", query: { id: "3" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// Unbekannte Methode
// ---------------------------------------------------------------------------
describe("Nicht erlaubte Methoden", () => {
  test("gibt 405 zurück für PATCH", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Admin" } });

    const req = { method: "PATCH", query: { id: "1" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith("Allow", ["GET", "PUT", "DELETE"]);
    expect(res.status).toHaveBeenCalledWith(405);
  });
});
