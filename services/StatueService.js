import { prisma } from "../src/lib/prisma";

export async function getAllStatues(locale = "de") {
  return  prisma.wettbewerbstatuen.findMany({
    include: {
      tier: {
        include: {
          texte: {
            where: { spracheCode: locale }
          },
          gehege: true
        }
      }
    },
    orderBy: {
      id: "asc"
    }
  });
}