import { PrismaClient } from "@prisma/client";

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export async function getAllAnimals() {
  return prisma.tiere.findMany({
    include: {
      texte: true, // Damit die Namen in allen Sprachen mitkommen
      gehege: true,
    },
    orderBy: { id: 'asc' }
  });
}

// Die neue Speicher-Funktion
export async function createAnimal(data) {
  return prisma.tiere.create({
    data: {
      release: data.releaseDate,
      preis: parseInt(data.price) || 0,
      preisartId: data.priceType ? parseInt(data.priceType) : null,
      popularitaet: parseInt(data.popularity) || 0,
      verkaufswert: parseInt(data.sellValue) || 0,
      gehegeId: parseInt(data.gehegeId),

      // Relationen: Dynamische Sprachen
      texte: {
        create: data.names.map(n => ({
          spracheCode: n.languageId,
          name: n.name,
          beschreibung: data.description || ""
        }))
      },

      // Relationen: Gehege-Kapazitäten (falls vorhanden)
      tier_gehege_kapazitaet: {
        create: data.enclosureSizes?.map(size => ({
          anzahl: parseInt(size.animalCount),
          kapazitaet: parseInt(size.size)
        })) || []
      }
    }
  });
}

export async function getAnimalById(id, locale = 'de') {

  const animal = await prisma.tiere.findUnique({
    where: { id: parseInt(id) },
    include: {
      texte: {
        where: { spracheCode: locale },
      },
      variants: { include: { herkunft: true } },
      gehege: true,
      xp: true,
      preisart: true,
      tierherkunft: { include: { herkunft: true } },
      tier_gehege_kapazitaet: { orderBy: { anzahlTiere: "asc" } }
    }
  });

  if (!animal) return null;

  // Mapping: Wir ziehen Name und Beschreibung auf die oberste Ebene
  const translation = animal.texte[0] || {};

  const flatAnimal = {
    ...animal,
    // Wir nehmen den übersetzten Namen, oder den internen als Backup
    name: translation.name || animal.internalName || "Unbekannt",
    beschreibung: translation.beschreibung || null,
  };

  // Wir löschen das originale "texte" Array, damit das Objekt flach bleibt
  delete flatAnimal.texte;

  // Wichtig für Next.js: Dates und komplexe Objekte für JSON serialisieren
  return JSON.parse(JSON.stringify(flatAnimal));
}

export async function deleteAnimalFromDB(id) {
  try {
    // Prisma löscht den Eintrag direkt in der MariaDB
    await prisma.tiere.delete({
      where: {
        id: parseInt(id)
      }
    });
    return true;
  } catch (error) {
    // Fehler abfangen, falls das Tier z.B. schon gelöscht wurde
    console.error("Prisma Delete Error:", error);
    return false;
  }
}

export async function getAllOrigins() {
  return await prisma.origin.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}