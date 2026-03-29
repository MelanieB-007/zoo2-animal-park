import handler from "../../../pages/api/contests/create";

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("../../../pages/api/auth/[...nextauth]", () => ({
  authOptions: {},
}));

jest.mock("../../../services/ContestService", () => ({
  createContest: jest.fn(),
}));

import { getServerSession } from "next-auth/next";
import { createContest } from "../../../services/ContestService";

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/contests/create", () => {
  test("gibt 401 zurück wenn keine Session vorhanden", async () => {
    getServerSession.mockResolvedValue(null);

    const req = { method: "POST", body: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(createContest).not.toHaveBeenCalled();
  });

  test("gibt 405 zurück bei nicht-POST Methode", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Admin" } });

    const req = { method: "GET", body: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(createContest).not.toHaveBeenCalled();
  });

  test("erstellt Wettbewerb und gibt 201 zurück", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Admin" } });
    const mockContest = { id: 1, statuen: [] };
    createContest.mockResolvedValue(mockContest);

    const body = {
      start: "2025-01-01",
      ende: "2025-01-08",
      aktiv: 1,
      statuenIds: [1, 2, 3],
    };
    const req = { method: "POST", body };
    const res = createMockRes();

    await handler(req, res);

    expect(createContest).toHaveBeenCalledWith(body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, contest: mockContest });
  });

  test("gibt 500 zurück wenn Service fehlschlägt", async () => {
    getServerSession.mockResolvedValue({ user: { name: "Admin" } });
    createContest.mockRejectedValue(new Error("DB Error"));

    const req = { method: "POST", body: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
