import { getAllAnimals, createAnimal, getAnimalById } from "../../../services/AnimalService";

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

  if (req.method === "POST") {
    try {
      // 1. Das Tier in der DB erstellen (Prisma standard return)
      const rawNewAnimal = await createAnimal(req.body);

      // 2. WICHTIG: Das Tier erneut abrufen, aber inkl. aller Relationen & Mapping
      // Wir nutzen 'de', da das Formular ja gerade auf Deutsch ausgefüllt wurde.
      const completeAnimal = await getAnimalById(rawNewAnimal.id, 'de');

      // 3. Das vollständige, flache Objekt an das Frontend zurückgeben
      return res.status(201).json(completeAnimal);
    } catch (error) {
      console.error("API Error:", error);
      return res.status(500).json({ error: error.message });
    }
  }



  // Falls jemand DELETE oder PUT an diese URL schickt
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}