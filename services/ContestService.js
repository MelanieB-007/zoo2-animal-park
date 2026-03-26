import { prisma } from "../lib/prisma";

export async function createContest({ start, ende, aktiv, statuenIds }) {
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
}

export async function getAllContests() {
  const contests = await prisma.wettbewerbe.findMany({
    include: {
      statuen: {
        include: {
          statue: {
            include: {
              tier: {
                include: { gehege: true, texte: true },
              },
            },
          },
        },
      },
    },
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

export async function getContestById(id) {
  try {
    const contest = await prisma.wettbewerbe.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        statuen: {
          include: {
            statue: {
              include: {
                tier: {
                  include: {
                    texte: true,
                    gehege: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!contest) {
      console.warn(`Wettbewerb mit ID ${id} nicht gefunden.`);
      return null;
    }

    return contest;
  } catch (error) {
    console.error(`Fehler in getContestById für ID ${id}:`, error);
    throw error;
  }
}

export async function saveContestResults(contestId, memberId, data) {
  const recordsToCreate = [];

  Object.keys(data).forEach((tierId) => {
    const rows = data[tierId];
    rows.forEach((row) => {
      if (row.level || row.count) {
        recordsToCreate.push({
          contest_id: parseInt(contestId),
          member_id: parseInt(memberId),
          tier_id: parseInt(tierId),
          level: parseInt(row.level) || 0,
          anzahl: parseInt(row.count) || 0,
        });
      }
    });
  });

  if (recordsToCreate.length === 0) {
    throw new Error("No valid data to save");
  }

  // Datenbank-Operation
  return prisma.wettbewerb_ergebnisse.createMany({
    data: recordsToCreate,
  });
}

export async function getResultsByContestId(contestId) {
  return prisma.wettbewerb_ergebnisse.findMany({
    where: { contest_id: parseInt(contestId) },
    include: {
      mitglied: {
        select: {
          upjersname: true,
          name: true,
          id: true
        }
      }
    }
  });
}