# 🃏 CardDeck PWA

Benvenuto/a in **CardDeck**, una Progressive Web App (PWA) leggera e veloce per giocare, imparare o creare mazzi di carte personalizzati direttamente dal tuo dispositivo, anche offline!

## 🚀 Funzionalità

- Interfaccia mobile-friendly
- Installabile su qualsiasi dispositivo (Android, iOS, desktop)
- Modalità offline tramite service worker
- Splash screen e icona personalizzati
- Prestazioni ottimizzate per mobile

## 📲 Installazione

### Su dispositivi Android
1. Apri l'app nel browser Chrome.
2. Tocca il menu (⋮) e seleziona **"Aggiungi a schermata Home"**.
3. L'app verrà installata come una vera applicazione.

### Su iOS (Safari)
1. Apri l'app nel browser Safari.
2. Tocca il pulsante **Condividi**.
3. Seleziona **"Aggiungi alla schermata Home"**.

## 🧾 Manifest PWA

```json
{
  "name": "CardDeck",
  "short_name": "Deck",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#F5E1C8",
  "theme_color": "#B73E3E",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
