const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starte Migration der Namen...");

  // 1. Sicherstellen, dass die Sprachen existieren
  await prisma.sprachen.upsert({ where: { code: 'de' }, update: {}, create: { code: 'de', name: 'Deutsch' } });
  await prisma.sprachen.upsert({ where: { code: 'en' }, update: {}, create: { code: 'en', name: 'English' } });

  // 2. Die Namen aus deinem SQL-Backup (Auszug)
  const namenBackup = [
    { id: 101, de: "Achal-Tekkiner", en: "Akhal-Teke" },
    { id: 102, de: "Afrikanischer Elefant", en: "African Elephant" },
    { id: 103, de: "Alpaka", en: "Alpaca" },
    { id: 104, de: "Andenkondor", en: "Andean Condor" },
    { id: 105, de: "Antarktis-Dorsch", en: "Antarctic Toothfish" },
    { id: 106, de: "Arktischer Wolf", en: "Arctic Wolf" },
    { id: 107, de: "Atlantik-Hering", en: "Atlantic Herring" },
    { id: 108, de: "Axolotl", en: "Axolotl" },
    // ... hier folgen dann die 2xxxer IDs
    { id: 201, de: "Annam-Stabschrecke", en: "Annam Stick Insect" },
    // usw.
  ];

  for (const n of namenBackup) {
    try {
      await prisma.tier_texte.upsert({
        where: {
          tierId_spracheCode: { tierId: n.id, spracheCode: 'de' }
        },
        update: { name: n.de },
        create: { tierId: n.id, spracheCode: 'de', name: n.de }
      });

      await prisma.tier_texte.upsert({
        where: {
          tierId_spracheCode: { tierId: n.id, spracheCode: 'en' }
        },
        update: { name: n.en },
        create: { tierId: n.id, spracheCode: 'en', name: n.en }
      });
    } catch (e) {
      console.error(`Fehler bei ID ${n.id}: Tier existiert evtl. nicht in 'tiere'`);
    }
  }

  console.log("Namen wurden erfolgreich in 'tier_texte' übertragen!");
}

main().catch(console.error).finally(() => prisma.$disconnect());