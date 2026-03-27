/**
 * Tests für pages/api/contests/statues/index.js
 *
 * GET /api/contests/statues – gibt alle Statuen zurück (200/500)
 * lang-Parameter wird weitergeleitet, Fallback "de"
 * 405 für andere Methoden
 */

import handler from "../../../pages/api/contests/statues/index";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("../../../services/StatueService", () => ({
  getAllStatues: jest.fn(),
}));

import { getAllStatues } from "../../../services/StatueService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createRes() {
  const res = { status: jest.fn(), json: jest.fn(), setHeader: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── GET ─────────────────────────────────────────────────────────────────────

describe("GET /api/contests/statues", () => {
  it("gibt 200 mit allen Statuen zurück", async () => {
    const mockStatues = [{ id: 1, tier: { texte: [] } }];
    getAllStatues.mockResolvedValueOnce(mockStatues);

    const req = { method: "GET", query: { lang: "de" } };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStatues);
  });

  it("übergibt den lang-Parameter an getAllStatues", async () => {
    getAllStatues.mockResolvedValueOnce([]);

    const req = { method: "GET", query: { lang: "en" } };
    const res = createRes();

    await handler(req, res);

    expect(getAllStatues).toHaveBeenCalledWith("en");
  });

  it("nutzt 'de' als Fallback wenn kein lang übergeben wird", async () => {
    getAllStatues.mockResolvedValueOnce([]);

    const req = { method: "GET", query: {} };
    const res = createRes();

    await handler(req, res);

    expect(getAllStatues).toHaveBeenCalledWith("de");
  });

  it("gibt 500 zurück wenn getAllStatues einen Fehler wirft", async () => {
    getAllStatues.mockRejectedValueOnce(new Error("DB Error"));

    const req = { method: "GET", query: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── Nicht erlaubte Methoden ──────────────────────────────────────────────────

describe("Nicht erlaubte Methoden", () => {
  it("gibt 405 zurück bei POST", async () => {
    const req = { method: "POST", query: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });
});