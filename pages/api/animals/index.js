import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const alleTiere = await prisma.tiere.findMany({
      include: {
        gehege: true,
        preisart: true,
        xp: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.status(200).json(alleTiere || []);
  } catch (error) {
    console.error("API Fehler bei tiere/index:", error);
    res.status(500).json([]);
  }
}