/**
 * Unit-Tests für MemberService
 *
 * Abgedeckt:
 *  1. getAllMembers  – Filterung, Name-Mapping, Fallbacks, Fehlerfall
 *  2. getMemberById – gefunden, null bei Fehler, Integer-Konvertierung
 */

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    mitglieder: {
      findMany:   jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { getAllMembers, getMemberById } from "../../services/MemberService";

beforeEach(() => jest.clearAllMocks());

// ─── 1. getAllMembers ─────────────────────────────────────────────────────────

describe("1. getAllMembers", () => {
  it("fragt nur aktive Mitglieder ab (aktiv: 'ja')", async () => {
    prisma.mitglieder.findMany.mockResolvedValueOnce([]);

    await getAllMembers();

    expect(prisma.mitglieder.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { aktiv: "ja" } })
    );
  });

  it("sortiert nach upjersname aufsteigend", async () => {
    prisma.mitglieder.findMany.mockResolvedValueOnce([]);

    await getAllMembers();

    expect(prisma.mitglieder.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { upjersname: "asc" } })
    );
  });

  it("mappt upjersname als name wenn vorhanden", async () => {
    prisma.mitglieder.findMany.mockResolvedValueOnce([
      { id: 1, upjersname: "Alice", name: "AliceReal" },
    ]);

    const result = await getAllMembers();

    expect(result[0]).toEqual({ id: 1, name: "Alice" });
  });

  it("nutzt name als Fallback wenn upjersname null ist", async () => {
    prisma.mitglieder.findMany.mockResolvedValueOnce([
      { id: 2, upjersname: null, name: "Bob" },
    ]);

    const result = await getAllMembers();

    expect(result[0]).toEqual({ id: 2, name: "Bob" });
  });

  it("nutzt 'User #ID' als Fallback wenn weder upjersname noch name gesetzt ist", async () => {
    prisma.mitglieder.findMany.mockResolvedValueOnce([
      { id: 42, upjersname: null, name: null },
    ]);

    const result = await getAllMembers();

    expect(result[0]).toEqual({ id: 42, name: "User #42" });
  });

  it("gibt leeres Array zurück wenn keine aktiven Mitglieder vorhanden sind", async () => {
    prisma.mitglieder.findMany.mockResolvedValueOnce([]);

    const result = await getAllMembers();

    expect(result).toEqual([]);
  });

  it("gibt leeres Array zurück wenn Prisma einen Fehler wirft", async () => {
    prisma.mitglieder.findMany.mockRejectedValueOnce(new Error("DB Error"));

    const result = await getAllMembers();

    expect(result).toEqual([]);
  });
});

// ─── 2. getMemberById ────────────────────────────────────────────────────────

describe("2. getMemberById", () => {
  it("gibt das Mitglied zurück wenn es gefunden wurde", async () => {
    const mockMember = { id: 1, upjersname: "Alice", name: "AliceReal" };
    prisma.mitglieder.findUnique.mockResolvedValueOnce(mockMember);

    const result = await getMemberById(1);

    expect(result).toEqual(mockMember);
  });

  it("konvertiert die id zu Integer", async () => {
    prisma.mitglieder.findUnique.mockResolvedValueOnce(null);

    await getMemberById("7");

    expect(prisma.mitglieder.findUnique).toHaveBeenCalledWith({
      where: { id: 7 },
    });
  });

  it("gibt null zurück wenn Prisma einen Fehler wirft", async () => {
    prisma.mitglieder.findUnique.mockRejectedValueOnce(new Error("DB Error"));

    const result = await getMemberById(1);

    expect(result).toBeNull();
  });

  it("gibt null zurück wenn das Mitglied nicht gefunden wurde", async () => {
    prisma.mitglieder.findUnique.mockResolvedValueOnce(null);

    const result = await getMemberById(99);

    expect(result).toBeNull();
  });
});
