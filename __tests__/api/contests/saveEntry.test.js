/**
 * Tests für pages/api/contests/save-entry.js
 *
 * POST /api/contests/save-entry – speichert Wettbewerbs-Ergebnisse
 *   - 405 bei Nicht-POST
 *   - 400 bei fehlenden Pflichtfeldern
 *   - 200 bei Erfolg
 *   - 400 bei "No valid data to save"
 *   - 500 bei anderen Fehlern
 */

import handler from "../../../pages/api/contests/save-entry";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("../../../services/ContestService", () => ({
  saveContestResults: jest.fn(),
}));

import { saveContestResults } from "../../../services/ContestService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createRes() {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── Methoden-Prüfung ─────────────────────────────────────────────────────────

describe("Methoden-Prüfung", () => {
  it("gibt 405 zurück bei GET", async () => {
    const req = { method: "GET", body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: "Method not allowed" });
  });

  it("gibt 405 zurück bei DELETE", async () => {
    const req = { method: "DELETE", body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });
});

// ─── Validierung ─────────────────────────────────────────────────────────────

describe("Pflichtfeld-Validierung", () => {
  it("gibt 400 zurück wenn contestId fehlt", async () => {
    const req = { method: "POST", body: { memberId: 1, data: [] } };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Fehlende Daten im Payload" });
  });

  it("gibt 400 zurück wenn memberId fehlt", async () => {
    const req = { method: "POST", body: { contestId: 5, data: [] } };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("gibt 400 zurück wenn data fehlt", async () => {
    const req = { method: "POST", body: { contestId: 5, memberId: 1 } };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ─── POST (Erfolg) ────────────────────────────────────────────────────────────

describe("POST /api/contests/save-entry", () => {
  it("gibt 200 mit Ergebniszähler zurück bei Erfolg", async () => {
    saveContestResults.mockResolvedValueOnce({ count: 3 });

    const req = {
      method: "POST",
      body: { contestId: 5, memberId: 1, data: [{ tier_id: 10, level: 5, anzahl: 2 }] },
    };
    const res = createRes();

    await handler(req, res);

    expect(saveContestResults).toHaveBeenCalledWith(
      5,
      1,
      [{ tier_id: 10, level: 5, anzahl: 2 }]
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Ergebnisse erfolgreich gespeichert",
      count: 3,
    });
  });

  it("gibt 400 zurück wenn saveContestResults 'No valid data to save' wirft", async () => {
    saveContestResults.mockRejectedValueOnce(new Error("No valid data to save"));

    const req = {
      method: "POST",
      body: { contestId: 5, memberId: 1, data: [] },
    };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "No valid data to save" });
  });

  it("gibt 500 zurück bei einem anderen Fehler", async () => {
    saveContestResults.mockRejectedValueOnce(new Error("DB Error"));

    const req = {
      method: "POST",
      body: { contestId: 5, memberId: 1, data: [{ tier_id: 10 }] },
    };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
