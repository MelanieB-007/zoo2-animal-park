import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { contestService } from "../../../services/contestService";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Nicht autorisiert" });

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const result = await contestService.createContest(req.body);
    return res.status(201).json({ success: true, contest: result });
  } catch (error) {
    console.error("Service Error:", error);
    return res.status(500).json({ message: "Interner Fehler im ContestService" });
  }
}