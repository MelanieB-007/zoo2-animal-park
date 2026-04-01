import { PrismaVariant } from "../types/prisma";


export class Variant {
  private data: PrismaVariant;
  private locale: string;

  constructor(data: PrismaVariant, locale: string = "de") {
    this.data = data;
    this.locale = locale;
  }

  get name(): string {
    // Suche den Namen in der richtigen Sprache
    const localized = this.data.texte?.find(
      (t) => t.spracheCode === this.locale
    );

    // Fallback: Wenn kein Text für das Locale da ist, nimm den ersten oder "Unbekannt"
    return localized?.name || this.data.texte?.[0]?.name || "Standard";
  }

  get origin(): string[] {
    // 1. Wir prüfen auf 'herkunft', da so das Feld im Model 'farbvarianten' heißt
    if (this.data.herkunft) {
      // 2. Achtung: In deinem Schema heißt das Feld 'nameen' (kleines e)
      const name =
        this.locale === "en"
          ? this.data.herkunft.nameen
          : this.data.herkunft.name;

      return [name || "Unbekannt"];
    }

    // Fallback: Die ID als String in einem Array
    return [String(this.data.herkunftId)];
  }

  get image(): string {
    return this.data.bild || "/images/variants/default.png";
  }
}