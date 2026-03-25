import { getAllStatues } from "../../../../services/StatueService";

export default async function handler(req, res) {
  const { lang = "de" } = req.query;

  if (req.method === "GET") {
    try {
      // Wir nutzen die zentrale Service-Funktion
      const statues = await getAllStatues(lang);

      return res.status(200).json(statues);
    } catch (error) {
      console.error("API Error Statues:", error);
      return res
        .status(500)
        .json({ error: "Fehler beim Laden der Statuen-Daten" });
    }
  }

  // Fallback für nicht unterstützte Methoden
  res.setHeader("Allow", ["GET"]);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
