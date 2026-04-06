
import { calculateTotalXP } from "@/utils/AnimalHelper";
import { getTranslatedName } from "@/utils/TranslationHelper";
import { Prisma } from "@prisma/client";

// 1. Der mächtige "Datenbank-Typ" (Bleibt dein Standard)
export type AnimalWithRelations = Prisma.tiereGetPayload<{
  include: {
    texte: true;
    gehege: true;
    preisart: true;
    xp: true;
    variants: {
      include: {
        texte: true;
        herkunft: true;
      };
    };
    tierherkunft: {
      include: {
        herkunft: true;
      };
    };
    tier_gehege_kapazitaet: true;
  };
}> & {
  // Diese Felder garantieren wir durch die 'transform'-Funktion
  name: string;
  preis: number;
  stalllevel: number;
  verkaufswert: number;
  auswildern: number;
  bild: string;
  totalXp: number;
};

// 2. Hilfstypen für Unter-Objekte (sehr praktisch für Props!)
// Damit kannst du z.B. sagen: function MyComp({ variant }: { variant: AnimalVariant })
export type AnimalVariant = AnimalWithRelations["variants"][number];
export type AnimalGehege = AnimalWithRelations["gehege"];

/**
 * Diese Funktion macht die "Drecksarbeit".
 * Sie nimmt das rohe Prisma-Objekt und füllt die flachen Felder oben aus.
 */
export function transformAnimal(
  animal: any,
  lang: string
): AnimalWithRelations {
  return {
    ...animal,
    // Felder flachklopfen
    name: getTranslatedName(animal, lang) || "Unbekannt",
    preis: animal.preis || 0,
    stalllevel: animal.stalllevel || 1,
    verkaufswert: animal.verkaufswert || 0,
    auswildern: animal.auswildern || 0,
    bild: animal.bild || "placeholder.png",
    // Berechnete Werte
    totalXp: calculateTotalXP(animal),
  };
}

// 3. Das "Formular-Interface" (Frontend-Eingabe)
export interface AnimalFormData {
  nameDe: string;
  descriptionDe?: string;
  releaseDate?: string;
  price?: string | number;
  currency?: string | number;
  sellValue?: string | number;
  popularity?: string | number;
  auswildern?: string | number;
  enclosureType: string | number; // ID des Geheges
  breedingLevel?: string | number;
  breedingCosts?: string | number;
  breedingDuration?: string | number;
  breedingChance?: string | number;
  imagePath?: string;
  translations?: Array<{
    spracheCode: string;
    name: string;
    description?: string;
  }>;
  actions?: Record<
    string,
    {
      xp: string;
      durationHours: string;
      durationMinutes: string;
    }
  >;
  origins?: Array<{ id: string | number } | number | string>;
  enclosureSizes?: Array<{
    animalCount: string | number;
    size: string | number;
  }>;
}

