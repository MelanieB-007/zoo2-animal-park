import { PrismaClient } from "@prisma/client";

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export async function getAllAnimals(locale = 'de') {
  const animals = await prisma.tiere.findMany({
    include: {
      texte: {
        where: { spracheCode: locale },
      },
      gehege: true,
      preisart: true,
      xp: true,
    },
    orderBy: { id: 'asc' }
  });

  return animals.map(animal => {
    const translation = animal.texte?.[0] || {};
    return {
      id: animal.id,
      release: animal.release,
      preis: animal.preis,
      preisartId: animal.preisartId,
      // WICHTIG: Die Relation muss mit ins Return-Objekt!
      preisart: animal.preisart,
      verkaufswert: animal.verkaufswert,
      popularitaet: animal.popularitaet,
      auswildern: animal.auswildern,
      bild: animal.bild || "/images/tiere/placeholder.png", // Fallback für das Tierbild
      gehegeId: animal.gehegeId,
      // WICHTIG: Das Gehege-Objekt für das GehegeBadge
      gehege: animal.gehege || { name: "Unbekannt" },
      stalllevel: animal.stalllevel || 1,
      xp: animal.xp || [],
      name: translation.name || "Unbekannt",
      beschreibung: translation.beschreibung || null,
    };
  });
}


export async function createAnimal(data) {
  return prisma.tiere.create({
    data: {
      release: data.releaseDate || null,
      preis: parseInt(data.price) || 0,
      // Mapping deiner Preisart (Check, ob Diamonds 1 oder 2 ist)
      preisartId: data.priceType === "Diamanten" ? 2 : 1,
      verkaufswert: parseInt(data.sellValue) || 0,
      popularitaet: parseInt(data.popularity) || 0,
      auswildern: parseInt(data.release) || 0,
      gehegeId: parseInt(data.enclosureType) || 1,
      stalllevel: parseInt(data.breedingLevel) || 1,
      zuchtkosten: parseInt(data.breedingCosts) || 0,
      zuchtdauer: parseInt(data.breedingDuration) || "0",
      startprozent: parseInt(data.breedingChance) || 0,

      // Das Bild-Feld (falls es 'bild' in deiner DB heißt)
      bild: data.imagePath || "placeholder.png",

      // 1. TEXTE & BESCHREIBUNG
      texte: {
        create: [
          {
            spracheCode: "de",
            name: data.nameDe || "Unbenanntes Tier",
            // Hier greifen wir auf die Beschreibung aus dem Formular zu
            beschreibung: data.description || data.descriptionDe || ""
          },
          ...(data.translations || []).map(t => ({
            spracheCode: t.spracheCode,
            name: t.name || "Unbenannt",
            beschreibung: t.description || ""
          }))
        ]
      },

      // 2. XP (Aktionen: Füttern, Spielen, Putzen)
      // Wir mappen das 'actions' Objekt aus deinem Frontend in die XP-Tabelle
      xp: {
        create: Object.entries(data.actions || {}).map(([key, action]) => {
          // Wir holen beide Werte aus dem action-Objekt
          const h = parseInt(action.durationHours) || 0;
          const m = parseInt(action.durationMinutes) || 0;

          // Umrechnung in die Gesamtzahl der Minuten für das DB-Feld 'zeit'
          const gesamtMinuten = (h * 60) + m;

          return {
            xpart: key,            // 'feed', 'play' oder 'clean'
            wert: parseInt(action.xp) || 0,
            zeit: gesamtMinuten    // Das berechnete Ergebnis
          };
        })
      },

      // 3. HERKUNFT (m:n Verknüpfung)
      // Wir verbinden das Tier mit den IDs der gewählten Herkunftsorte
      tierherkunft: {
        create: (data.origins || []).map(id => ({
          // Hier musst du prüfen, wie das Feld in der Tabelle 'tierherkunft' heißt.
          // Meistens ist es 'herkunftId'
          herkunftId: parseInt(id.id || id)
        }))
      },

      tier_gehege_kapazitaet: {
        create: (data.enclosureSizes || []).map(size => ({
          anzahlTiere: parseInt(size.animalCount) || 1,
          felder: parseInt(size.size) || 1
        }))
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
  return await prisma.herkunft.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}