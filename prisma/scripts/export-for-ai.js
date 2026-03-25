const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require("path");

const envPath = path.join(process.cwd(), '../.env.local');

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log("✅ .env.local gefunden und geladen von:", envPath);
} else {
  console.error("❌ .env.local NICHT gefunden an:", envPath);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://root:@localhost:3306/klub-der-tollen-tiere"
    }
  }
});

async function main() {
  // Wir holen uns alle Tiere und deren deutsche Namen
  const animals = await prisma.tiere.findMany({
    include: {
      texte: {
        where: { spracheCode: 'de' }
      }
    }
  });

  const exportData = animals.map(a => ({
    id: a.id,
    nameDe: a.texte[0]?.name || "Unbekannt",
    beschreibungDe: "" // Hier soll die KI reinschreiben
  }));

  fs.writeFileSync('animals_to_describe.json', JSON.stringify(exportData, null, 2));
  console.log(`Erfolgreich ${exportData.length} Tiere in 'animals_to_describe.json' exportiert.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());