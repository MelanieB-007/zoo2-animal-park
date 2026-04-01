import { Biome } from "./Biome";
import { Variant } from "./Variant";
import { PrismaAnimal, PrismaVariant } from "../types/prisma";


export class Animal {
  private data: PrismaAnimal;
  private locale: string;
  public biome: Biome | null = null;
  public varianten: Variant[] = [];

  constructor(data: PrismaAnimal, locale: string = "de") {
    this.data = data;
    this.locale = locale;

    if (data.gehege) {
      this.biome = new Biome(data.gehege, locale);
    }

    if (data.farbvarianten) {
      this.varianten = data.farbvarianten.map(
        (v:PrismaVariant) => new Variant(v, locale)
      );
    }
  }

  get name(): string {
    const localized = this.data.texte?.find(
      (t) => t.spracheCode === this.locale
    );
    return localized?.name || this.data.texte?.[0]?.name || "Unbekanntes Tier";
  }

  get image(): string {
    return this.data.bild || "/images/placeholder.png";
  }

  get biomeName(): string {
    return this.biome ? this.biome.name : "Kein Gehege";
  }

  get variantenNames(): string[] {
    return this.varianten.map((v) => v.name);
  }

  // Beispiel für eine Logik-Methode
  get formatierterPreis(): string {
    if (!this.data.preis) return "Kostenlos";
    return `${this.data.preis.toLocaleString()} Coins`;
  }
}