import { getAnimalById, updateAnimal, deleteAnimal } from "../../../services/AnimalService";

export default async function handler(req, res) {
  const { id } = req.query;

  // GET: Ein einzelnes Tier laden (für das Formular)
  if (req.method === 'GET') {
    try {
      const animal = await getAnimalById(id);
      if (!animal) return res.status(404).json({ message: "Tier nicht gefunden" });

      return res.status(200).json(JSON.parse(JSON.stringify(animal)));
    } catch (error) {
      return res.status(500).json({ message: "Fehler beim Laden" });
    }
  }

  // PUT: Die Änderungen speichern
  if (req.method === 'PUT') {
    try {
      const updatedAnimal = await updateAnimal(id, req.body);
      console.log("API", updatedAnimal);
      return res.status(200).json(updatedAnimal);
    } catch (error) {
      console.error("Update Error:", error);
      return res.status(500).json({ message: "Fehler beim Aktualisieren", error: error.message });
    }
  }

  // DELETE: Das Tier löschen
  if (req.method === 'DELETE') {
    const success = await deleteAnimal(id);
    if (success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: "Löschen fehlgeschlagen" });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}