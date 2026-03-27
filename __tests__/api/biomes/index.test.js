/**
 * Tests für pages/api/biomes/index.js
 *
 * GET /api/biomes – gibt alle Gehege zurück (200/500)
 * 405 für andere Methoden
 */

import handler from "../../../pages/api/biomes/index";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("../../../services/BiomeService", () => ({
  getAllBiomes: jest.fn(),
}));

import { getAllBiomes } from "../../../services/BiomeService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createRes() {
  const res = { status: jest.fn(), json: jest.fn(), end: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── GET ─────────────────────────────────────────────────────────────────────

describe("GET /api/biomes", () => {
  it("gibt 200 mit allen Gehegen zurück", async () => {
    const mockBiomes = [{ id: 1, name: "Savanne" }];
    getAllBiomes.mockResolvedValueOnce(mockBiomes);

    const req = { method: "GET" };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBiomes);
  });

  it("gibt 500 zurück wenn getAllBiomes einen Fehler wirft", async () => {
    getAllBiomes.mockRejectedValueOnce(new Error("DB Error"));

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
});