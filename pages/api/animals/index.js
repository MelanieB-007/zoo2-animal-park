import { getAllAnimals, createAnimal } from "../../../services/AnimalService";

export default async function handler(req, res) {
  const { lang } = req.query;

  // --- FALL 1: DATEN LADEN ---
  if (req.method === 'GET') {
    try {
      const allAnimals = await getAllAnimals(lang);
      return res.status(200).json(allAnimals || []);
    } catch (error) {
      console.error("API Fehler bei GET tiere:", error);
      return res.status(500).json([]);
    }
  }

  // --- FALL 2: NEUES TIER SPEICHERN ---
  if (req.method === 'POST') {
    try {
      const formData = req.body;

      if (!formData || !formData.names) {
        return res.status(400).json({ message: 'Ungültige Daten gesendet' });
      }

      const newAnimal = await createAnimal(formData);
      return res.status(201).json(newAnimal);
    } catch (error) {
      console.error("API Fehler bei POST tiere:", error);
      return res.status(500).json({ message: 'Fehler beim Speichern in der Datenbank' });
    }
  }

  // Falls jemand DELETE oder PUT an diese URL schickt
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}