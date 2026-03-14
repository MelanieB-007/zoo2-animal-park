// 1. ZUERST dotenv konfigurieren (WICHTIG: vor dem Prisma-Import!)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const { PrismaClient } = require('@prisma/client');

// Kleiner Test zur Sicherheit:
console.log("Verbunden mit:", process.env.DATABASE_URL.includes('localhost') ? "LOKAL (MySQL)" : "REMOTE (TiDB)");

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

require('dotenv').config({ path: '.env.local' });
const prisma = new PrismaClient();
console.log("DATABASE_URL:", process.env.DATABASE_URL);
async function scrapeAndStore(searchName) {
  const tier = await prisma.tiere.findFirst({ where: { nameEn: searchName } });
  if (!tier) return console.error("Tier nicht in DB gefunden.");

  console.log(`🚀 Starte Browser für ${searchName}...`);

  // Headless: false öffnet ein echtes Fenster
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    const wikiUrl = `https://zoo2animalpark.fandom.com/wiki/${searchName.replace(/\s+/g, '_')}`;
    await page.goto(wikiUrl, { waitUntil: 'networkidle2' });

    console.log("⏳ Warte 10 Sekunden... (Löse ggf. das Cloudflare-Captcha im Browser-Fenster!)");

    // Wir geben dir Zeit, falls du manuell klicken musst
    await new Promise(r => setTimeout(r, 10000));

    // Ab hier versucht das Skript die Daten zu lesen
    const capacities = await page.evaluate(() => {
      const results = [];
      const tables = Array.from(document.querySelectorAll('table'));
      const targetTable = tables.find(t => t.innerText.toLowerCase().includes('enclosure size'));

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
      console.log(`💾 Speichere ${capacities.length} Einträge...`);
      for (const cap of capacities) {
        await prisma.tier_gehege_kapazitaet.upsert({
          where: { tierId_anzahlTiere: { tierId: tier.id, anzahlTiere: cap.anzahlTiere } },
          update: { felder: cap.gehegeFeld },
          create: { tierId: tier.id, anzahlTiere: cap.anzahlTiere, felder: cap.gehegeFeld }
        });
      }
      console.log("🎉 Erfolg!");
    } else {
      console.warn("⚠️ Keine Tabelle gefunden. Eventuell musst du im Browser erst scrollen?");
    }

  } catch (error) {
    console.error("❌ Fehler:", error);
  } finally {
    // Wir lassen den Browser noch kurz offen, damit du das Ergebnis siehst
    await new Promise(r => setTimeout(r, 3000));
    await browser.close();
    await prisma.$disconnect();
  }
}

scrapeAndStore("Akhal-Teke");