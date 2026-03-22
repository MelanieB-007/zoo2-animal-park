import prisma from "../lib/prisma";

export async function getAllBiomes() {
  try {
    return await prisma.gehege.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error("Fehler im BiomeService:", error);
    return [];
  }
}