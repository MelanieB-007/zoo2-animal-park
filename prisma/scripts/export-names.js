const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function exportNames() {
  try {
    console.log("🔍 Suche Tiere ohne Beschreibung...");

    const tiere = await prisma.tiere.findMany({
      where: {
        OR: [
          { beschreibung: null },
          { beschreibung: "" }
        ]
      },
      select: { id: true, name: true },
      take: 100 // Jetzt auf 100 erhöht
    });

    console.log(`📊 Gefundene Tiere: ${tiere.length}`);

    if (tiere.length === 0) {
      console.log("✅ Alle Tiere haben bereits eine Beschreibung!");
      return;
    }

    const filePath = path.join(__dirname, 'tiere_fuer_chatgpt.json');

    // Wir löschen die alte Datei, falls sie existiert, um Konflikte zu vermeiden
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    fs.writeFileSync(filePath, JSON.stringify(tiere, null, 2), 'utf-8');

    console.log(`\n📄 Datei erfolgreich erstellt: ${filePath}`);
    console.log(`🚀 Kopiere jetzt den Inhalt der Datei in dein Perplexity Pro.`);

  } catch (error) {
    console.error("❌ Schwerwiegender Fehler beim Export:");
    console.error(error); // Zeigt uns jetzt den genauen Grund (z.B. Connection Timeout)
  } finally {
    await prisma.$disconnect();
  }
}

exportNames();