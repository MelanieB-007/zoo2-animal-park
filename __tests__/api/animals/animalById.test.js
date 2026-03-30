/**
 * Tests für PUT /api/animals/[id] (Tier ändern) und DELETE /api/animals/[id] (Tier löschen).
 *
 * HINWEIS: PUT und DELETE haben aktuell KEINEN Auth-Check in der Implementierung
 * (pages/api/animals/[id].js). Die Tests für 401 werden daher FEHLSCHLAGEN,
 * bis ein Session-Check ergänzt wird – das ist beabsichtigt (TDD).
 */
import handler from "../../../pages/api/animals/[id]";

// --- Mocks ---

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("../../../pages/api/auth/[...nextauth]", () => ({
  authOptions: {},
}));

jest.mock("../../../services/AnimalService", () => ({
  getAnimalById: jest.fn(),
  updateAnimal: jest.fn(),
  deleteAnimalFromDB: jest.fn(),
}));

import { getServerSession } from "next-auth/next";
import { getAnimalById, updateAnimal, deleteAnimalFromDB } from "../../../services/AnimalService";

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
// Punkt 3: PUT /api/animals/[id] – nur für eingeloggte User (Tier ändern)
// HINWEIS: Diese Tests schlagen fehl, bis ein Auth-Check ergänzt wird!
// ---------------------------------------------------------------------------
describe("PUT /api/animals/[id] – Authentifizierung (Punkt 3)", () => {
  test("gibt 401 zurück wenn kein Login vorhanden", async () => {
    getServerSession.mockResolvedValue(null);

    const req = {
      method: "PUT",
      query: { id: "5" },
      body: { name: "Gepard" },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(updateAnimal).not.toHaveBeenCalled();
  });

  test("aktualisiert Tier und gibt 200 zurück wenn eingeloggt", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Alice" } });
    updateAnimal.mockResolvedValue({ id: 5, name: "Gepard" });

    const req = {
      method: "PUT",
      query: { id: "5" },
      body: { name: "Gepard" },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(updateAnimal).toHaveBeenCalledWith("5", { name: "Gepard" });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

// ---------------------------------------------------------------------------
// Punkt 4: DELETE /api/animals/[id] – nur für eingeloggte User (Tier löschen)
// HINWEIS: Diese Tests schlagen fehl, bis ein Auth-Check ergänzt wird!
// ---------------------------------------------------------------------------
describe("DELETE /api/animals/[id] – Authentifizierung (Punkt 4)", () => {
  test("gibt 401 zurück wenn kein Login vorhanden", async () => {
    getServerSession.mockResolvedValue(null);

    const req = { method: "DELETE", query: { id: "5" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(deleteAnimalFromDB).not.toHaveBeenCalled();
  });

  test("löscht Tier und gibt 200 zurück wenn eingeloggt", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Alice" } });
    deleteAnimalFromDB.mockResolvedValue(true);

    const req = { method: "DELETE", query: { id: "7" } };
    const res = createMockRes();

    await handler(req, res);

    expect(deleteAnimalFromDB).toHaveBeenCalledWith("7");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("gibt 500 zurück wenn Löschen fehlschlägt", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Alice" } });
    deleteAnimalFromDB.mockResolvedValue(false);

    const req = { method: "DELETE", query: { id: "7" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------------------
// GET /api/animals/[id] – öffentlich, kein Login erforderlich
// ---------------------------------------------------------------------------
describe("GET /api/animals/[id] – öffentlich zugänglich", () => {
  test("gibt ein Tier zurück ohne Login", async () => {
    const mockAnimal = { id: 5, name: "Löwe" };
    getAnimalById.mockResolvedValue(mockAnimal);

    const req = { method: "GET", query: { id: "5" } };
    const res = createMockRes();

    await handler(req, res);

    expect(getServerSession).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("gibt 404 zurück wenn Tier nicht gefunden", async () => {
    getAnimalById.mockResolvedValue(null);

    const req = { method: "GET", query: { id: "999" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
