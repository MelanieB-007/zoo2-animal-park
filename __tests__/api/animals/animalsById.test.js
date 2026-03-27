/**
 * Tests für pages/api/animals/[id].js
 *
 * GET    /api/animals/:id  – lädt ein einzelnes Tier (200/404/500)
 * PUT    /api/animals/:id  – aktualisiert ein Tier (200/500)
 * DELETE /api/animals/:id  – löscht ein Tier (200/500)
 * 405 für andere Methoden
 */

import handler from "../../../pages/api/animals/[id]";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("../../../services/AnimalService", () => ({
  getAnimalById:       jest.fn(),
  updateAnimal:        jest.fn(),
  deleteAnimalFromDB:  jest.fn(),
}));

import { getAnimalById, updateAnimal, deleteAnimalFromDB } from "../../../services/AnimalService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createRes() {
  const res = { status: jest.fn(), json: jest.fn(), setHeader: jest.fn(), end: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── GET ─────────────────────────────────────────────────────────────────────

describe("GET /api/animals/:id", () => {
  it("gibt 200 mit dem Tier zurück wenn es gefunden wurde", async () => {
    const mockAnimal = { id: 1, name: "Löwe" };
    getAnimalById.mockResolvedValueOnce(mockAnimal);

    const req = { method: "GET", query: { id: "1" } };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAnimal);
  });

  it("gibt 404 zurück wenn das Tier nicht gefunden wurde", async () => {
    getAnimalById.mockResolvedValueOnce(null);

    const req = { method: "GET", query: { id: "99" } };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Tier nicht gefunden" });
  });

  it("gibt 500 zurück wenn getAnimalById einen Fehler wirft", async () => {
    getAnimalById.mockRejectedValueOnce(new Error("DB Error"));

    const req = { method: "GET", query: { id: "1" } };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── PUT ─────────────────────────────────────────────────────────────────────

describe("PUT /api/animals/:id", () => {
  it("gibt 200 mit dem aktualisierten Tier zurück", async () => {
    const updated = { id: 1, name: "Löwe (aktualisiert)" };
    updateAnimal.mockResolvedValueOnce(updated);

    const req = { method: "PUT", query: { id: "1" }, body: { name: "Löwe (aktualisiert)" } };
    const res = createRes();

    await handler(req, res);

    expect(updateAnimal).toHaveBeenCalledWith("1", { name: "Löwe (aktualisiert)" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("gibt 500 zurück wenn updateAnimal einen Fehler wirft", async () => {
    updateAnimal.mockRejectedValueOnce(new Error("Update Error"));

    const req = { method: "PUT", query: { id: "1" }, body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── DELETE ──────────────────────────────────────────────────────────────────

describe("DELETE /api/animals/:id", () => {
  it("gibt 200 mit success:true zurück wenn Löschen erfolgreich war", async () => {
    deleteAnimalFromDB.mockResolvedValueOnce(true);

    const req = { method: "DELETE", query: { id: "1" } };
    const res = createRes();

    await handler(req, res);

    expect(deleteAnimalFromDB).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("gibt 500 zurück wenn deleteAnimalFromDB false zurückgibt", async () => {
    deleteAnimalFromDB.mockResolvedValueOnce(false);

    const req = { method: "DELETE", query: { id: "1" } };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── Nicht erlaubte Methoden ──────────────────────────────────────────────────

describe("Nicht erlaubte Methoden", () => {
  it("gibt 405 zurück bei POST", async () => {
    const req = { method: "POST", query: { id: "1" } };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });
});
