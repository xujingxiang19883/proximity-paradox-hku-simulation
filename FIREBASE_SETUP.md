# Firebase Setup

This project is prepared for Firebase Realtime Database.

## 1. Create a Firebase project

Open the Firebase console and create a project:

- Firebase Console: https://console.firebase.google.com/
- Web setup guide: https://firebase.google.com/docs/web/setup
- Realtime Database guide: https://firebase.google.com/docs/database/web/start

## 2. Register a Web App

In the project overview:

1. Click the web icon `</>`
2. Give the app a nickname
3. Register the app
4. Copy the Firebase config object

## 3. Enable Realtime Database

In Firebase Console:

1. Go to `Build` -> `Realtime Database`
2. Click `Create Database`
3. Choose a location
4. Start in locked mode first if you want, then replace rules with the demo rules below

## 4. Paste your config

Open:

`/Users/binbin2/transgender simulator/firebase-config.js`

Replace the `...` placeholders with your real Firebase config values.

Important:

- `databaseURL` is required for Realtime Database
- Firebase generates these values for you automatically

## 5. Set demo rules

For a short public demo where users scan a QR code and submit results without signing in, use:

```json
{
  "rules": {
    "summary": {
      ".read": true,
      ".write": true
    },
    "playthroughs": {
      ".read": false,
      ".write": true
    }
  }
}
```

These rules are open and are only suitable for a temporary demo.

## 6. Publish

After updating `firebase-config.js`, push the site again and test:

- Main simulator: `index.html`
- Live board: `results.html`
