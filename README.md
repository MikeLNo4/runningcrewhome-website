# RunningCrewHome Website

Offizielle Website für die RunningCrewHome iOS App.

## Über RunningCrewHome

RunningCrewHome ist deine Laufcrew's Home Base. Verbinde dein Strava, koordiniere Gruppenlaufe und trainiere gemeinsam mit deiner Running Crew.

## Features der Website

- Übersicht über alle App-Features
- Pricing-Information (Freemium & Premium)
- Kontaktformular
- Datenschutzerklärung
- AGB

## Technologie

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript
- GitHub Pages

## Deployment

Diese Website ist als GitHub Pages Projekt konfiguriert.

### Lokale Vorschau

Öffne einfach `index.html` in deinem Browser oder nutze einen lokalen Webserver:

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server
```

Dann öffne: http://localhost:8000

### GitHub Pages Setup

1. Push dieses Repository zu GitHub
2. Gehe zu Repository Settings > Pages
3. Wähle Branch: `main` und Folder: `/ (root)`
4. Speichern
5. Die Website wird verfügbar unter: `https://mikelno4.github.io/runningcrewhome-website/`

## Kontaktformular

Das Kontaktformular verwendet Formspree. Um es zu aktivieren:

1. Gehe zu https://formspree.io
2. Erstelle ein kostenloses Konto
3. Erstelle ein neues Formular
4. Ersetze `YOUR_FORM_ID` in `index.html` mit deiner Formspree Form ID

## Anpassungen

### App Store Link

Sobald die App im App Store verfügbar ist, ersetze alle `#` Links mit dem echten App Store Link:

```html
<a href="https://apps.apple.com/de/app/runningcrewhome/YOUR_APP_ID">Im App Store laden</a>
```

### Farben

Die Farben basieren auf dem App-Logo und sind in `styles.css` als CSS Custom Properties definiert:

- Dark Blue: `#1a3a5c`
- Orange: `#ff8c42`
- Light Blue: `#4a9fd8`

## Struktur

```
runningcrewhome-website/
├── index.html          # Hauptseite
├── privacy.html        # Datenschutzerklärung
├── terms.html          # AGB
├── styles.css          # Styles
├── script.js           # JavaScript
├── logo.png            # App-Logo
└── README.md           # Diese Datei
```

## Lizenz

© 2025 Michael Markowitz. Alle Rechte vorbehalten.

## Kontakt

E-Mail: runningcrewhome@gmail.com
