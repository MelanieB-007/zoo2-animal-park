
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log("✅ .env.local gefunden und geladen von:", envPath);
} else {
  console.error("❌ .env.local NICHT gefunden an:", envPath);
}

// TEST: Was steht jetzt in der Variable?
console.log("DATABASE_URL ist aktuell:", process.env.DATABASE_URL);

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Pfad zu deiner Datei - stelle sicher, dass sie im gleichen Ordner liegt wie das Skript
  const filePath = path.join(__dirname, 'tierdaten.txt');
  const content = fs.readFileSync(filePath, 'utf-8');

  console.log("Starte automatischen Import aller Namen...");

  // Dieser Regex sucht nach (ID, 'Deutscher Name', 'Englischer Name', ...)
  // Er ist robust gegen Sonderzeichen und Hochkommas
  const regex = /\((\d+)\s*,\s*'([^']+)'\s*,\s*'([^']+)'/g;
  let match;
  let count = 0;

  // Sprachen sicherstellen
  await prisma.sprachen.upsert({ where: { code: 'de' }, update: {}, create: { code: 'de', name: 'Deutsch' } });
  await prisma.sprachen.upsert({ where: { code: 'en' }, update: {}, create: { code: 'en', name: 'English' } });

  while ((match = regex.exec(content)) !== null) {
    const [_, idStr, nameDe, nameEn] = match;
    const id = parseInt(idStr);

    try {
      // Wir erstellen die Texte nur, wenn das Tier (die ID) auch wirklich in 'tiere' existiert
      const tierExistiert = await prisma.tiere.findUnique({ where: { id: id } });

      if (tierExistiert) {
        await prisma.tier_texte.upsert({
          where: { tierId_spracheCode: { tierId: id, spracheCode: 'de' } },
          update: { name: nameDe },
          create: { tierId: id, spracheCode: 'de', name: nameDe }
        });

        await prisma.tier_texte.upsert({
          where: { tierId_spracheCode: { tierId: id, spracheCode: 'en' } },
          update: { name: nameEn },
          create: { tierId: id, spracheCode: 'en', name: nameEn }
        });
        count++;
      }
    } catch (e) {
      // Falls eine ID im Backup ist, die du lokal noch nicht hast, überspringen wir sie einfach
    }
  }

  console.log(`Fertig! ${count} Tiere wurden mit Namen verknüpft.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());