# AI Personal Assistant

A Next.js personal assistant with AI chat, briefings, alerts, Gmail, WhatsApp, and phone authentication integrations.

## Requirements

- Node.js 20 or newer
- An InsForge project
- Optional: Google OAuth, Gemini, Sent.dm, and Trigger.dev credentials for related features

## Local setup

```bash
npm ci
copy .env.example .env.local
```

Fill in `.env.local` with your service credentials. Never commit `.env.local`, `.env`, `.insforge`, session data, or generated build files.

Apply the SQL files in `migrations/` to the project database before using alerts or briefings. Start the app with:

```bash
npm run dev
```

Open http://localhost:3000.

## Checks

```bash
npm run lint
npm run build
```

## GitHub upload

Create the repository inside this project directory, then review the staged file list before committing:

```bash
git init
git add .
git status --short
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Rotate any credentials that have previously been exposed, and add replacement values only as GitHub or deployment secrets.
