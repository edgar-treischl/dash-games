
# Data Science FILES

Projekt-Summary & Development Documentation
1. Projektvision

The DS Files ist ein experimentelles, narratives Game Design Lab für Data Literacy im Bildungsbereich.

Das Spiel verbindet eine atmosphärische Detektivgeschichte mit einzelnen interaktiven Ermittlungsfällen.

Die Spielenden übernehmen die Rolle von Ermittlerinnen und Ermittlern. Sie untersuchen verdächtige Datenaussagen, sammeln Hinweise, analysieren Diagramme und entwickeln eigene Schlussfolgerungen.

Das zentrale Lernziel ist, Korrelation und Kausalität unterscheiden zu können und datenbasierte Aussagen kritisch zu hinterfragen.

2. Zielgruppe
Lehrkräfte und pädagogisches Personal
Schulleitungen
Bildungsadministration
3. Pädagogische Lernziele

Die Spielenden sollen lernen:

Daten und Diagramme richtig zu interpretieren.
Muster und Zusammenhänge zu erkennen.
Korrelation und Kausalität zu unterscheiden.
Drittvariablen und Scheinkorrelationen zu erkennen.
Umgekehrte Kausalität zu verstehen.
Fehlenden Kontext und Verzerrungen zu identifizieren.
Datenbasierte Aussagen kritisch zu hinterfragen.
Fundierte Schlussfolgerungen abzuleiten.

Wichtige Einschränkung: Das Spiel fokussiert auf Interpretations- und Urteilskompetenz. Es gibt keine eigenen Datenbereinigungen, Datenanalysen oder Programmieraufgaben.

4. Game-Design-Konzept

Das Spiel besteht aus einer übergreifenden Detektivgeschichte und mehreren eigenständig spielbaren Fällen.

Die zentrale Spielwelt ist eine moderne Ermittlungszentrale.

Die wichtigsten Bereiche:

Headquarters – Ermittlungszentrale und Fallübersicht.
Case Files – einzelne Ermittlungsfälle.
Evidence Room – Dokumente und Hinweise untersuchen.
Evidence Wall – Hinweise sammeln und kategorisieren.
Data Investigation – Diagramme und Zusammenhänge untersuchen.
Investigator Notes – Hypothesen und Erkenntnisse.
The Verdict – begründete Schlussfolgerungen.
Case Archive – abgeschlossene Fälle.
5. Die vier geplanten Ermittlungsfälle

CASE 001 – The Summer Mystery

Eisverkauf und Badeunfälle steigen gleichzeitig.

Lernziele:

Korrelation und Kausalität
Drittvariablen
Scheinkorrelation

CASE 002 – The Digital Advantage

Schulen mit mehr digitalen Geräten erzielen bessere Ergebnisse.

Lernziele:

Korrelation und Kausalität
Störvariablen
Fehlender Kontext

CASE 003 – The Reading Paradox

Schülerinnen und Schüler, die mehr lesen, erzielen bessere Ergebnisse.

Lernziele:

Umgekehrte Kausalität
Alternative Erklärungen

CASE 004 – The Missing Students

Höhere Anwesenheit geht mit besseren Prüfungsergebnissen einher.

Lernziele:

Kontext
Verzerrungen
Mehrere mögliche Erklärungen
6. Game-Design-Prinzipien

Keine klassischen Gamification-Elemente wie XP, Badges oder Leaderboards.

Stattdessen:

Drag & Drop
Evidence Collection
Progressive Disclosure
Discovery Learning
Decision & Consequence
Branching Scenarios
Role Playing
Interactive Storytelling
Feedback Loops

Die Motivation entsteht durch Neugier, Erkenntnis und die narrative Entwicklung.

Ein wichtiger Grundsatz: Nicht jeder Fall muss eine eindeutige kausale Antwort haben. Manchmal ist die wissenschaftlich angemessene Schlussfolgerung, dass die Daten nicht ausreichen.

7. Visuelles Design

Art Direction: Modern Noir Investigation.

Gestalterische Merkmale:

Dunkles Anthrazit als Hintergrund.
Cremefarbene Dokumente und Akten.
Orange als Akzentfarbe.
Rot für Warnungen und besondere Hinweise.
Serifenschrift für Überschriften.
DM Sans für UI-Texte.
DM Mono für Aktennummern und Daten.

Verwendete Schriftarten:

Playfair Display
DM Sans
DM Mono

Farbpalette:

Background: #171A1D
Surface: #252A2E
Paper: #E8E0D1
Accent: #D68B48
Alert: #9C5148

Die Atmosphäre soll erwachsen, hochwertig, geheimnisvoll und funktional sein.

8. Technologischer Stack
React
TypeScript
Vite
Zustand für globales State Management
Motion für Animationen und Übergänge
Lucide React für Icons
CSS für Styling
@dnd-kit/react für geplante Drag-and-Drop-Mechaniken
Recharts für geplante Datenvisualisierungen
Optional: XState für komplexere Spielflusssteuerung
9. Aktuelle Projektstruktur
text
src/
├── components/
│   ├── CaseCard.tsx
│   ├── Headquarters.tsx
│   ├── EvidenceCard.tsx
│   ├── EvidenceRoom.tsx
│   └── EvidenceWall.tsx
│
├── data/
│   ├── cases.ts
│   └── evidence.ts
│
├── store/
│   └── gameStore.ts
│
├── App.tsx
├── index.css
└── main.tsx
10. Implementierter Entwicklungsstand

Prototype 01 – Headquarters

Implementiert:

Ermittlungszentrale
Dark-Noir-Design
Vier Fallkarten
Öffnen einer Fallakte
Animierte Screen-Transitions
Responsive Layout

Prototype 02 – Case Briefing

Implementiert:

Narrative Einführung
Fallbeschreibung
Official Report
Ermittlungsauftrag
Navigation zurück zur Zentrale
Übergang zur Untersuchung

Prototype 03 – Evidence Room

Implementiert:

Vier beispielhafte Beweisstücke
Evidence Cards
Dokumente öffnen
Hinweise sammeln
Freischalten weiterer Hinweise
Fortschrittsanzeige

Prototype 04 – Evidence Wall

Teilweise implementiert:

Verfügbare Hinweise anzeigen
Hinweise in Kategorien ziehen
Drei Kategorien:
Supports my hypothesis
Additional context
Still unclear
Hinweise wieder entfernen
Erste Drag-and-Drop-Funktion mit nativen HTML-Drag-and-Drop-Events
11. Aktueller technischer Zustand

Das React-Projekt wurde eingerichtet und die bisherigen Screens funktionieren grundsätzlich.

Packages:

bash
npm install zustand motion lucide-react


Für die geplante Drag-and-Drop-Weiterentwicklung:

bash
npm install @dnd-kit/react


Projekt starten:

bash
npm run dev
12. Aktuell offenes Problem

Der Button OPEN EVIDENCE WALL im Evidence Room funktioniert noch nicht zuverlässig.

Zu überprüfen:

Enthält gameStore.ts die Action openEvidenceWall?
Ist currentScreen um den Wert evidence-wall erweitert?
Ist der Button in EvidenceRoom.tsx korrekt mit onClick={openEvidenceWall} verbunden?
Ist EvidenceWall.tsx in App.tsx importiert?
Ist der Screen-Wechsel in der AnimatePresence-Navigation korrekt implementiert?

Erst dieses Problem beheben, bevor weitere Mechaniken entwickelt werden.

13. Nächste Entwicklungsschritte

Priorität 1 – Stabilisierung

Navigation zwischen allen Screens überprüfen.
Zustand und Screen-Wechsel konsolidieren.
Evidence Collection testen.
Freischaltlogik testen.
Doppelte oder inkonsistente Zustände vermeiden.

Priorität 2 – Evidence Wall verbessern

Drag & Drop zuverlässiger machen.
Alternative zur Mausbedienung integrieren.
Platzierte Hinweise visuell hervorheben.
Kategorien und Begründungen didaktisch verbessern.

Priorität 3 – Hypothesenbildung

Spielende formulieren Hypothesen.
Hinweise werden mit Hypothesen verknüpft.
Feedback zu Interpretationen geben.
Widersprüchliche Hinweise sichtbar machen.

Priorität 4 – Data Investigation

Interaktive Diagramme mit Recharts.
Eisverkauf und Badeunfälle visualisieren.
Temperatur als zusätzliche Variable einblenden.
Besucherzahlen als weiteren Kontext freischalten.

Priorität 5 – The Verdict

Schlussfolgerungen auswählen.
Begründungen formulieren.
Feedback und Reveal entwickeln.
Fallabschluss implementieren.
14. Wichtige Entwicklungsprinzipien
Learning by Building.
Kleine, eigenständig spielbare Prototypen.
Erst Spielerfahrung optimieren, dann abstrahieren.
Komponenten wiederverwendbar gestalten.
Fachliche und technische Konzepte verständlich erklären.
Keine unnötige technische Komplexität.
Responsive und barrierearme Bedienung.
Jede Interaktion muss einen didaktischen Zweck haben.
Daten und Szenarien müssen fachlich konsistent sein.

Ziel: Ein praktisches Game-Design-Labor entwickeln, in dem aus klassischen Data-Literacy-Aufgaben interessante, interaktive und narrative Lernerlebnisse werden.



## Prompt

Du bist mein React-/TypeScript-Entwickler und Game-Design-Sparringspartner. Wir entwickeln gemeinsam The Correlation Files – ein atmosphärisches Detektivspiel zur Vermittlung von Data Literacy, insbesondere Korrelation und Kausalität.

Stack: React, TypeScript, Vite, Zustand, Motion, Lucide React, @dnd-kit/react und Recharts.

Design: Modern Noir Investigation, interaktive Ermittlungsfälle, Evidence Collection, Drag & Drop, Discovery Learning, Progressive Disclosure und Branching Scenarios. Keine klassischen Gamification-Elemente.

Aktueller Stand: Headquarters, Case Briefing, Evidence Room und Evidence Wall sind teilweise implementiert. Die Navigation zur Evidence Wall muss noch stabilisiert werden.

Arbeitsweise: Entwickle mit mir schrittweise funktionierende Prototypen. Erkläre technische Entscheidungen verständlich, nenne immer die Dateipfade und liefere vollständige, kopierbare Codeänderungen. Prüfe bestehenden Code, bevor du Änderungen vorschlägst. Achte auf didaktische Qualität, responsive Gestaltung und Barrierefreiheit.

Nächster Schritt: Stabilisiere die bestehende Navigation und entwickle anschließend die Evidence Wall mit Hypothesenbildung und interaktiver Datenvisualisierung weiter.

Arbeite pragmatisch: First make it work. Then make it meaningful. Then make it beautiful.