import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../src/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;
  const contestId = parseInt(id);

  // 1. Sicherheitscheck: Nur eingeloggte User dürfen ändern/löschen
  const session = await getServerSession(req, res, authOptions);
  if (!session && (req.method === "PUT" || req.method === "DELETE")) {
    return res.status(401).json({ message: "Nicht autorisiert" });
  }

  // 2. Logik nach Methode trennen (REST-Standard)
  switch (req.method) {
    case "GET": // Falls du mal einen einzelnen Wettbewerb per API laden willst
      const contest = await prisma.wettbewerbe.findUnique({
        where: { id: contestId },
      });
      return res.status(200).json(contest);

    case "PUT": // UPDATE
      try {
        const { start, ende, aktiv, statuenIds } = req.body;
        const contestId = parseInt(req.query.id);

        const updated = await prisma.wettbewerbe.update({
          where: { id: contestId },
          data: {
            start: new Date(start),
            ende: new Date(ende),
            aktiv: parseInt(aktiv),
            // Hier passiert die Magie für die Statuen:
            statuen: {
              // 1. Alle alten Verknüpfungen für diesen Wettbewerb entfernen
              deleteMany: {},
              // 2. Die neuen 3 Statuen-IDs verknüpfen
              create: statuenIds.map((sId) => ({
                statueId: parseInt(sId),
              })),
            },
          },
          // Wir inkludieren die neuen Statuen in der Antwort,
          // damit das Frontend die aktuelle Struktur sieht
          include: {
            statuen: true,
          },
        });

        return res.status(200).json(updated);
      } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({
          error: "Fehler beim Updaten des Wettbewerbs",
          details: error.message,
        });
      }
      break;

    case "DELETE": // LÖSCHEN
      try {
        await prisma.wettbewerbe.delete({ where: { id: contestId } });
        return res.status(200).json({ message: "Gelöscht" });
      } catch (error) {
        return res.status(500).json({ error: "Fehler beim Löschen" });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
