const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { PrismaClient } = require('@prisma/client');



const prisma = new PrismaClient();

async function importDescriptions() {
  const dataPath = path.join(__dirname, 'import_data.json');

  if (!fs.existsSync(dataPath)) {
    console.error("❌ Fehler: Die Datei 'import_data.json' wurde nicht gefunden!");
    return;
  }

  try {
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`🚀 Starte Import von ${jsonData.length} Beschreibungen...`);

    let count = 0;
    for (const item of jsonData) {
      if (!item.id || !item.beschreibung) {
        console.warn(`⚠️ Überspringe Eintrag ohne ID oder Beschreibung:`, item);
        continue;
      }

      await prisma.tiere.update({
        where: { id: item.id },
        data: { beschreibung: item.beschreibung }
      });

      count++;
      console.log(`✅ [${count}/${jsonData.length}] Importiert: ID ${item.id}`);
    }

    console.log(`\n🏁 Fertig! ${count} Beschreibungen wurden in die Datenbank geschrieben.`);

    // Optional: Datei umbenennen, damit wir sie nicht doppelt importieren
    const timestamp = Date.now();
    fs.renameSync(dataPath, path.join(__dirname, `imported_backup_${timestamp}.json`));
    console.log(`📦 Datei wurde zur Sicherheit in 'imported_backup_${timestamp}.json' umbenannt.`);

  } catch (error) {
    console.error("❌ Fehler beim Importieren:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importDescriptions();