import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { AnimalGehege, AnimalWithRelations } from "@/interfaces/animal";

/**
 * Filtert die Tiere basierend auf Suche, Gehege und Level.
 */
export function filterAnimals(
  animals: AnimalWithRelations[] | undefined | null,
  {
    searchTerm,
    selectedBiome,
    selectedLevel,
  }: {
    searchTerm: string;
    selectedBiome: string;
    selectedLevel: string;
  }
): AnimalWithRelations[] {
  if (!animals) return [];

  const searchLower = searchTerm.toLowerCase();

  return animals.filter((animal) => {

    // 1. Suche in den übersetzten Texten
    const matchesSearch =
      !searchTerm ||
      animal.texte?.some((t) =>
        t.name?.toLowerCase().includes(searchLower));

    // 2. Filter nach Gehege
    const matchesBiomes =
      selectedBiome === "Alle" || animal.gehege?.name === selectedBiome;

    // 3. Filter nach Level
    const matchesLevel =
      selectedLevel === "Alle" || String(animal.stalllevel) === selectedLevel;

    return matchesSearch && matchesBiomes && matchesLevel;
  });
}

/**
 * Teilt die Liste in Seiten auf (Pagination).
 */
export function paginate<T>(
  items: T[],
  page: number,
  itemsPerPage: number
): T[] {
  const start = (page - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
}

/**
 * Sortiert die Tiere nach einem bestimmten Key und Richtung.
 */
export function sortAnimals(
  items: AnimalWithRelations[],
  { sortBy, sortDirection }: { sortBy: string; sortDirection: "asc" | "desc" }
): AnimalWithRelations[] {
  if (!sortBy) return items;

  return [...items].sort((a, b) => {
    const valA = _getNestedValue(a, sortBy);
    const valB = _getNestedValue(b, sortBy);

    if (typeof valA === "string" && typeof valB === "string") {
      return sortDirection === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    // Fallback für Zahlen-Vergleiche (XP, Level, etc.)
    const numA = Number(valA) || 0;
    const numB = Number(valB) || 0;

    return sortDirection === "asc" ? numA - numB : numB - numA;
  });
}

/**
 * Hilfsfunktion für verschachtelte Objekt-Pfade.
 */
function _getNestedValue(obj: any, path: string): any {
  if (path === "xp") {
    return calculateTotalXP(obj);
  }

  if (path === "verkaufswert") {
    return obj.verkaufswert || 0;
  }

  return path.split(".").reduce((acc, part) =>
    acc && acc[part], obj) || 0;
}

/**
 * Berechnet die Summe der XP-Einträge eines Tieres.
 */
export function calculateTotalXP(animal: any): number {
  if (!animal?.xp || !Array.isArray(animal.xp)) {
    return 0;
  }

  return animal.xp.reduce((acc: number, eintrag: any) =>
  {
    const punkte = Number(eintrag.wert) || 0;
    return acc + punkte;
  }, 0);
}

/**
 * Universelle Lösch-Funktion mit Bestätigungs-Dialog
 */
/**
 * Löscht ein Tier über die API und führt bei Erfolg einen Callback aus.
 * 't' wird von der aufrufenden Komponente übergeben, da Hooks hier nicht erlaubt sind.
 */
export async function deleteAnimal(
  id: number,
  t: any,
  onSuccess: (id: number) => void
): Promise<void> {

  const result = await Swal.fire({
    title: t("animals:messages.deleteErrorTitle"),
    text: t("animals:messages.confirmDelete"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("common:messages.yes_delete"),
    cancelButtonText: t("common:messages.cancel"),
    confirmButtonColor: "var(--color-petrol-darker)",
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`/api/animals/${id}`, { method: "DELETE" });

      if (res.ok) {
        onSuccess(id); // Lokalen State im Client aktualisieren
        toast.success(t("animals:messages.deleteSuccess"));
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(t("animals:messages.deleteError"));
    }
  }
}
/**
 * Extrahiert alle einzigartigen Gehege-Objekte aus einer Liste von Tieren.
 */
export function getUniqueBiomes(animals: AnimalWithRelations[]): AnimalGehege[] {
  return animals
    .map((animal) => animal.gehege)
    .filter((biome, index, self): biome is AnimalGehege =>
      Boolean(biome) && self.findIndex((t) => t?.name === biome?.name) === index
    );
}