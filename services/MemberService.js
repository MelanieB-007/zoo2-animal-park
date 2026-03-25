import { prisma } from "../lib/prisma";


  export async function getAllMembers() {
    try {
      const members = await prisma.mitglieder.findMany({
        where: {
          aktiv: "ja", // Filtert nach deinem Spalten-Typ @db.VarChar(5)
        },
        select: {
          id: true,
          upjersname: true,
          name: true,
        },
        orderBy: {
          upjersname: "asc",
        },
      });

      // Wir geben ein Array zurück, das "label" und "value" für die SelectBox vorbereitet
      return members.map(m => ({
        id: m.id,
        name: m.upjersname || m.name || `User #${m.id}`
      }));
    } catch (error) {
      console.error("Fehler beim Laden der Mitglieder:", error);
      return [];
    }
  }


  export async function getMemberById(id) {
    try {
      return await prisma.mitglieder.findUnique({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      console.error(`Fehler beim Laden von Mitglied ${id}:`, error);
      return null;
    }
  }
