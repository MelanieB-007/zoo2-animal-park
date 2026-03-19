import { getAnimalById } from "../../../services/AnimalService";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Nur GET-Anfragen erlaubt' });
  }

  try {
    const animal = await getAnimalById(id);

    if (!animal) {
      return res.status(404).json({ message: "Tier nicht gefunden" });
    }

    res.status(200).json(JSON.parse(JSON.stringify(animal)));
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
}