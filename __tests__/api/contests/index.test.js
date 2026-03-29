import handler from "../../../pages/api/contests/index";

jest.mock("../../../services/ContestService", () => ({
  getAllContests: jest.fn(),
}));

import { getAllContests } from "../../../services/ContestService";

function createMockRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  };
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/contests", () => {
  test("gibt alle Wettbewerbe mit Status 200 zurück", async () => {
    const mockContests = [{ id: 1 }, { id: 2 }];
    getAllContests.mockResolvedValue(mockContests);

    const req = { method: "GET" };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockContests);
  });

  test("gibt 500 zurück wenn Service fehlschlägt", async () => {
    getAllContests.mockRejectedValue(new Error("DB Error"));

    const req = { method: "GET" };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("gibt 405 zurück bei nicht-GET Methode", async () => {
    const req = { method: "POST" };
    const res = createMockRes();

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith("Allow", ["GET"]);
    expect(res.status).toHaveBeenCalledWith(405);
  });
});
