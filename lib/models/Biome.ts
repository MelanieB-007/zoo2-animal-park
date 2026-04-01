import { gehege } from "@prisma/client";

export class Biome {
  private data: gehege;
  private locale: string;

  constructor(data: gehege, locale: string = "de") {
    this.data = data;
    this.locale = locale;
  }

  get name(): string {
    if (this.locale === "en" && this.data.nameEn) {
      return this.data.nameEn;
    }
    return this.data.name;
  }

  get image(): string {
    return this.data.bild || "/images/gehege/default.png";
  }

  get backgroundColor(): string {
    return this.data.hintergrundfarbe;
  }
}