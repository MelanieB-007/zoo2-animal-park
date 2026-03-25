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
    return prisma.wettbewerbe.findMany({
      orderBy: { start: 'desc' }, // Neueste zuerst
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
  }
};