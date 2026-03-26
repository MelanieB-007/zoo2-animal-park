// pages/api/contests/[id].js
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;
  const contestId = parseInt(id);

  if (req.method === "DELETE") {
    try {
      await prisma.wettbewerbe.delete({
        where: { id: contestId }
      });

      return res.status(200).json({ message: "Alles inklusive Relationen gelöscht" });
    } catch (error) {
      return res.status(500).json({ error: "Fehler beim Löschen" });
    }
  }

  if (req.method === "PUT") {
    const { start, ende } = req.body;
    try {
      const updated = await prisma.wettbewerbe.update({
        where: { id: contestId },
        data: {
          start: new Date(start),
          ende: new Date(ende)
        },
      });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: "Fehler beim Updaten" });
    }
  }

  // Falls jemand eine andere Methode (GET, POST) probiert
  res.setHeader("Allow", ["DELETE", "PUT"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}