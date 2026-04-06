import { AnimalFormData, AnimalWithRelations } from "@/interfaces/animal";
import { formatFromDbDate } from "./dateFormatters";
import { xpMap } from "@/constants/xpMap";

export const mapAnimalToForm = (
  animal: AnimalWithRelations
): AnimalFormData => {
  return {
    nameDe: animal.texte.find((t) => t.spracheCode === "de")?.name || "",
    descriptionDe:
      animal.texte.find((t) => t.spracheCode === "de")?.beschreibung || "",
    releaseDate: formatFromDbDate(animal.release || ""),
    price: animal.preis || 0,
    currency: animal.preisartId,
    sellValue: animal.verkaufswert || 0,
    popularity: animal.popularitaet || 0,
    auswildern: animal.auswildern || 0,
    enclosureType: animal.gehegeId,
    breedingLevel: animal.stalllevel || 1,
    breedingCosts: animal.zuchtkosten || 0,
    breedingDuration: animal.zuchtdauer || 0,
    breedingChance: animal.startprozent || 0,
    imagePath: animal.bild || "",

    // Übersetzungen (ohne Deutsch, da das schon oben ist)
    translations: animal.texte
      .filter((t) => t.spracheCode !== "de")
      .map((t) => ({
        spracheCode: t.spracheCode,
        name: t.name,
        description: t.beschreibung || "",
      })),

    // XP-Mapping zurück in das Action-Format des Formulars
    actions: animal.xp.reduce(
      (acc, xp) => {
        const xpart = String(xp.xpart); // Sicherstellen, dass es ein String ist

        // Wir prüfen, ob der Key in der xpMap existiert
        if (Object.prototype.hasOwnProperty.call(xpMap, xpart)) {
          // Hier "casten" wir den Key sicher
          const config = xpMap[xpart as unknown as keyof typeof xpMap];

          const totalMinutes = xp.zeit || 0;
          acc[config.key] = {
            xp: String(xp.wert || 0),
            durationHours: String(Math.floor(totalMinutes / 60)),
            durationMinutes: String(totalMinutes % 60),
          };
        }
        return acc;
      },
      {} as Record<string, any>
    ),

    origins: animal.tierherkunft.map((o) => o.herkunftId),
    enclosureSizes: animal.tier_gehege_kapazitaet.map((size) => ({
      animalCount: size.anzahlTiere,
      size: size.felder,
    })),
  };
};