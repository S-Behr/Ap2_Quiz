# Frontend

Dieses Verzeichnis enthält das Frontend-Projekt.

Projektstruktur (relevant):

- `ap2-quiz/` – das eigentliche Vite + React Projekt
- `package.json` – Root-Delegationsskripte (führt Befehle im `ap2-quiz` aus)
- `backend/` – leerer Platzhalterordner für ein späteres Backend

Schnellstart (PowerShell):

1. Vom Workspace-Root:

```powershell
cd frontend
npm run dev
```

Das `dev`-Skript wechselt automatisch in `ap2-quiz` und startet dort Vite.

2. Direkt im Projektordner (empfohlen, wenn du erstmal Abhängigkeiten installieren willst):

```powershell
cd frontend\ap2-quiz
npm install
npm run dev
```

Build und Preview:

```powershell
# vom frontend-Ordner (delegiert nach ap2-quiz)
cd frontend
npm run build
npm run preview

# oder direkt
cd frontend\ap2-quiz
npm run build
npm run preview
```

Troubleshooting

- Hängt `npm install` oder `npm run dev` lange? Stoppe mit Strg+C und versuche die Befehle einzeln (erst `npm install`, dann `npm run dev`).
- Falls Port-Konflikte auftreten, prüfe ob andere Prozesse (z. B. andere Vite/Node-Server) laufen.
- Wenn Typescript-/Vite-Fehler auftreten, poste die Terminal-Ausgabe hier, dann helfe ich bei der Diagnose.

Backend (Platzhalter)

Der Ordner `backend/` ist derzeit leer. Wenn du möchtest, kann ich dort eine minimale Node/Express-Stubstruktur (inkl. `package.json` und Startskript) anlegen.

Wenn du weitere Anpassungen möchtest (z. B. flachziehen des Projekts oder Zusammenführen von `package.json`), sag kurz Bescheid.
