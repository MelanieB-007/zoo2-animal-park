/**
 * Tests für pages/api/contests/create.js
 *
 * POST /api/contests/create – Auth-geschützt, erstellt einen neuen Wettbewerb
 *   - 401 ohne Session
 *   - 405 bei Nicht-POST
 *   - 201 bei Erfolg
 *   - 500 bei Fehler im Service
 */

import handler from "../../../pages/api/contests/create";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("next-auth/next", () => ({ getServerSession: jest.fn() }));
jest.mock("next-auth", () => ({ default: jest.fn() }));
jest.mock("../../../pages/api/auth/[...nextauth]", () => ({ authOptions: {} }));
jest.mock("../../../services/ContestService", () => ({
  createContest: jest.fn(),
}));

import { getServerSession } from "next-auth/next";
import { createContest } from "../../../services/ContestService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createRes() {
  const res = { status: jest.fn(), json: jest.fn(), end: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe("Auth-Prüfung", () => {
  it("gibt 401 zurück wenn keine Session vorhanden ist", async () => {
    getServerSession.mockResolvedValueOnce(null);
    const req = { method: "POST", body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Nicht autorisiert" });
  });
});

// ─── Methoden-Prüfung ─────────────────────────────────────────────────────────

describe("Methoden-Prüfung", () => {
  it("gibt 405 zurück bei GET (Nicht-POST) mit Session", async () => {
    getServerSession.mockResolvedValueOnce({ user: { name: "Admin" } });
    const req = { method: "GET", body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("gibt 405 zurück bei DELETE mit Session", async () => {
    getServerSession.mockResolvedValueOnce({ user: { name: "Admin" } });
    const req = { method: "DELETE", body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });
});

// ─── POST ─────────────────────────────────────────────────────────────────────

describe("POST /api/contests/create", () => {
  it("gibt 201 mit dem erstellten Wettbewerb zurück", async () => {
    getServerSession.mockResolvedValueOnce({ user: { name: "Admin" } });
    const mockContest = { id: 10, start: "2026-01-01", ende: "2026-12-31" };
    createContest.mockResolvedValueOnce(mockContest);

    const req = { method: "POST", body: { start: "2026-01-01", ende: "2026-12-31" } };
    const res = createRes();

    await handler(req, res);

    expect(createContest).toHaveBeenCalledWith({ start: "2026-01-01", ende: "2026-12-31" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, contest: mockContest });
  });

  it("gibt 500 zurück wenn createContest einen Fehler wirft", async () => {
    getServerSession.mockResolvedValueOnce({ user: { name: "Admin" } });
    createContest.mockRejectedValueOnce(new Error("DB Error"));

    const req = { method: "POST", body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});