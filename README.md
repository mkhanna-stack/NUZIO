# Nuzio

Nuzio is a personalized news reader built with React, Express, SQLite, and browser-native text-to-speech. Users can create an account, choose interests and a narrator, read current news, save stories, and listen to summaries in the browser.


   ##### Working Demo

[Watch the Nuzio working demo] https://youtu.be/yJXQqk7yFU8

## Features
- JWT authentication with bcrypt password hashing
- Onboarding for interests, language, profession, notifications, and narrator preference
- Live news ingestion from Google News RSS (no API key required)
- Category filtering and manual refresh
- Save/unsave stories per user
- Browser text-to-speech using the Web Speech API, with voice/language fallbacks
- SQLite persistence for local development and demos

## Requirements
- Node.js 22.5+
- npm 10+

## Run locally

### Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```
The API runs at `http://localhost:4000`.

### Frontend
```bash
cd client
npm install
npm run dev
```
Open the Vite URL, usually `http://localhost:5173`.

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

## Environment variables
Keep `.env.example` in GitHub as documentation. Create local `.env` files from it, but never commit real secrets.

## Notes
Browser speech voices are supplied by the user's operating system/browser. Aria, Kai, and Maara use different language, voice-selection, pitch, and rate preferences when supported; exact voice availability varies by device.


