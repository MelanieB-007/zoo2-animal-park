/**
 * Tests für pages/api/origins/index.js
 *
 * GET /api/origins – gibt alle Herkunftsorte zurück (200/500)
 * 405 für andere Methoden
 */

import handler from "../../../pages/api/origins/index";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("../../../services/AnimalService", () => ({
  getAllOrigins: jest.fn(),
}));

import { getAllOrigins } from "../../../services/AnimalService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createRes() {
  const res = { status: jest.fn(), json: jest.fn(), setHeader: jest.fn(), end: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── GET ─────────────────────────────────────────────────────────────────────

describe("GET /api/origins", () => {
  it("gibt 200 mit allen Herkunftsorten zurück", async () => {
    const mockOrigins = [{ id: 1, name: "Wild" }, { id: 2, name: "Zucht" }];
    getAllOrigins.mockResolvedValueOnce(mockOrigins);

    const req = { method: "GET" };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockOrigins);
  });

  it("gibt 500 zurück wenn getAllOrigins einen Fehler wirft", async () => {
    getAllOrigins.mockRejectedValueOnce(new Error("DB Error"));

    const req = { method: "GET" };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── Nicht erlaubte Methoden ──────────────────────────────────────────────────

describe("Nicht erlaubte Methoden", () => {
  it("gibt 405 zurück bei POST", async () => {
    const req = { method: "POST" };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("gibt 405 zurück bei DELETE", async () => {
    const req = { method: "DELETE" };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });
});