import { getAllLanguages } from "../../../services/CommonService";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const languages = await getAllLanguages();
      return res.status(200).json(languages);
    } catch (error) {
      return res.status(500).json({ error: "Fehler beim Laden der Sprachen" });
    }
  }
  res.status(405).end();
}