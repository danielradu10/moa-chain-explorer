# MoA Chain Explorer

A web dashboard for [MoA Chain](https://github.com/danielradu10/moa-chain) — submit transactions, track their lifecycle through consensus, and monitor live round progress.

Built with React + TypeScript + Vite.

---

## Prerequisites

- Node.js 20+
- The MoA Chain backend running locally (`cmd/localchain`)

## Getting started

**1. Start the backend**

```sh
# from the moa-chain repo
go run ./cmd/localchain --nodes 5 --start-round 2 --addr :8080
```

**2. Start the dev server**

```sh
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). API calls are proxied to `localhost:8080` automatically — no CORS configuration needed.

## Build for production

```sh
npm run build
```

Serve `dist/` behind any static file server (nginx, Caddy, etc.) with `/api/*` proxied to the MoA Chain node.

---

## Project structure

```
src/
  api/
    client.ts       — typed fetch + SSE wrappers for every API endpoint
  components/       — reusable UI components
  pages/            — top-level page views
  App.tsx           — root component and routing
  main.tsx          — entry point
```

## API

All calls go through the Vite proxy to `localhost:8080/api/v1`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness check |
| `POST` | `/transactions` | Submit a transaction; returns `tx_hash` |
| `GET` | `/transactions` | List all known transactions (finalized + mempool) |
| `GET` | `/transactions/{hash}` | Full lifecycle detail for one transaction |
| `GET` | `/transactions/{hash}/events` | SSE stream — closes when tx reaches FINALIZED |
| `GET` | `/rounds/{round}` | MR1 / MR2 / MR3 detail for a finalized round |
| `GET` | `/round/current` | Current consensus step on node 0 |
| `GET` | `/round/stream` | SSE stream of step-change events |
| `GET` | `/blocks/{hash}` | Block detail by header hash |
