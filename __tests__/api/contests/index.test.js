/**
 * Tests für pages/api/contests/index.js
 *
 * GET /api/contests – gibt alle Wettbewerbe zurück (200/500)
 * 405 für andere Methoden
 */

import handler from "../../../pages/api/contests/index";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("../../../services/ContestService", () => ({
  getAllContests: jest.fn(),
}));

import { getAllContests } from "../../../services/ContestService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createRes() {
  const res = { status: jest.fn(), json: jest.fn(), setHeader: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── GET ─────────────────────────────────────────────────────────────────────

describe("GET /api/contests", () => {
  it("gibt 200 mit allen Wettbewerben zurück", async () => {
    const mockContests = [{ id: 1, start: "2026-01-01" }];
    getAllContests.mockResolvedValueOnce(mockContests);

    const req = { method: "GET" };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockContests);
  });

  it("gibt 200 mit leerem Array zurück wenn keine Wettbewerbe vorhanden sind", async () => {
    getAllContests.mockResolvedValueOnce([]);

    const req = { method: "GET" };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("gibt 500 zurück wenn getAllContests einen Fehler wirft", async () => {
    getAllContests.mockRejectedValueOnce(new Error("DB Error"));

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
