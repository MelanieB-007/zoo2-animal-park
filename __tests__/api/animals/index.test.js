/**
 * Tests für pages/api/animals/index.js
 *
 * GET  /api/animals  – öffentlich, gibt alle Tiere zurück
 * POST /api/animals  – Auth-geschützt, legt ein neues Tier an
 */

import handler from "../../../pages/api/animals/index";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("next-auth/next", () => ({ getServerSession: jest.fn() }));
jest.mock("next-auth", () => ({ default: jest.fn() }));
jest.mock("../../../pages/api/auth/[...nextauth]", () => ({ authOptions: {} }));
jest.mock("../../../services/AnimalService", () => ({
  getAllAnimals:  jest.fn(),
  createAnimal:  jest.fn(),
  getAnimalById: jest.fn(),
}));

import { getServerSession } from "next-auth/next";
import { getAllAnimals, createAnimal, getAnimalById } from "../../../services/AnimalService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createRes() {
  const res = { status: jest.fn(), json: jest.fn(), setHeader: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── GET ─────────────────────────────────────────────────────────────────────

describe("GET /api/animals", () => {
  it("gibt 200 mit allen Tieren zurück", async () => {
    const mockAnimals = [{ id: 1, name: "Löwe" }];
    getAllAnimals.mockResolvedValueOnce(mockAnimals);

    const req = { method: "GET", query: { lang: "de" } };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAnimals);
  });

  it("übergibt den lang-Parameter an getAllAnimals", async () => {
    getAllAnimals.mockResolvedValueOnce([]);
    const req = { method: "GET", query: { lang: "en" } };
    const res = createRes();

    await handler(req, res);

    expect(getAllAnimals).toHaveBeenCalledWith("en");
  });

  it("nutzt 'de' als Fallback wenn kein lang übergeben wird", async () => {
    getAllAnimals.mockResolvedValueOnce([]);
    const req = { method: "GET", query: {} };
    const res = createRes();

    await handler(req, res);

    expect(getAllAnimals).toHaveBeenCalledWith("de");
  });

  it("gibt 200 mit leerem Array zurück wenn getAllAnimals null zurückgibt", async () => {
    getAllAnimals.mockResolvedValueOnce(null);
    const req = { method: "GET", query: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("gibt 500 zurück wenn getAllAnimals einen Fehler wirft", async () => {
    getAllAnimals.mockRejectedValueOnce(new Error("DB Error"));
    const req = { method: "GET", query: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── POST ─────────────────────────────────────────────────────────────────────

describe("POST /api/animals", () => {
  it("gibt 401 zurück wenn keine Session vorhanden ist", async () => {
    getServerSession.mockResolvedValueOnce(null);
    const req = { method: "POST", query: {}, body: { name: "Tiger" } };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("gibt 201 mit dem erstellten Tier zurück (mit Session)", async () => {
    getServerSession.mockResolvedValueOnce({ user: { name: "Admin" } });
    createAnimal.mockResolvedValueOnce({ id: 42 });
    getAnimalById.mockResolvedValueOnce({ id: 42, name: "Tiger" });

    const req = { method: "POST", query: {}, body: { name: "Tiger" } };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 42, name: "Tiger" });
  });

  it("ruft getAnimalById mit der ID des neuen Tieres auf", async () => {
    getServerSession.mockResolvedValueOnce({ user: {} });
    createAnimal.mockResolvedValueOnce({ id: 99 });
    getAnimalById.mockResolvedValueOnce({ id: 99, name: "Elefant" });

    const req = { method: "POST", query: {}, body: { name: "Elefant" } };
    const res = createRes();

    await handler(req, res);

    expect(getAnimalById).toHaveBeenCalledWith(99, "de");
  });

  it("gibt 500 zurück wenn createAnimal einen Fehler wirft", async () => {
    getServerSession.mockResolvedValueOnce({ user: {} });
    createAnimal.mockRejectedValueOnce(new Error("DB Error"));

    const req = { method: "POST", query: {}, body: {} };
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── Nicht erlaubte Methoden ──────────────────────────────────────────────────

describe("Nicht erlaubte Methoden", () => {
  it("gibt 405 zurück bei DELETE", async () => {
    const req = { method: "DELETE", query: {} };
    const res = createRes();
    res.end = jest.fn();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });
});
