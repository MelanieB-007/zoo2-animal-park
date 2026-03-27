/**
 * Tests für pages/api/languages/index.js
 *
 * GET /api/languages – gibt alle Sprachen zurück (200/500)
 * 405 für andere Methoden
 */

import handler from "../../../pages/api/languages/index";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("../../../services/CommonService", () => ({
  getAllLanguages: jest.fn(),
}));

import { getAllLanguages } from "../../../services/CommonService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createRes() {
  const res = { status: jest.fn(), json: jest.fn(), end: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── GET ─────────────────────────────────────────────────────────────────────

describe("GET /api/languages", () => {
  it("gibt 200 mit allen Sprachen zurück", async () => {
    const mockLanguages = [{ code: "de", name: "Deutsch" }, { code: "en", name: "English" }];
    getAllLanguages.mockResolvedValueOnce(mockLanguages);

    const req = { method: "GET" };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLanguages);
  });

  it("gibt 500 zurück wenn getAllLanguages einen Fehler wirft", async () => {
    getAllLanguages.mockRejectedValueOnce(new Error("DB Error"));

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