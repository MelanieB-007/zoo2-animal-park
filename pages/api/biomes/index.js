import { getAllBiomes } from "../../../services/BiomeService";

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const biomes = await getAllBiomes();
    res.status(200).json(biomes);
  } catch (error) {
    res.status(500).json({ error: "Gehege konnten nicht geladen werden" });
  }
}