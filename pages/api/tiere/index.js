import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const alleTiere = await prisma.tiere.findMany({
      include: {
        gehege: true,
        preisart: true
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Falls die Tabelle leer ist, gibt Prisma [] zurück.
    // Das ist perfekt für .filter()
    res.status(200).json(alleTiere || []);
  } catch (error) {
    console.error("API Fehler bei tiere/index:", error);
    // WICHTIG: Sende im Fehlerfall lieber ein leeres Array oder
    // behandle den Fehler im Frontend explizit.
    res.status(500).json([]);
  }
}