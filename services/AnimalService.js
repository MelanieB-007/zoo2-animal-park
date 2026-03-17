import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAnimalById(id) {
  try {
    return await prisma.tiere.findUnique({
      where: { id: parseInt(id) },
      include: {
        variants: { include: { herkunft: true } },
        gehege: true,
        xp: true,
        preisart: true,
        tierherkunft: { include: { herkunft: true } },
        tier_gehege_kapazitaet: { orderBy: { anzahlTiere: "asc" } }
      }
    });
  } catch (error) {
    console.error("Fehler beim Abrufen des Tieres:", error);
    return null;
  }
}

export function filterAnimals(tiere, { searchTerm, selectedGehege, selectedLevel }) {
  if (!tiere) return [];

  return tiere.filter((tier) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      tier.name.toLowerCase().includes(searchLower) ||
      (tier.nameEn && tier.nameEn.toLowerCase().includes(searchLower));

    const matchesGehege =
      selectedGehege === "Alle" ||
      tier.gehege?.name === selectedGehege;

    const matchesLevel =
      selectedLevel === "Alle" ||
      String(tier.stalllevel) === selectedLevel;

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

function _getNestedValue(obj, path){
  if (path === "xp") {
    return calculateTotalXP(obj);
  }

  if (path === "verkaufswert") {
    return obj.verkaufswert || 0;
  }

  return path.split(".").reduce((acc, part) =>
    acc && acc[part], obj) || 0;
}

export const calculateTotalXP = (tier) => {
  return (tier.xpfuettern || 0) + (tier.xpspielen || 0) + (tier.xpputzen || 0);
};