# MoA Chain Explorer

A web dashboard for [MoA Chain](https://github.com/danielradu10/moa-chain) — submit prompt transactions, watch them move through the three-mini-round consensus protocol in real time, and inspect every validator's label, answer, classification, and vote along the way.

Built with React 19 + TypeScript + Vite, TanStack Query for data fetching, and Tailwind for styling.

## Demo

[![Watch the MoA Chain demo](https://img.youtube.com/vi/BNIdC3Ji66U/hqdefault.jpg)](https://youtu.be/BNIdC3Ji66U)

A walkthrough of the protocol and a live transaction moving through MR1 → MR2 → MR3, submitted and tracked from this explorer.

## What it does

- **Dashboard** — a live health strip for every validator/agent, a step-by-step progress tracker for the mini-round currently in flight (pushed over a server-sent-event stream, not polled), a running log of consensus steps, and the most recent transactions.
- **Submit a transaction** — write a prompt, submit it as a signed MoA Chain transaction, and land straight on its live detail page.
- **Transaction detail** — the complete lifecycle of one transaction, streamed live until it finalizes: MR1 subdomain label votes, MR2 candidate answers with their `CORRECT` / `WRONG` / `HALLUCINATION` / `MALICIOUS` classifications, and MR3's synthesized canonical answer with each validator's approve/reject vote.
- **Validator answer detail** — drill into a single validator's contribution to a transaction: its raw answer, its classification, and its vote.
- **Rounds** — browse finalized rounds and inspect the recorded MR1/MR2/MR3 detail for each one.

## Screenshots

*Coming soon.*

## Prerequisites

- Node.js 20+
- The MoA Chain backend running locally (`cmd/localchain`)

## Getting started

**1. Start the backend**

The quickest way to try the explorer is against a local chain running with mock agents — no LLM API keys needed:

```sh
# from the moa-chain repo
go run ./cmd/localchain --nodes 5 --start-round 2 --addr :8080
```

To drive it with real heterogeneous providers (OpenAI, Anthropic, Gemini, DeepSeek) instead, follow the [Getting started](https://github.com/danielradu10/moa-chain#getting-started) guide in the main `moa-chain` repo — `make localchain-agents` then `make localchain` — and point this explorer at the same `:8080` address.

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
  contexts/
    LiveRoundContext.tsx — SSE-backed live round/step state, shared across pages
  hooks/
    useSSE.ts        — generic server-sent-event hook
  components/
    dashboard/       — health strip, step progress, step log, recent transactions
    tx/               — timeline, validator labels/answers, synthesis votes, status badge
    layout/           — navbar
    ui/               — Radix-based primitives (button, card, table, badge, ...)
  pages/              — one component per route (see below)
  App.tsx             — routing
  main.tsx            — entry point
```

## Routes

| Path | Page | Shows |
|------|------|-------|
| `/` | Dashboard | Validator health, live step progress, step log, recent transactions |
| `/transactions` | TxList | All known transactions (mempool + finalized) |
| `/transactions/submit` | TxSubmit | Submit a new prompt transaction |
| `/transactions/:hash` | TxDetail | Full live lifecycle of one transaction |
| `/transactions/:hash/validators/:validatorId` | ValidatorAnswerDetail | One validator's answer, classification, and vote |
| `/rounds` | RoundList | All finalized rounds |
| `/rounds/:round` | RoundDetail | MR1 / MR2 / MR3 detail for a finalized round |

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
