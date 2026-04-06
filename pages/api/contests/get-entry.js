import { prisma } from "../../../src/lib/prisma";

export default async function handler(req, res) {
  const { contestId, memberId } = req.query;

  if (req.method !== "GET") return res.status(405).end();

  try {
    const results = await prisma.wettbewerb_ergebnisse.findMany({
      where: {
        contest_id: parseInt(contestId),
        member_id: parseInt(memberId),
      },
    });

    // Umwandeln der flachen DB-Liste in dein State-Format { tierId: [{level, count}, ...] }
    const formattedData = results.reduce((acc, row) => {
      if (!acc[row.tier_id]) acc[row.tier_id] = [];
      acc[row.tier_id].push({
        id: row.id, // Die echte DB-ID statt Math.random()
        level: row.level,
        count: row.anzahl,
      });
      return acc;
    }, {});

    return res.status(200).json({ data: formattedData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
