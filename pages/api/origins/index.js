import { getAllOrigins } from "../../../services/AnimalService";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const origins = await getAllOrigins()
      res.status(200).json(origins);
    } catch (error) {
      res.status(500).json({ error: "Fehler beim Laden der Herkunftsorte" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}