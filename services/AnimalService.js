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
  // Hilfsfunktion: Wandelt '2026-03-22' (Browser) in '22.03.2026' (DB) um
  const formatToDbDate = (dateStr) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr || null;
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
  };

  // Mapping für xpart (DB erwartet oft Zahlen-Strings '0', '1', '2')
  const xpTypeToId = { feed: "0", play: "1", clean: "2" };

  return prisma.tiere.create({
    data: {
      // 1. Basis-Daten
      release: formatToDbDate(data.releaseDate), // Konvertiertes Datum
      preis: parseInt(data.price) || 0,
      preisartId: parseInt(data.currency) || 1, // Nutzt die ID aus dem Währungs-Select
      verkaufswert: parseInt(data.sellValue) || 0,
      popularitaet: parseInt(data.popularity) || 0,

      // FIX: Hier stand vorher data.release, was beim Anlegen undefined war
      auswildern: parseInt(data.auswildern) || 0,

      gehegeId: parseInt(data.enclosureType) || 1,
      stalllevel: parseInt(data.breedingLevel) || 1,
      zuchtkosten: parseInt(data.breedingCosts) || 0,
      zuchtdauer: parseInt(data.breedingDuration) || 0,
      startprozent: parseInt(data.breedingChance) || 0,
      bild: data.imagePath || "placeholder.png",

      // 2. Texte (Deutsch + Übersetzungen)
      texte: {
        create: [
          {
            spracheCode: "de",
            name: data.nameDe || "Unbenannt",
            beschreibung: data.descriptionDe || ""
          },
          ...(data.translations || []).map(t => ({
            spracheCode: t.spracheCode,
            name: t.name || "Unbenannt",
            beschreibung: t.description || ""
          }))
        ]
      },

      // 3. XP / Aktionen (mit Umrechnung in Minuten)
      xp: {
        create: Object.entries(data.actions || {}).map(([key, action]) => ({
          xpart: xpTypeToId[key] || key, // Wandelt 'feed' in '0' um
          wert: parseInt(action.xp) || 0,
          zeit: (parseInt(action.durationHours) || 0) * 60 + (parseInt(action.durationMinutes) || 0)
        }))
      },

      // 4. Herkunft (m:n)
      tierherkunft: {
        create: (data.origins || []).map(o => ({
          herkunftId: parseInt(o.id || o)
        }))
      },

      // 5. Kapazitäten
      tier_gehege_kapazitaet: {
        create: (data.enclosureSizes || []).map(size => ({
          anzahlTiere: parseInt(size.animalCount) || 1,
          felder: parseInt(size.size) || 1
        }))
      }
    }
  });
}

export async function updateAnimal(id, data) {
  // Prisma $transaction stellt sicher: Alles klappt oder gar nichts
  return prisma.$transaction(async (tx) => {

    // 1. Zuerst alle alten Relationen entfernen
    // 1. Zuerst alle alten Relationen entfernen
    // ACHTUNG: Hier überall prüfen, ob es 'tierid' (klein) heißen muss!
    await tx.tier_texte.deleteMany({ where: { tierId: parseInt(id) } });
    await tx.xp.deleteMany({ where: { tierId: parseInt(id) } });

    // HIER war der Fehler: tierId -> tierid
    await tx.tierherkunft.deleteMany({ where: { tierid: parseInt(id) } });

    await tx.tier_gehege_kapazitaet.deleteMany({ where: { tierId: parseInt(id) } });

    // 2. Das Haupt-Tier-Objekt aktualisieren
    return await tx.tiere.update({
      where: { id: parseInt(id) },
      data: {
        // ... deine restlichen Felder ...

        // Beim Erstellen der neuen Relationen auch auf die Feldnamen achten!
        tierherkunft: {
          create: (data.origins || []).map(oId => ({
            // Hier auch prüfen: Heißt das Feld in der DB 'herkunftId' oder 'herkunftid'?
            herkunftId: parseInt(oId.id || oId)
          }))
        },
        // ...
      }
    });
  });
}

export async function getAnimalById(id, locale = null) {

  const animal = await prisma.tiere.findUnique({
    where: { id: parseInt(id) },
    include: {
      texte: locale ?
        { where: { spracheCode: locale } } :
        true,
      variants: { include: { herkunft: true } },
      gehege: true,
      xp: true,
      preisart: true,
      tierherkunft: { include: { herkunft: true } },
      tier_gehege_kapazitaet: { orderBy: { anzahlTiere: "asc" } }
    }
  });

  if (!animal) return null;

  if (locale) {
    const translation = animal.texte?.[0] || {};
    animal.name = translation.name || "Unbekannt";
    animal.beschreibung = translation.beschreibung || null;
  }

  // Wichtig für Next.js: Dates und komplexe Objekte für JSON serialisieren
  return JSON.parse(JSON.stringify(animal));
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