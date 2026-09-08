# Divyaputri Tradex LLP — MERN Website

Full MERN stack website for Divyaputri Tradex LLP (Nano Technology / multi-category products).
Fully responsive React frontend + Express/MongoDB backend for the contact form.

## Structure

```
divyaputri-tradex-mern/
├── client/          React app (Vite)
└── server/          Express + MongoDB API
```

## Setup

### 1. Backend

```bash
cd server
npm install
copy .env.example .env    # Windows (or `cp` on Mac/Linux), then fill in MONGO_URI
npm run dev                # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev                 # starts on http://localhost:5173
```

The frontend calls `POST /api/contact` on the backend to store contact form
submissions in MongoDB. During local dev, Vite proxies `/api` calls to
`http://localhost:5000` (see `vite.config.js`).

> If you're already running the MMA Tradex backend on port 5000, either stop
> it first or change `PORT` in this project's `.env` (and update
> `vite.config.js`'s proxy target to match) so the two don't clash.

## Environment variables (server/.env)

```
MONGO_URI=mongodb://127.0.0.1:27017/divyaputri-tradex
PORT=5000
CLIENT_URL=http://localhost:5173
```

## Responsiveness

All layout is built with CSS Grid/Flexbox + `clamp()` for fluid type, and
breakpoints at 900px / 760px / 560px. No fixed pixel widths for containers,
so it works from small mobile screens up to large desktops.
