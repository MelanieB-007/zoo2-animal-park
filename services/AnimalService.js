import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
export async function getAllAnimals() {
  try {
    const res = await fetch("/api/tiere");

    if (!res.ok) {
      throw new Error("Fehler beim Laden der Tiere");
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("AnimalService.getAllAnimals Fehler:", err);
    return [];
  }
}

export async function getAnimalById(id) {
  try {
    const animal = await prisma.tiere.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        variants: { include: { herkunft: true } },
        gehege: true,
        xp: true,
        preisart: true,
        tierherkunft: { include: { herkunft: true } },
        tier_gehege_kapazitaet: { orderBy: { anzahlTiere: "asc" } }
      }
    });

    if (!animal) return null;

    return JSON.parse(JSON.stringify(animal));
  } catch (error) {
    console.error("Error fetching animal by ID:", error);
    throw error;
  }
}

export async function deleteAnimal(id) {
  try {
    const res = await fetch(`/api/tiere/${id}`, { method: "DELETE" });
    return res.ok;
  } catch (err) {
    console.error("Delete error:", err);
    return false;
  }
}

export function filterAnimals(
  animals,
  { searchTerm, selectedGehege, selectedLevel }
) {
  if (!animals) return [];

  return animals.filter((tier) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      tier.name.toLowerCase().includes(searchLower) ||
      (tier.nameEn && tier.nameEn.toLowerCase().includes(searchLower));

    const matchesGehege =
      selectedGehege === "Alle" || tier.gehege?.name === selectedGehege;

    const matchesLevel =
      selectedLevel === "Alle" || String(tier.stalllevel) === selectedLevel;

    return matchesSearch && matchesGehege && matchesLevel;
  });
}

export function paginate(items, page, itemsPerPage) {
  const start = (page - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
}

export function sortAnimals(items, { sortBy, sortDirection }) {
  if (!sortBy) return items;

  return [...items].sort((a, b) => {
    let valA = _getNestedValue(a, sortBy);
    let valB = _getNestedValue(b, sortBy);

    if (typeof valA === "string") {
      return sortDirection === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return sortDirection === "asc" ? valA - valB : valB - valA;
  });
}

function _getNestedValue(obj, path) {
  if (path === "xp") {
    return calculateTotalXP(obj);
  }

  if (path === "verkaufswert") {
    return obj.verkaufswert || 0;
  }

  return path.split(".").reduce((acc, part) => acc && acc[part], obj) || 0;
}

export function calculateTotalXP (animal) {
  if (!animal?.xp || !Array.isArray(animal.xp)) {
    return 0;
  }

  const total = animal.xp.reduce(function (acc, eintrag) {
    const punkte = Number(eintrag.wert) || 0;
    return acc + punkte;
  }, 0);

  return total;
}