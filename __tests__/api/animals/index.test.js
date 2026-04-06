import handler from "../../../pages/api/animals/index";

// --- Mocks ---

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("../../../pages/api/auth/[...nextauth]", () => ({
  authOptions: {},
}));

jest.mock("../../../src/services/AnimalService", () => ({
  getAllAnimals: jest.fn(),
  createAnimal: jest.fn(),
  getAnimalById: jest.fn(),
}));

import { getServerSession } from "next-auth/next";
import { getAllAnimals, createAnimal, getAnimalById } from "../../../src/services/AnimalService";

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Punkt 3: POST /api/animals – nur für eingeloggte User (Tier anlegen)
// ---------------------------------------------------------------------------
describe("POST /api/animals – Authentifizierung (Punkt 3)", () => {
  test("gibt 401 zurück wenn kein Login vorhanden", async () => {
    getServerSession.mockResolvedValue(null);

    const req = { method: "POST", body: { name: "Löwe" }, query: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(createAnimal).not.toHaveBeenCalled();
  });

  test("legt Tier an und gibt 201 zurück wenn eingeloggt", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Alice" } });
    createAnimal.mockResolvedValue({ id: 42 });
    getAnimalById.mockResolvedValue({ id: 42, name: "Löwe" });

    const req = { method: "POST", body: { name: "Löwe" }, query: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(createAnimal).toHaveBeenCalledWith({ name: "Löwe" });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("gibt 500 zurück wenn Service fehlschlägt", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Alice" } });
    createAnimal.mockRejectedValue(new Error("DB Error"));

    const req = { method: "POST", body: {}, query: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// GET /api/animals – öffentlich, kein Login erforderlich
// ---------------------------------------------------------------------------
describe("GET /api/animals – öffentlich zugänglich", () => {
  test("gibt alle Tiere zurück ohne Login", async () => {
    getAllAnimals.mockResolvedValue([{ id: 1, name: "Tiger" }]);

    const req = { method: "GET", query: { lang: "de" } };
    const res = createMockRes();

    await handler(req, res);

    expect(getServerSession).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: "Tiger" }]);
  });
});

// ---------------------------------------------------------------------------
// Nicht erlaubte Methode
// ---------------------------------------------------------------------------
describe("Nicht erlaubte Methode", () => {
  test("gibt 405 zurück für PATCH", async () => {
    const req = { method: "PATCH", query: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });
});
