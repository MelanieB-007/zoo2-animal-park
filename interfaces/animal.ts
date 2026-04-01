import { Prisma } from "@prisma/client";

// 1. Der "Datenbank-Typ" (Was kommt aus Prisma raus?)
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
    tierherkunft: { include: { herkunft: true } };
    tier_gehege_kapazitaet: true;
  };
}>;

// 2. Das "Formular-Interface" (Was schickt das Frontend?)
export interface AnimalFormData {
  nameDe: string;
  descriptionDe?: string;
  releaseDate?: string;
  price?: string | number;
  currency?: string | number;
  sellValue?: string | number;
  popularity?: string | number;
  auswildern?: string | number;
  enclosureType: string | number;
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
    { xp: string; durationHours: string; durationMinutes: string }
  >;
  origins?: Array<{ id: string | number } | number | string>;
  enclosureSizes?: Array<{
    animalCount: string | number;
    size: string | number;
  }>;
}
