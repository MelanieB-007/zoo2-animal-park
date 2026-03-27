/**
 * Tests für pages/api/contests/[id]/index.js
 *
 * DELETE /api/contests/:id  – löscht einen Wettbewerb (200/500)
 * PUT    /api/contests/:id  – aktualisiert Datum (200/500)
 * 405 für andere Methoden (GET, POST)
 */

import handler from "../../../pages/api/contests/[id]/index";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockDelete = jest.fn();
const mockUpdate = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    wettbewerbe: {
      delete: (...args) => mockDelete(...args),
      update: (...args) => mockUpdate(...args),
    },
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createRes() {
  const res = { status: jest.fn(), json: jest.fn(), setHeader: jest.fn(), end: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── DELETE ──────────────────────────────────────────────────────────────────

describe("DELETE /api/contests/:id", () => {
  it("gibt 200 zurück wenn Löschen erfolgreich war", async () => {
    mockDelete.mockResolvedValueOnce({ id: 5 });

    const req = { method: "DELETE", query: { id: "5" }, body: {} };
    const res = createRes();

    await handler(req, res);

    expect(mockDelete).toHaveBeenCalledWith({ where: { id: 5 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Alles inklusive Relationen gelöscht" });
  });

  it("gibt 500 zurück wenn prisma.delete einen Fehler wirft", async () => {
    mockDelete.mockRejectedValueOnce(new Error("DB Error"));

    const req = { method: "DELETE", query: { id: "5" }, body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Fehler beim Löschen" });
  });
});

// ─── PUT ─────────────────────────────────────────────────────────────────────

describe("PUT /api/contests/:id", () => {
  it("gibt 200 mit dem aktualisierten Wettbewerb zurück", async () => {
    const updated = { id: 5, start: new Date("2026-01-01"), ende: new Date("2026-12-31") };
    mockUpdate.mockResolvedValueOnce(updated);

    const req = {
      method: "PUT",
      query: { id: "5" },
      body: { start: "2026-01-01", ende: "2026-12-31" },
    };
    const res = createRes();

    await handler(req, res);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 5 },
      data: {
        start: new Date("2026-01-01"),
        ende:  new Date("2026-12-31"),
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("gibt 500 zurück wenn prisma.update einen Fehler wirft", async () => {
    mockUpdate.mockRejectedValueOnce(new Error("DB Error"));

    const req = {
      method: "PUT",
      query: { id: "5" },
      body: { start: "2026-01-01", ende: "2026-12-31" },
    };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Fehler beim Updaten" });
  });
});

// ─── Nicht erlaubte Methoden ──────────────────────────────────────────────────

describe("Nicht erlaubte Methoden", () => {
  it("gibt 405 zurück bei GET", async () => {
    const req = { method: "GET", query: { id: "5" }, body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("gibt 405 zurück bei POST", async () => {
    const req = { method: "POST", query: { id: "5" }, body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });
});
