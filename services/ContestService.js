// services/contestService.js
import { prisma } from "../lib/prisma";

export const contestService = {
  async createContest({ start, ende, aktiv, statuenIds }) {
    return prisma.$transaction(async (tx) => {
      // 1. Wettbewerb anlegen
      const newContest = await tx.wettbewerbe.create({
        data: {
          start: new Date(start),
          ende: new Date(ende),
          aktiv: parseInt(aktiv),
        },
      });

      // 2. Verknüpfungen erstellen
      const statueLinks = statuenIds.map((id) => ({
        wettbewerbId: newContest.id,
        statueId: parseInt(id),
      }));

      await tx.contest_statuen.createMany({
        data: statueLinks,
      });

      return newContest;
    });
  },

  async getAllContests() {
    const contests = await prisma.wettbewerbe.findMany({
      include: {
        statuen: {
          include: {
            statue: {
              include: {
                tier: {
                  include: { gehege: true, texte: true }
                }
              }
            }
          }
        }
      }
    });

    const now = new Date();

    // Manuelle Sortierung, da Prisma "isAktiv" nicht direkt in der DB kennt
    return contests.sort((a, b) => {
      const aAktiv = now >= new Date(a.start) && now <= new Date(a.ende);
      const bAktiv = now >= new Date(b.start) && now <= new Date(b.ende);

      // 1. Wenn einer aktiv ist und der andere nicht, kommt der aktive nach oben
      if (aAktiv && !bAktiv) return -1;
      if (!aAktiv && bAktiv) return 1;

      // 2. Wenn beide gleich aktiv/inaktiv sind, sortiere nach Startdatum (neueste zuerst)
      return new Date(b.start) - new Date(a.start);
    });
  }
};