import handler from "../../../pages/api/contests/save-entry";

jest.mock("../../../lib/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
    wettbewerb_ergebnisse: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
  },
}));

import { prisma } from "../../../lib/prisma";

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  // Simuliere $transaction: führt den Callback mit einem tx-Objekt aus
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

describe("POST /api/contests/save-entry", () => {
  test("gibt 405 zurück bei nicht-POST Methode", async () => {
    const req = { method: "GET", body: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  test("gibt 400 zurück wenn contestId fehlt", async () => {
    const req = {
      method: "POST",
      body: { memberId: "1", data: {} },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("gibt 400 zurück wenn memberId fehlt", async () => {
    const req = {
      method: "POST",
      body: { contestId: "1", data: {} },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("gibt 400 zurück wenn data fehlt", async () => {
    const req = {
      method: "POST",
      body: { contestId: "1", memberId: "1" },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("speichert Ergebnisse und gibt 200 zurück", async () => {
    const req = {
      method: "POST",
      body: {
        contestId: "1",
        memberId: "42",
        data: {
          10: [
            { level: "5", count: "3" },
            { level: "8", count: "2" },
          ],
        },
      },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Ergebnisse gespeichert",
    });
  });

  test("löscht alte Einträge vor dem Speichern (via Transaktion)", async () => {
    let capturedTx;
    prisma.$transaction.mockImplementation(async (callback) => {
      capturedTx = {
        wettbewerb_ergebnisse: {
          deleteMany: jest.fn().mockResolvedValue({}),
          createMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
      };
      return callback(capturedTx);
    });

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

    expect(capturedTx.wettbewerb_ergebnisse.deleteMany).toHaveBeenCalledWith({
      where: { contest_id: 1, member_id: 42 },
    });
  });

  test("überspringt leere Zeilen beim Speichern", async () => {
    let capturedTx;
    prisma.$transaction.mockImplementation(async (callback) => {
      capturedTx = {
        wettbewerb_ergebnisse: {
          deleteMany: jest.fn().mockResolvedValue({}),
          createMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
      };
      return callback(capturedTx);
    });

    const req = {
      method: "POST",
      body: {
        contestId: "1",
        memberId: "42",
        data: {
          10: [
            { level: "5", count: "3" }, // gültig
            { level: "", count: "" }, // wird übersprungen
          ],
        },
      },
    };
    const res = createMockRes();

    await handler(req, res);

    const createCall = capturedTx.wettbewerb_ergebnisse.createMany.mock.calls[0][0];
    expect(createCall.data).toHaveLength(1);
  });

  test("ruft createMany nicht auf wenn nur leere Zeilen vorhanden", async () => {
    let capturedTx;
    prisma.$transaction.mockImplementation(async (callback) => {
      capturedTx = {
        wettbewerb_ergebnisse: {
          deleteMany: jest.fn().mockResolvedValue({}),
          createMany: jest.fn(),
        },
      };
      return callback(capturedTx);
    });

    const req = {
      method: "POST",
      body: {
        contestId: "1",
        memberId: "42",
        data: { 10: [{ level: "", count: "" }] },
      },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(capturedTx.wettbewerb_ergebnisse.createMany).not.toHaveBeenCalled();
  });

  test("gibt 500 zurück wenn Transaktion fehlschlägt", async () => {
    prisma.$transaction.mockRejectedValue(new Error("Transaktion fehlgeschlagen"));

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

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
