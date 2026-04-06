import prisma from "../src/lib/prisma";

export async function getAllLanguages() {
  try {
    return await prisma.sprachen.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error("Fehler im CommonService:", error);
    return [];
  }
}