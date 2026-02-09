# Podcaster - VPS Deployment Anleitung

## Voraussetzungen auf dem Server

```bash
# Node.js installieren (Version 18+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 global installieren (hält die App am Laufen)
sudo npm install -g pm2
```

## Projekt auf den Server laden

### Option 1: Mit Git
```bash
# Auf dem Server:
cd /var/www
git clone <dein-repo-url> podcaster
cd podcaster
```

### Option 2: Mit SCP/SFTP
```bash
# Auf deinem Mac:
scp -r /Users/jeranko/Documents/Code/podcaster user@dein-server:/var/www/
```

## Installation auf dem Server

```bash
cd /var/www/podcaster

# Frontend Dependencies installieren und bauen
npm install
npm run build

# Backend Dependencies installieren
cd server
npm install
cd ..
```

## .env.production anpassen

Bearbeite die Datei `.env.production` und ändere `VITE_API_URL`:

```bash
nano .env.production
```

Ändere:
```
VITE_API_URL=http://DEINE-SERVER-IP:3001
# oder mit Domain:
VITE_API_URL=https://podcaster.deine-domain.de
```

Dann neu bauen:
```bash
npm run build
```

## Server starten

```bash
# Mit PM2 starten (empfohlen)
pm2 start ecosystem.config.cjs

# PM2 beim Neustart automatisch starten
pm2 save
pm2 startup
```

## Firewall öffnen

```bash
sudo ufw allow 3001
```

## Mit Nginx (Optional aber empfohlen)

Für HTTPS und bessere Performance:

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/podcaster
```

Füge ein:
```nginx
server {
    listen 80;
    server_name podcaster.deine-domain.de;

    client_max_body_size 500M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktivieren:
```bash
sudo ln -s /etc/nginx/sites-available/podcaster /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Nützliche Befehle

```bash
# Server Status prüfen
pm2 status

# Logs anzeigen
pm2 logs podcaster-api

# Server neustarten
pm2 restart podcaster-api

# Server stoppen
pm2 stop podcaster-api
```

## Firebase Konfiguration

Vergiss nicht, deine Server-Domain in der Firebase Console zu erlauben:
1. Gehe zu https://console.firebase.google.com
2. Wähle dein Projekt "podcaster-c417b"
3. Authentication → Settings → Authorized domains
4. Füge deine Domain hinzu (z.B. `podcaster.deine-domain.de`)

## Fertig! 🎉

Deine App läuft jetzt unter:
- http://DEINE-SERVER-IP:3001
- oder https://podcaster.deine-domain.de (mit Nginx)
