import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // Lädt standardmäßig .env

// Speziell für .env.local (da Next.js diese bevorzugt)
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// 2. URL manuell aus deinen Variablen bauen (Sicherheitsnetz)
const localUrl = `mysql://root:@localhost:3306/klub-der-tollen-tiere`;

console.log(">>> Verbinde lokal mit:", localUrl);

// 3. Prisma zwingen, diese URL zu nutzen
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: localUrl,
    },
  },
});

async function main() {
  const filePath = path.join(process.cwd(), 'tiere.json');

  if (!fs.existsSync(filePath)) {
    console.error("Fehler: JSON-Datei nicht gefunden unter", filePath);
    return;
  }

  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Update für ${jsonData.length} Tiere wird gestartet...`);

  for (const item of jsonData) {
    // Deutsch aktualisieren
    await prisma.tier_texte.updateMany({
      where: { tierId: item.id, spracheCode: 'de' },
      data: { beschreibung: item.beschreibungDe }
    });

    // Englisch aktualisieren
    await prisma.tier_texte.updateMany({
      where: { tierId: item.id, spracheCode: 'en' },
      data: { beschreibung: item.beschreibungEn }
    });
  }

  console.log("✅ Import erfolgreich auf localhost abgeschlossen!");
}

main()
  .catch((e) => console.error("❌ Fehler beim Import:", e))
  .finally(async () => await prisma.$disconnect());