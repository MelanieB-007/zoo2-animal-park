# Projektbeschreibung: Zoo2 Community Manager

## 1. Projektübersicht
Dieses Projekt umfasst die Entwicklung einer spezialisierten Web-Applikation für die Community des Spiels 
**"Zoo 2: Animal Park"** von [upjers](https://en.upjers.com/zoo-2-animal-park). Die App dient als 
Verwaltungs- und Planungstool, um Spieldaten effizient zu organisieren und strategische Entscheidungen für 
Wettbewerbe im Club zu treffen.

## 2. Kernfunktionen (MVP - Minimum Viable Product)
Das System ermöglicht die Verwaltung zentraler Spielelemente in einer übersichtlichen Struktur:

* **Übersicht & Management:** Darstellung und Verwaltung (CRUD) von:
    * **Tieren:** Datenbank aller verfügbaren Spezies.
    * **Farbvarianten:** Datenbank aller verfügbaren Farbvarianten.
    * **Gehegen & Statuen:** Organisation von Inventar und Park-Layout.
    * **Mitgliedern:** Verwaltung der aktiven Club-Mitglieder.
* **Datenbank-Integration:** 
    * Anbindung an eine bereits bestehende und befüllte MySQL-Datenbank, um vorhandene Elementlisten nahtlos weiterzuführen.  
* **Authentifizierung & Autorisierung:** 
    * Sicherer Login-Bereich via **NextAuth.js**.
    * Integration von **Discord-OAuth**.
    * Rollenbasierter Zugriff: Während alle User Daten einsehen können, ist das Erstellen, Bearbeiten und Löschen von 
      Inhalten einem autorisierten Nutzerkreis vorbehalten.
* **Internationalisierung (i18n):** 
  * Multilinguale Benutzeroberfläche (z. B. Deutsch, Englisch, Niederländisch, Dänisch).
  * Unterstützung für internationale Club-Mitglieder, um Sprachbarrieren bei der Wettbewerbsplanung abzubauen.
  
## 3. Bonus-Feature: Wettbewerbs-Planer
Das Herzstück für die strategische Club-Planung ist das Wettbewerbs-Modul:
* **Wettbewerbs-Erstellung:** Anlage neuer Events mit spezifischen Anforderungen (3–4 Fokus-Tiere).
* **Datenerfassung:** Mitglieder können ihre verfügbaren Bestände für die jeweiligen Wettbewerbe eintragen.
* **Punkte-Rechner:** Die App berechnet automatisch die voraussichtliche Gesamtpunktzahl für verschiedene Szenarien. Dies dient als Entscheidungsgrundlage, an welchem Wettbewerb der Club teilnehmen sollte, um die Gewinnchancen zu maximieren.


## 4. Technischer Stack
Die Anwendung wird mit modernen Web-Technologien realisiert, um Performance und Skalierbarkeit zu gewährleisten:

| Technologie | Einsatzbereich |
| :--- | :--- |
| **Next.js** | React-Framework für Routing und Server-Side Rendering |
| **React** | Library für die deklarative Benutzeroberfläche |
| **Styled Components** | CSS-in-JS für modulares und dynamisches Styling |
| **MySQL** | Relationale Datenbank zur strukturierten Datenspeicherung |
| **next-intl / i18next** | Bibliotheken zur Verwaltung der Sprachübersetzungen |
| **NextAuth.js** | Authentifizierung via Discord & Session-Management |

## 5. Zielsetzung
Ziel des Projekts ist es, eine benutzerfreundliche, multilinguale Plattform zu schaffen, die den Club-Mitgliedern durch 
datengestützte Planung einen signifikanten Vorteil im Spiel verschafft.