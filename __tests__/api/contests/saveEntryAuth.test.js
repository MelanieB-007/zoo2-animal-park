/**
 * Authentifizierungstest für POST /api/contests/save-entry (Entries anlegen/ändern).
 *
 * HINWEIS: save-entry hat aktuell KEINEN Auth-Check (pages/api/contests/save-entry.js).
 * Der Test "gibt 401 zurück wenn kein Login vorhanden" wird FEHLSCHLAGEN,
 * bis ein Session-Check ergänzt wird – das ist beabsichtigt (TDD / Punkt 7).
 */
import handler from "../../../pages/api/contests/save-entry";

// --- Mocks ---

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("../../../pages/api/auth/[...nextauth]", () => ({
  authOptions: {},
}));

jest.mock("../../../src/lib/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

import { getServerSession } from "next-auth/next";
import { prisma } from "../../../src/lib/prisma";

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  prisma.$transaction.mockImplementation(async (callback) => {
    const tx = {
      wettbewerb_ergebnisse: {
        deleteMany: jest.fn().mockResolvedValue({}),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    return callback(tx);
  });
});

// ---------------------------------------------------------------------------
// Punkt 7: POST /api/contests/save-entry – nur für eingeloggte User
// ---------------------------------------------------------------------------
describe("POST /api/contests/save-entry – Authentifizierung (Punkt 7)", () => {
  test("gibt 401 zurück wenn kein Login vorhanden", async () => {
    getServerSession.mockResolvedValue(null);

    const req = {
      method: "POST",
      body: {
        contestId: "1",
        memberId: "42",
        data: { 10: [{ level: "5", count: "3" }] },
      },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  test("speichert Entries wenn eingeloggt", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Alice" } });

    const req = {
      method: "POST",
      body: {
        contestId: "1",
        memberId: "42",
        data: { 10: [{ level: "5", count: "3" }] },
      },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});