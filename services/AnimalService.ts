import { PrismaClient } from "@prisma/client";
import { formatToDbDate } from "../utils/formatters";
import { getXpIdByKey } from "../constants/xpMap";
import { AnimalFormData, AnimalWithRelations } from "../interfaces/animal";

// Prisma Client Singleton für Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


// --- API FUNKTIONEN ---

export async function getAllAnimals(): Promise<AnimalWithRelations[]> {
  const animals = await prisma.tiere.findMany({
    include: {
      texte: true,
      gehege: true,
      preisart: true,
      xp: true,
      variants: {
        include: {
          texte: true,
          herkunft: true,
        },
      },
      tierherkunft: { include: { herkunft: true } },
      tier_gehege_kapazitaet: { orderBy: { anzahlTiere: "asc" } },
    },
    orderBy: { id: "asc" },
  });

  return animals as AnimalWithRelations[];
}

export async function getAnimalById(
  id: string | number
): Promise<AnimalWithRelations | null> {
  const numericId = typeof id === "string" ? parseInt(id) : id;
  if (isNaN(numericId)) return null;

  const animal = await prisma.tiere.findUnique({
    where: { id: numericId },
    include: {
      texte: true,
      gehege: true,
      preisart: true,
      xp: true,
      variants: { include: { texte: true, herkunft: true } },
      tierherkunft: { include: { herkunft: true } },
      tier_gehege_kapazitaet: { orderBy: { anzahlTiere: "asc" } },
    },
  });

  if (!animal) return null;
  return JSON.parse(JSON.stringify(animal)) as AnimalWithRelations;
}

export async function createAnimal(
  data: AnimalFormData
): Promise<AnimalWithRelations> {
  return (await prisma.tiere.create({
    data: {
      release: formatToDbDate(data.releaseDate),
      preis: Number(data.price) || 0,
      preisartId: Number(data.currency) || 1,
      verkaufswert: Number(data.sellValue) || 0,
      popularitaet: Number(data.popularity) || 0,
      auswildern: Number(data.auswildern) || 0,
      gehegeId: Number(data.enclosureType) || 1,
      stalllevel: Number(data.breedingLevel) || 1,
      zuchtkosten: Number(data.breedingCosts) || 0,
      zuchtdauer: Number(data.breedingDuration) || 0,
      startprozent: Number(data.breedingChance) || 0,
      bild: data.imagePath || "placeholder.png",

      texte: {
        create: [
          {
            spracheCode: "de",
            name: data.nameDe || "Unbenannt",
            beschreibung: data.descriptionDe || "",
          },
          ...(data.translations || []).map((t) => ({
            spracheCode: t.spracheCode,
            name: t.name || "Unbenannt",
            beschreibung: t.description || "",
          })),
        ],
      },
      xp: {
        create: Object.entries(data.actions || {}).map(([key, action]) => ({
          xpart: getXpIdByKey(key), // Nutzt jetzt die zentrale Map
          wert: Number(action.xp) || 0,
          zeit:
            (Number(action.durationHours) || 0) * 60 +
            (Number(action.durationMinutes) || 0),
        })),
      },
      tierherkunft: {
        create: (data.origins || []).map((o: any) => ({
          herkunftId: Number(o.id || o),
        })),
      },
      tier_gehege_kapazitaet: {
        create: (data.enclosureSizes || []).map((size) => ({
          anzahlTiere: Number(size.animalCount) || 1,
          felder: Number(size.size) || 1,
        })),
      },
    },
    include: {
      texte: true,
      gehege: true,
      preisart: true,
      xp: true,
      variants: { include: { texte: true, herkunft: true } },
      tierherkunft: { include: { herkunft: true } },
      tier_gehege_kapazitaet: true,
    },
  })) as AnimalWithRelations;
}

export async function updateAnimal(
  id: string | number,
  data: AnimalFormData
): Promise<AnimalWithRelations> {
  const numericId = typeof id === "string" ? parseInt(id) : id;

  return await prisma.$transaction(async (tx) => {
    // Relationen bereinigen
    await tx.tier_texte.deleteMany({ where: { tierId: numericId } });
    await tx.xp.deleteMany({ where: { tierId: numericId } });
    await tx.tierherkunft.deleteMany({ where: { tierid: numericId } });
    await tx.tier_gehege_kapazitaet.deleteMany({
      where: { tierId: numericId },
    });

    return (await tx.tiere.update({
      where: { id: numericId },
      data: {
        release: formatToDbDate(data.releaseDate),
        preis: Number(data.price) || 0,
        preisartId: Number(data.currency) || 1,
        verkaufswert: Number(data.sellValue) || 0,
        popularitaet: Number(data.popularity) || 0,
        auswildern: Number(data.auswildern) || 0,
        gehegeId: Number(data.enclosureType) || 1,
        stalllevel: Number(data.breedingLevel) || 1,
        zuchtkosten: Number(data.breedingCosts) || 0,
        zuchtdauer: Number(data.breedingDuration) || 0,
        startprozent: Number(data.breedingChance) || 0,
        bild: data.imagePath || "placeholder.png",

        texte: {
          create: [
            {
              spracheCode: "de",
              name: data.nameDe,
              beschreibung: data.descriptionDe || "",
            },
            ...(data.translations || []).map((t) => ({
              spracheCode: t.spracheCode,
              name: t.name,
              beschreibung: t.description || "",
            })),
          ],
        },

        xp: {
          create: Object.entries(data.actions || {}).map(([key, action]) => ({
            xpart: getXpIdByKey(key), // Nutzt jetzt die zentrale Map
            wert: Number(action.xp) || 0,
            zeit:
              (Number(action.durationHours) || 0) * 60 +
              (Number(action.durationMinutes) || 0),
          })),
        },
        tierherkunft: {
          create: (data.origins || []).map((o: any) => ({
            herkunftId: Number(o.id || o),
          })),
        },
        tier_gehege_kapazitaet: {
          create: (data.enclosureSizes || []).map((size) => ({
            anzahlTiere: Number(size.animalCount) || 1,
            felder: Number(size.size) || 1,
          })),
        },
      },
      include: {
        texte: true,
        gehege: true,
        xp: true,
        preisart: true,
        variants: { include: { texte: true, herkunft: true } },
        tierherkunft: { include: { herkunft: true } },
        tier_gehege_kapazitaet: { orderBy: { anzahlTiere: "asc" } },
      },
    })) as AnimalWithRelations;
  });
}

export async function deleteAnimal(
  id: string | number
): Promise<boolean> {
  try {
    await prisma.tiere.delete({ where: { id: Number(id) } });
    return true;
  } catch (error) {
    console.error("Prisma Delete Error:", error);
    return false;
  }
}

export async function getAllOrigins() {
  return prisma.herkunft.findMany({ orderBy: { name: "asc" } });
}

export async function getAllVariants() {
  return prisma.farbvarianten.findMany({
    include: { herkunft: true, texte: true },
  });
}