import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getAllAnimals, createAnimal, getAnimalById } from "../../../services/AnimalService";

export default async function handler(req, res) {
  const { lang = 'de' } = req.query; // Fallback auf 'de'

  // --- FALL 1: DATEN LADEN (Öffentlich) ---
  if (req.method === 'GET') {
    try {
      const allAnimals = await getAllAnimals(lang);
      return res.status(200).json(allAnimals || []);
    } catch (error) {
      console.error("API Fehler bei GET tiere:", error);
      return res.status(500).json([]);
    }
  }

  // --- FALL 2: ANLEGEN (Nur Eingeloggt) ---
  if (req.method === "POST") {
    // 1. Session prüfen
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({
        message: "Nicht autorisiert. Bitte logge dich ein, um Tiere anzulegen."
      });
    }

    try {
      // 2. Das Tier in der DB erstellen
      const rawNewAnimal = await createAnimal(req.body);

      // 3. Vollständiges Objekt abrufen (inkl. Relationen für die UI)
      // Wir nutzen rawNewAnimal.id, da Prisma das neu erstellte Objekt zurückgibt
      const completeAnimal = await getAnimalById(rawNewAnimal.id, 'de');

      return res.status(201).json(completeAnimal);
    } catch (error) {
      console.error("API POST Error:", error);
      return res.status(500).json({ error: "Fehler beim Erstellen des Tieres." });
    }
  }

  // Fallback für nicht unterstützte Methoden
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}