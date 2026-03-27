/**
 * Unit-Tests für AnimalService
 *
 * Abgedeckt:
 *  1. getAllAnimals      – Locale-Parameter, Mapping, Fallback-Werte
 *  2. createAnimal      – Datumskonvertierung, Daten-Mapping, XP-Typ-Konvertierung
 *  3. updateAnimal      – Transaktion: alte Relationen löschen, dann updaten
 *  4. getAnimalById     – NaN-Guard, null-Return, Locale-Name-Mapping
 *  5. deleteAnimalFromDB – true bei Erfolg, false bei Fehler
 *  6. getAllOrigins      – Weiterleitung an Prisma
 */

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("@prisma/client", () => {
  const instance = {
    tiere:   { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
    herkunft: { findMany: jest.fn() },
    $transaction: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => instance) };
});

import { PrismaClient } from "@prisma/client";
import {
  getAllAnimals,
  createAnimal,
  updateAnimal,
  getAnimalById,
  deleteAnimalFromDB,
  getAllOrigins,
} from "../../services/AnimalService";

// Prisma-Instanz, die der Service intern verwendet (immer dieselbe Mock-Instanz)
const mockPrisma = new PrismaClient();

// Tx-Mock für updateAnimal ($transaction-Callback)
const mockTx = {
  tier_texte:            { deleteMany: jest.fn() },
  xp:                    { deleteMany: jest.fn() },
  tierherkunft:          { deleteMany: jest.fn() },
  tier_gehege_kapazitaet: { deleteMany: jest.fn() },
  tiere:                 { update: jest.fn() },
};

beforeEach(() => {
  jest.clearAllMocks();
  mockPrisma.$transaction.mockImplementation((fn) => fn(mockTx));
});

// ─── 1. getAllAnimals ─────────────────────────────────────────────────────────

describe("1. getAllAnimals", () => {
  function makeAnimal(overrides = {}) {
    return {
      id: 1,
      release: null,
      preis: 100,
      preisartId: 1,
      preisart: { name: "Münzen" },
      verkaufswert: 50,
      popularitaet: 3,
      auswildern: 0,
      bild: "loewe.webp",
      gehegeId: 1,
      gehege: { name: "Savanne" },
      stalllevel: 3,
      xp: [],
      texte: [{ spracheCode: "de", name: "Löwe", beschreibung: "Ein Löwe" }],
      ...overrides,
    };
  }

  it("übergibt den locale-Parameter an die texte-Abfrage", async () => {
    mockPrisma.tiere.findMany.mockResolvedValueOnce([]);

    await getAllAnimals("en");

    expect(mockPrisma.tiere.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          texte: expect.objectContaining({ where: { spracheCode: "en" } }),
        }),
      })
    );
  });

  it("verwendet 'de' als Standard-Locale", async () => {
    mockPrisma.tiere.findMany.mockResolvedValueOnce([]);

    await getAllAnimals();

    expect(mockPrisma.tiere.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          texte: expect.objectContaining({ where: { spracheCode: "de" } }),
        }),
      })
    );
  });

  it("mappt den Namen aus texte[0]", async () => {
    mockPrisma.tiere.findMany.mockResolvedValueOnce([makeAnimal()]);

    const result = await getAllAnimals();

    expect(result[0].name).toBe("Löwe");
  });

  it("nutzt 'Unbekannt' als Namen-Fallback wenn texte leer ist", async () => {
    mockPrisma.tiere.findMany.mockResolvedValueOnce([makeAnimal({ texte: [] })]);

    const result = await getAllAnimals();

    expect(result[0].name).toBe("Unbekannt");
  });

  it("nutzt '/images/placeholder.png' als bild-Fallback", async () => {
    mockPrisma.tiere.findMany.mockResolvedValueOnce([makeAnimal({ bild: null })]);

    const result = await getAllAnimals();

    expect(result[0].bild).toBe("/images/placeholder.png");
  });

  it("nutzt { name: 'Unbekannt' } als gehege-Fallback", async () => {
    mockPrisma.tiere.findMany.mockResolvedValueOnce([makeAnimal({ gehege: null })]);

    const result = await getAllAnimals();

    expect(result[0].gehege).toEqual({ name: "Unbekannt" });
  });

  it("nutzt 1 als stalllevel-Fallback wenn stalllevel null ist", async () => {
    mockPrisma.tiere.findMany.mockResolvedValueOnce([makeAnimal({ stalllevel: null })]);

    const result = await getAllAnimals();

    expect(result[0].stalllevel).toBe(1);
  });

  it("gibt leeres Array zurück wenn keine Tiere vorhanden sind", async () => {
    mockPrisma.tiere.findMany.mockResolvedValueOnce([]);

    const result = await getAllAnimals();

    expect(result).toEqual([]);
  });
});

// ─── 2. createAnimal ─────────────────────────────────────────────────────────

describe("2. createAnimal", () => {
  function baseData(overrides = {}) {
    return {
      releaseDate: "2026-03-22",
      price: "100",
      currency: "1",
      sellValue: "50",
      popularity: "3",
      auswildern: "0",
      enclosureType: "1",
      breedingLevel: "2",
      breedingCosts: "10",
      breedingDuration: "60",
      breedingChance: "50",
      imagePath: "loewe.webp",
      nameDe: "Löwe",
      descriptionDe: "Ein Löwe",
      translations: [],
      actions: {},
      origins: [],
      enclosureSizes: [],
      ...overrides,
    };
  }

  it("konvertiert das Datum von YYYY-MM-DD zu DD.MM.YYYY", async () => {
    mockPrisma.tiere.create.mockResolvedValueOnce({ id: 1 });

    await createAnimal(baseData({ releaseDate: "2026-03-22" }));

    expect(mockPrisma.tiere.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ release: "22.03.2026" }),
      })
    );
  });

  it("lässt release null wenn kein Datum angegeben wird", async () => {
    mockPrisma.tiere.create.mockResolvedValueOnce({ id: 1 });

    await createAnimal(baseData({ releaseDate: "" }));

    expect(mockPrisma.tiere.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ release: null }),
      })
    );
  });

  it("konvertiert XP-Aktionstypen: feed→'0', play→'1', clean→'2'", async () => {
    mockPrisma.tiere.create.mockResolvedValueOnce({ id: 1 });

    await createAnimal(baseData({
      actions: {
        feed:  { xp: "10", durationHours: "1", durationMinutes: "0" },
        play:  { xp: "5",  durationHours: "0", durationMinutes: "30" },
        clean: { xp: "8",  durationHours: "2", durationMinutes: "15" },
      },
    }));

    const { data } = mockPrisma.tiere.create.mock.calls[0][0];
    expect(data.xp.create).toContainEqual({ xpart: "0", wert: 10, zeit: 60 });
    expect(data.xp.create).toContainEqual({ xpart: "1", wert: 5,  zeit: 30 });
    expect(data.xp.create).toContainEqual({ xpart: "2", wert: 8,  zeit: 135 });
  });

  it("berechnet zeit korrekt aus Stunden + Minuten", async () => {
    mockPrisma.tiere.create.mockResolvedValueOnce({ id: 1 });

    await createAnimal(baseData({
      actions: { feed: { xp: "10", durationHours: "2", durationMinutes: "30" } },
    }));

    const { data } = mockPrisma.tiere.create.mock.calls[0][0];
    expect(data.xp.create[0].zeit).toBe(150); // 2×60 + 30
  });

  it("erstellt Translations-Einträge korrekt", async () => {
    mockPrisma.tiere.create.mockResolvedValueOnce({ id: 1 });

    await createAnimal(baseData({
      translations: [{ spracheCode: "en", name: "Lion", description: "A lion" }],
    }));

    const { data } = mockPrisma.tiere.create.mock.calls[0][0];
    expect(data.texte.create).toContainEqual({
      spracheCode: "en",
      name: "Lion",
      beschreibung: "A lion",
    });
  });

  it("gibt das erstellte Tier zurück", async () => {
    const newAnimal = { id: 42 };
    mockPrisma.tiere.create.mockResolvedValueOnce(newAnimal);

    const result = await createAnimal(baseData());

    expect(result).toEqual(newAnimal);
  });
});

// ─── 3. updateAnimal ─────────────────────────────────────────────────────────

describe("3. updateAnimal", () => {
  function baseUpdateData(overrides = {}) {
    return {
      releaseDate: "2026-03-22",
      price: "200",
      priceType: "Münzen",
      sellValue: "80",
      popularity: "4",
      enclosureType: "2",
      breedingLevel: "3",
      breedingCosts: "20",
      breedingDuration: "120",
      breedingChance: "60",
      imagePath: "tiger.webp",
      nameDe: "Tiger",
      descriptionDe: "Ein Tiger",
      translations: [],
      actions: {},
      origins: [],
      enclosureSizes: [],
      ...overrides,
    };
  }

  it("löscht alte Relationen vor dem Update", async () => {
    mockTx.tiere.update.mockResolvedValueOnce({ id: 1 });

    await updateAnimal("1", baseUpdateData());

    expect(mockTx.tier_texte.deleteMany).toHaveBeenCalledWith({ where: { tierId: 1 } });
    expect(mockTx.xp.deleteMany).toHaveBeenCalledWith({ where: { tierId: 1 } });
    expect(mockTx.tierherkunft.deleteMany).toHaveBeenCalledWith({ where: { tierid: 1 } });
    expect(mockTx.tier_gehege_kapazitaet.deleteMany).toHaveBeenCalledWith({ where: { tierId: 1 } });
  });

  it("aktualisiert das Tier mit korrekter ID", async () => {
    mockTx.tiere.update.mockResolvedValueOnce({ id: 5 });

    await updateAnimal("5", baseUpdateData());

    expect(mockTx.tiere.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 5 } })
    );
  });

  it("setzt preisartId auf 2 für Diamanten, sonst 1", async () => {
    mockTx.tiere.update.mockResolvedValueOnce({ id: 1 });

    await updateAnimal("1", baseUpdateData({ priceType: "Diamanten" }));

    expect(mockTx.tiere.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ preisartId: 2 }),
      })
    );
  });

  it("gibt das aktualisierte Tier zurück", async () => {
    const updated = { id: 1, name: "Tiger" };
    mockTx.tiere.update.mockResolvedValueOnce(updated);

    const result = await updateAnimal("1", baseUpdateData());

    expect(result).toEqual(updated);
  });
});

// ─── 4. getAnimalById ────────────────────────────────────────────────────────

describe("4. getAnimalById", () => {
  it("gibt null zurück wenn die id keine Zahl ist", async () => {
    const result = await getAnimalById("abc");

    expect(result).toBeNull();
    expect(mockPrisma.tiere.findUnique).not.toHaveBeenCalled();
  });

  it("gibt null zurück wenn das Tier nicht gefunden wurde", async () => {
    mockPrisma.tiere.findUnique.mockResolvedValueOnce(null);

    const result = await getAnimalById(99);

    expect(result).toBeNull();
  });

  it("setzt animal.name aus der passenden Locale-Übersetzung", async () => {
    mockPrisma.tiere.findUnique.mockResolvedValueOnce({
      id: 1,
      texte: [
        { spracheCode: "de", name: "Löwe",  beschreibung: "Ein Löwe" },
        { spracheCode: "en", name: "Lion",  beschreibung: "A lion"  },
      ],
    });

    const result = await getAnimalById(1, "en");

    expect(result.name).toBe("Lion");
  });

  it("nutzt texte[0] als Fallback wenn keine Locale-Übersetzung gefunden wird", async () => {
    mockPrisma.tiere.findUnique.mockResolvedValueOnce({
      id: 1,
      texte: [{ spracheCode: "de", name: "Löwe", beschreibung: null }],
    });

    const result = await getAnimalById(1, "en");

    expect(result.name).toBe("Löwe");
  });

  it("gibt das Tier ohne name-Mapping zurück wenn kein locale übergeben wird", async () => {
    mockPrisma.tiere.findUnique.mockResolvedValueOnce({
      id: 1,
      texte: [{ spracheCode: "de", name: "Löwe" }],
    });

    const result = await getAnimalById(1);

    expect(result.id).toBe(1);
    // Kein locale → kein name-Mapping
    expect(result.name).toBeUndefined();
  });

  it("konvertiert die id zu Integer", async () => {
    mockPrisma.tiere.findUnique.mockResolvedValueOnce({ id: 1, texte: [] });

    await getAnimalById("1");

    expect(mockPrisma.tiere.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } })
    );
  });
});

// ─── 5. deleteAnimalFromDB ───────────────────────────────────────────────────

describe("5. deleteAnimalFromDB", () => {
  it("gibt true zurück wenn Löschen erfolgreich war", async () => {
    mockPrisma.tiere.delete.mockResolvedValueOnce({ id: 1 });

    const result = await deleteAnimalFromDB(1);

    expect(result).toBe(true);
    expect(mockPrisma.tiere.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("gibt false zurück wenn Prisma einen Fehler wirft", async () => {
    mockPrisma.tiere.delete.mockRejectedValueOnce(new Error("Constraint Error"));

    const result = await deleteAnimalFromDB(1);

    expect(result).toBe(false);
  });
});

// ─── 6. getAllOrigins ────────────────────────────────────────────────────────

describe("6. getAllOrigins", () => {
  it("ruft herkunft.findMany auf", async () => {
    mockPrisma.herkunft.findMany.mockResolvedValueOnce([]);

    await getAllOrigins();

    expect(mockPrisma.herkunft.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { name: "asc" } })
    );
  });

  it("gibt die Herkunftsliste zurück", async () => {
    const origins = [{ id: 1, name: "Wild" }, { id: 2, name: "Zucht" }];
    mockPrisma.herkunft.findMany.mockResolvedValueOnce(origins);

    const result = await getAllOrigins();

    expect(result).toEqual(origins);
  });
});
