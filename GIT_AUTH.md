# Git Authentifizierung für GitHub

## Personal Access Token (PAT) erstellen

### Schritt 1: Token auf GitHub erstellen

1. Gehe zu: https://github.com/settings/tokens
2. Klicke auf **"Generate new token"** → **"Generate new token (classic)"**
3. Fülle das Formular aus:
   - **Note**: "RunningCrewHome Website Deployment"
   - **Expiration**: 90 days (oder "No expiration" wenn du willst)
   - **Scopes**: Wähle mindestens:
     - ✅ `repo` (Full control of private repositories)
     - Das reicht für Push/Pull

4. Klicke **"Generate token"** (ganz unten)
5. **WICHTIG**: Kopiere das Token SOFORT (sieht aus wie `ghp_xxxxxxxxxxxxxxxxxxxx`)
   - Es wird nur EINMAL angezeigt!
   - Speichere es in einem sicheren Passwort-Manager

### Schritt 2: Token in macOS Keychain speichern

Öffne Terminal und führe aus:

```bash
# Git Credential Helper aktivieren (verwendet macOS Keychain)
git config --global credential.helper osxkeychain
```

### Schritt 3: Remote setzen und pushen

```bash
cd /Users/michaelmarkowitz/Xcode/runningcrewhome-website

# Remote mit deinem GitHub Username hinzufügen
git remote add origin https://github.com/MikeLNo4/runningcrewhome-website.git

# Versuche zu pushen
git push -u origin main
```

Wenn Git nach Credentials fragt:
- **Username**: `MikeLNo4`
- **Password**: *DEIN PERSONAL ACCESS TOKEN* (das du gerade kopiert hast)

Das Token wird dann im macOS Keychain gespeichert und du musst es nie wieder eingeben!

---

## Option 2: SSH-Key verwenden (sicherer, aber mehr Setup)

### Schritt 1: SSH-Key generieren

```bash
# SSH-Key erstellen (drücke Enter für defaults)
ssh-keygen -t ed25519 -C "runningcrewhome@gmail.com"

# Starte SSH-Agent
eval "$(ssh-agent -s)"

# Füge Key zum SSH-Agent hinzu
ssh-add ~/.ssh/id_ed25519
```

### Schritt 2: Public Key zu GitHub hinzufügen

```bash
# Kopiere den Public Key in die Zwischenablage
pbcopy < ~/.ssh/id_ed25519.pub
```

1. Gehe zu: https://github.com/settings/keys
2. Klicke **"New SSH key"**
3. Title: "MacBook RunningCrewHome"
4. Paste den Key (CMD+V)
5. Klicke **"Add SSH key"**

### Schritt 3: Remote auf SSH umstellen

```bash
cd /Users/michaelmarkowitz/Xcode/runningcrewhome-website

# SSH Remote hinzufügen
git remote add origin git@github.com:MikeLNo4/runningcrewhome-website.git

# Pushen (keine Authentifizierung mehr nötig!)
git push -u origin main
```

---

## Troubleshooting

### "remote origin already exists"

```bash
# Entferne den alten Remote
git remote remove origin

# Füge den neuen hinzu
git remote add origin https://github.com/MikeLNo4/runningcrewhome-website.git
```

### Token funktioniert nicht

- Stelle sicher, dass du `repo` Scope ausgewählt hast
- Prüfe, ob das Token nicht abgelaufen ist
- Achte darauf, dass du das Token kopiert hast (nicht dein GitHub Passwort!)

### SSH Connection Test

```bash
ssh -T git@github.com
# Sollte antworten: "Hi MikeLNo4! You've successfully authenticated..."
```

---

## Empfehlung

**Für einmaligen Push**: Nutze **Option 1** (Personal Access Token)

**Für häufige Updates**: Nutze **Option 2** (SSH-Key) - einmal einrichten, nie wieder Credentials eingeben

---

## Nachdem die Authentifizierung funktioniert:

```bash
cd /Users/michaelmarkowitz/Xcode/runningcrewhome-website

# Prüfe ob Remote gesetzt ist
git remote -v

# Push to GitHub
git push -u origin main
```

Dann gehe zu GitHub Pages Settings wie in DEPLOYMENT.md beschrieben!
