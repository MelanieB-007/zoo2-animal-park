import { getAllContests } from "../../../services/ContestService";

export default async function handler(req, res) {

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Methode ${req.method} nicht erlaubt` });
  }

  try {
    const contests = await getAllContests();
    return res.status(200).json(contests);
  } catch (error) {
    console.error("API Error [Contest List]:", error);
    return res.status(500).json({
      message: "Fehler beim Laden der Wettbewerbe",
      error: error.message
    });
  }
}