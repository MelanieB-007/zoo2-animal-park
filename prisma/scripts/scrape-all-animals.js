const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const { PrismaClient } = require('@prisma/client');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const prisma = new PrismaClient();

async function startAutomation() {
  console.log("🚀 Starte Massen-Scraping...");
  const report = { success: [], failed: [], errors: [] };

  // 1. Alle Tiere holen
  const alleTiere = await prisma.tiere.findMany({
    select: { id: true, nameEn: true }
  });

  // 2. Bereits vorhandene Kapazitäten holen, um Duplikate zu vermeiden
  const vorhandeneKapazitaeten = await prisma.tier_gehege_kapazitaet.findMany({
    select: { tierId: true }
  });
  const fertigeTierIds = new Set(vorhandeneKapazitaeten.map(k => k.tierId));

  // 3. Nur die Tiere filtern, die noch keine Daten haben
  const tiere = alleTiere.filter(t => !fertigeTierIds.has(t.id));

  const total = tiere.length;
  console.log(`📊 Gesamt in DB: ${alleTiere.length} | Zu scrapen: ${total}`);

  if (total === 0) {
    console.log("✅ Alle Tiere sind bereits versorgt!");
    return;
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  for (let i = 0; i < total; i++) {
    const tier = tiere[i];
    const currentCount = i + 1;
    const progress = `[${currentCount}/${total}]`;

    console.log(`\n${progress} --- 🐾 Bearbeite: ${tier.nameEn} (ID: ${tier.id}) ---`);

    try {
      const wikiUrl = `https://zoo2animalpark.fandom.com/wiki/${tier.nameEn.replace(/\s+/g, '_')}`;
      await page.goto(wikiUrl, { waitUntil: 'networkidle2', timeout: 45000 });

      // Kurze Initial-Pause für Cloudflare/Rendering
      await new Promise(r => setTimeout(r, 3000));

      const capacities = await page.evaluate(() => {
        const results = [];
        const tables = Array.from(document.querySelectorAll('table'));
        const targetTable = tables.find(t => {
          const txt = t.innerText.toLowerCase();
          return txt.includes('enclosure size') || (txt.includes('animals') && txt.includes('size'));
        });

        if (targetTable) {
          const rows = Array.from(targetTable.querySelectorAll('tr'));
          rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td, th'));
            if (cells.length >= 2) {
              const count = parseInt(cells[0].innerText.replace(/[^0-9]/g, ''));
              const size = parseInt(cells[1].innerText.replace(/[^0-9]/g, ''));
              if (!isNaN(count) && !isNaN(size) && count > 0) {
                results.push({ anzahlTiere: count, gehegeFeld: size });
              }
            }
          });
        }
        return results;
      });

      if (capacities.length > 0) {
        console.log(`💾 Speichere ${capacities.length} Stufen...`);
        for (const cap of capacities) {
          await prisma.tier_gehege_kapazitaet.upsert({
            where: { tierId_anzahlTiere: { tierId: tier.id, anzahlTiere: cap.anzahlTiere } },
            update: { felder: cap.gehegeFeld },
            create: { tierId: tier.id, anzahlTiere: cap.anzahlTiere, felder: cap.gehegeFeld }
          });
        }
        report.success.push(`${tier.nameEn} (ID: ${tier.id})`);
        console.log(`✅ ${tier.nameEn} erfolgreich verarbeitet.`);
      } else {
        report.failed.push(`${tier.nameEn} (ID: ${tier.id})`);
        console.warn(`⚠️ Keine Tabelle gefunden.`);
      }

      // Zufällige Pause zwischen 4 und 7 Sekunden (Human Factor)
      const randomWait = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000;
      console.log(`😴 Warten (${randomWait / 1000}s)...`);
      await new Promise(r => setTimeout(r, randomWait));

    } catch (error) {
      console.error(`❌ Fehler bei ${tier.nameEn}:`, error.message);
      report.errors.push(`${tier.nameEn}: ${error.message}`);
      // Kurze Sicherheitspause nach einem Fehler
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  // Report schreiben
  const reportContent = [
    `=== Scraping Report vom ${new Date().toLocaleString()} ===`,
    `Gesamt verarbeitet: ${total}`,
    `Erfolgreich: ${report.success.length}`,
    `Keine Tabelle: ${report.failed.length}`,
    `Technische Fehler: ${report.errors.length}`,
    `\n--- NICHT GEFUNDEN (Prüfe Wiki-URL) ---`,
    ...report.failed,
    `\n--- FEHLER-LOG ---`,
    ...report.errors
  ].join('\n');

  fs.writeFileSync('scraping_report.txt', reportContent);
  console.log("\n🏁 Alles erledigt! Report wurde in 'scraping_report.txt' gespeichert.");

  await browser.close();
  await prisma.$disconnect();
}

startAutomation();