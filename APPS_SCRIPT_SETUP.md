# Google Sheets + Apps Script Setup

This is the easier backend option for the simulator.

Official references:

- Apps Script web apps: https://developers.google.com/apps-script/guides/web
- Content service / JSON & JSONP: https://developers.google.com/apps-script/guides/content

## What you need

1. A Google Sheet
2. One Apps Script web app
3. The deployed web app URL pasted into:

`/Users/binbin2/transgender simulator/apps-script-config.js`

## Step 1. Create a Google Sheet

Create a blank Google Sheet.

Suggested name:

`Proximity Paradox Results`

## Step 2. Open Apps Script

Inside the Google Sheet:

1. Click `Extensions`
2. Click `Apps Script`

## Step 3. Paste the backend script

Replace the default Apps Script code with the contents of:

`/Users/binbin2/transgender simulator/apps-script/Code.gs`

## Step 4. Deploy as a Web App

In Apps Script:

1. Click `Deploy`
2. Click `New deployment`
3. Choose type: `Web app`
4. Execute as: `Me`
5. Who has access: `Anyone`
6. Deploy

Copy the final `Web app URL`

## Step 5. Paste the Web App URL

Open:

`/Users/binbin2/transgender simulator/apps-script-config.js`

Replace:

```js
webAppUrl: "..."
```

with your real deployed Apps Script URL.

## Step 6. Push again

After updating `apps-script-config.js`, push the site again.

Then:

- the simulator will record each completed run into the Google Sheet
- the mascot board will poll the Apps Script summary endpoint every 10 seconds
