# Deployment Anleitung für GitHub Pages

## Schritt 1: GitHub Repository erstellen

1. Gehe zu https://github.com/new
2. Repository Name: `runningcrewhome-website`
3. Description: "Offizielle Website für RunningCrewHome iOS App"
4. Visibility: **Public** (wichtig für GitHub Pages)
5. **NICHT** "Initialize this repository with a README" aktivieren
6. Klicke auf "Create repository"

## Schritt 2: Lokales Repository mit GitHub verbinden

Öffne Terminal im Projektverzeichnis und führe aus:

```bash
cd /Users/michaelmarkowitz/Xcode/runningcrewhome-website

# Remote hinzufügen
git remote add origin https://github.com/MikeLNo4/runningcrewhome-website.git

# Push zum GitHub Repository
git push -u origin main
```

Wenn du nach Authentifizierung gefragt wirst:
- Username: `MikeLNo4`
- Password: Nutze ein **Personal Access Token** (nicht dein GitHub Passwort!)

### Personal Access Token erstellen (falls nötig):

1. Gehe zu https://github.com/settings/tokens
2. Klicke auf "Generate new token" > "Generate new token (classic)"
3. Token Name: "RunningCrewHome Website"
4. Wähle Scope: `repo` (voller Zugriff auf Repositories)
5. Klicke "Generate token"
6. **WICHTIG**: Kopiere das Token sofort (es wird nur einmal angezeigt!)
7. Verwende dieses Token als Passwort beim Git Push

## Schritt 3: GitHub Pages aktivieren

1. Gehe zu deinem Repository: https://github.com/MikeLNo4/runningcrewhome-website
2. Klicke auf **Settings** (oben rechts)
3. Scroll runter zu **Pages** (linke Sidebar)
4. Unter "Source":
   - Branch: `main`
   - Folder: `/ (root)`
5. Klicke **Save**

## Schritt 4: Warten auf Deployment

- GitHub Pages benötigt 1-2 Minuten zum Deployment
- Die Website wird verfügbar sein unter: **https://mikelno4.github.io/runningcrewhome-website/**
- Du erhältst eine Benachrichtigung wenn das Deployment abgeschlossen ist

## Schritt 5: Formspree konfigurieren

1. Gehe zu https://formspree.io
2. Registriere dich mit: runningcrewhome@gmail.com
3. Klicke auf "+ New Form"
4. Name: "RunningCrewHome Contact"
5. Kopiere die Form ID (z.B. `abc123xyz`)
6. Öffne `index.html` und ersetze:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
   mit deiner echten Form ID

7. Commit und Push die Änderung:
   ```bash
   git add index.html
   git commit -m "Add Formspree form ID"
   git push
   ```

## Schritt 6: Testen

1. Öffne https://mikelno4.github.io/runningcrewhome-website/
2. Teste alle Links
3. Teste das Kontaktformular
4. Teste auf Mobile (Chrome DevTools > Toggle Device Toolbar)

## Zukünftige Updates

Wenn du die Website aktualisieren möchtest:

```bash
cd /Users/michaelmarkowitz/Xcode/runningcrewhome-website

# Änderungen vornehmen
# Dann:

git add .
git commit -m "Beschreibung der Änderungen"
git push
```

GitHub Pages wird die Website automatisch innerhalb von 1-2 Minuten aktualisieren.

## Custom Domain (Optional - für später)

Wenn du später eine eigene Domain kaufst (z.B. runningcrewhome.com):

1. Kaufe Domain bei einem Domain-Anbieter (z.B. Namecheap, Google Domains)
2. Gehe zu GitHub Repository Settings > Pages
3. Gib deine Custom Domain ein
4. Konfiguriere DNS bei deinem Domain-Anbieter:
   ```
   A Record:     @ → 185.199.108.153
   A Record:     @ → 185.199.109.153
   A Record:     @ → 185.199.110.153
   A Record:     @ → 185.199.111.153
   CNAME Record: www → mikelno4.github.io
   ```
5. Warte auf DNS-Propagierung (24-48 Stunden)
6. Aktiviere "Enforce HTTPS" in GitHub Pages Settings

## Troubleshooting

### Website wird nicht angezeigt
- Warte 2-3 Minuten nach dem ersten Push
- Prüfe GitHub Actions Tab für Build-Fehler
- Stelle sicher, dass das Repository **Public** ist

### 404 Fehler
- Stelle sicher, dass `index.html` im Root-Verzeichnis liegt
- Prüfe Groß-/Kleinschreibung bei Dateinamen

### Formular funktioniert nicht
- Prüfe, ob du die Formspree Form ID korrekt eingefügt hast
- Teste, ob Formspree-Account aktiviert ist

## Fertig!

Deine Website sollte jetzt live sein unter:
**https://mikelno4.github.io/runningcrewhome-website/**

Bei Fragen oder Problemen: runningcrewhome@gmail.com
