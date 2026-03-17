import { getAnimalById } from "../../../services/AnimalService";

export default async function handler(req, res) {
  const { id } = req.query;
  const animal = await getAnimalById(id);
  res.status(200).json(animal);
}