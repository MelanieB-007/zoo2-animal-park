import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { contestId, memberId, data } = req.body;

  if (!contestId || !memberId || !data) {
    return res
      .status(400)
      .json({ message: "Fehlende Daten (Contest, Member oder Entries)" });
  }

  try {
    // Wir nutzen eine Transaktion, damit entweder alles oder nichts gespeichert wird
    await prisma.$transaction(async (tx) => {
      // 1. Alle alten Einträge dieses Mitglieds für DIESEN Wettbewerb löschen
      await tx.wettbewerb_ergebnisse.deleteMany({
        where: {
          contest_id: parseInt(contestId),
          member_id: parseInt(memberId),
        },
      });

      // 2. Daten für die DB vorbereiten
      // Wir müssen das verschachtelte Objekt { tierId: [rows] } flachklopfen
      const insertData = [];

      Object.entries(data).forEach(([tierId, rows]) => {
        rows.forEach((row) => {
          // Nur speichern, wenn Level und Anzahl ausgefüllt sind
          if (row.level !== "" && row.count !== "") {
            insertData.push({
              contest_id: parseInt(contestId),
              member_id: parseInt(memberId),
              tier_id: parseInt(tierId),
              level: parseInt(row.level),
              anzahl: parseInt(row.count),
              zeitpunkt: new Date(), // Optional, falls du den Zeitstempel trackst
            });
          }
        });
      });

      // 3. Wenn Daten vorhanden sind, alle auf einmal einfügen
      if (insertData.length > 0) {
        await tx.wettbewerb_ergebnisse.createMany({
          data: insertData,
        });
      }
    });

    return res
      .status(200)
      .json({ success: true, message: "Ergebnisse gespeichert" });
  } catch (error) {
    console.error("Save Entry Error:", error);
    return res.status(500).json({
      message: "Fehler beim Speichern der Ergebnisse",
      error: error.message,
    });
  }
}
