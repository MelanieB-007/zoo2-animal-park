import { saveContestResults } from "../../../services/ContestService";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { contestId, memberId, data } = req.body;

  if (!contestId || !memberId || !data) {
    return res.status(400).json({ message: "Fehlende Daten im Payload" });
  }

  try {
    const result = await saveContestResults(contestId, memberId, data);

    return res.status(200).json({
      message: "Ergebnisse erfolgreich gespeichert",
      count: result.count
    });
  } catch (error) {
    console.error("API Error:", error.message);
    const status = error.message === "No valid data to save" ? 400 : 500;
    return res.status(status).json({ message: error.message });
  }
}