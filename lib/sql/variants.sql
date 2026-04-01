CREATE TABLE `farbvarianten_texte`
(
    `id`             INT AUTO_INCREMENT PRIMARY KEY,
    `farbvarianteId` INT          NOT NULL,
    `spracheCode`    VARCHAR(5)   NOT NULL,
    `name`           VARCHAR(255) NOT NULL,
    CONSTRAINT `fk_variant` FOREIGN KEY (`farbvarianteId`) REFERENCES `farbvarianten` (`id`) ON DELETE CASCADE
);

-- 2. Kopiere die bestehenden deutschen Farben aus der alten Spalte rüber
-- (Ich gehe davon aus, dass deine Spalte in 'farbvarianten' noch 'farbe' heißt)
INSERT INTO `farbvarianten_texte` (`farbvarianteId`, `spracheCode`, `name`)
SELECT `id`, 'de', `farbe`
FROM `farbvarianten`;

-- 3. (Optional) Wenn alles geklappt hat, kannst du die alte Spalte löschen
-- ALTER TABLE `farbvarianten` DROP COLUMN `farbe`;

-- Zuerst die deutschen Texte sichern (hast du wahrscheinlich schon gemacht)
-- Jetzt die englischen Übersetzungen ergänzen:

INSERT INTO `farbvarianten_texte` (`farbvarianteId`, `spracheCode`, `name`)
SELECT `farbvarianteId`, 'en',
       CASE
           WHEN `name` = 'Apfelschimmel' THEN 'Dapple Grey'
           WHEN `name` = 'arabisch' THEN 'Arabian'
           WHEN `name` = 'beige' THEN 'Beige'
           WHEN `name` = 'blau' THEN 'Blue'
           WHEN `name` = 'blau-orange' THEN 'Blue-Orange'
           WHEN `name` = 'blond' THEN 'Blond'
           WHEN `name` = 'braun' THEN 'Brown'
           WHEN `name` = 'gefleckt' OR `name` = 'gepfleckt' THEN 'Spotted'
           WHEN `name` = 'gepunktet' THEN 'Dotted'
           WHEN `name` = 'gescheckt' THEN 'Piebald'
           WHEN `name` = 'gelb' THEN 'Yellow'
           WHEN `name` = 'gold' THEN 'Gold'
           WHEN `name` = 'grün' THEN 'Green'
           WHEN `name` = 'hell' THEN 'Light'
           WHEN `name` = 'hellbraun' THEN 'Light Brown'
           WHEN `name` = 'humbold' THEN 'Humboldt'
           WHEN `name` = 'leuzistisch' THEN 'Leucistic'
           WHEN `name` = 'rosa' THEN 'Pink'
           WHEN `name` = 'rot' THEN 'Red'
           WHEN `name` = 'schwarz' THEN 'Black'
           WHEN `name` = 'schwarz-weiß' OR `name` = 'schwarweiß' THEN 'Black and White'
           WHEN `name` = 'silber' THEN 'Silver'
           WHEN `name` = 'tiger' THEN 'Tiger'
           WHEN `name` = 'weiß' THEN 'White'
           WHEN `name` = 'weißrüssel' THEN 'White-nosed'
           WHEN `name` = 'Zyan' THEN 'Cyan'
           ELSE `name` -- Falls wir was vergessen haben, nimm den Originalnamen
           END
FROM `farbvarianten_texte`
WHERE `spracheCode` = 'de';