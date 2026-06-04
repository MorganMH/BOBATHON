# Kathy's Command Centre

A corporate **stakeholder-management command centre**. Kathy is a delivery lead; the app
helps her **chase people on their commitments**, **remember key topics** from chat / email /
meetings, keep **personal info** on stakeholders, and **find the right stakeholder via AI** —
plus a **real-time voice assistant ("Atlas")** powered by the Gemini Live API.

Built for a hackathon from the plans in [`docs/`](docs/).

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | **Laravel 12** (PHP 8.4) |
| Frontend | **React 18 + TypeScript** via **Inertia.js** |
| UI | **IBM Carbon Design System** (`@carbon/react`) |
| Build | Vite 7 |
| Database | **SQLite** — committed to the repo with seeded demo data |
| AI (text) | Google **Gemini 2.5 Flash** (summaries, action extraction, stakeholder finder) |
| AI (voice) | Google **Gemini Live API** — native-audio realtime voice with tool calling |

---

## Requirements

- PHP 8.4 with `pdo_sqlite`
- Composer 2
- Node 20+ / npm
- A Google Gemini API key (free) for the AI + voice — get one at <https://aistudio.google.com/apikey>

## Setup

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

# Add your key (and review the model names) in .env:
#   GEMINI_API_KEY=...

# The SQLite database is committed with demo data, so no migrate needed.
# To rebuild it from scratch instead:
php artisan migrate:fresh --seed
```

## Run

```bash
# Terminal 1 — Vite dev server (hot reload)
npm run dev

# Terminal 2 — Laravel
php artisan serve
```

Open <http://127.0.0.1:8000>. For a production-style run, `npm run build` then just `php artisan serve`.

---

## SQLite in the repo

The brief required the database to live in git. Laravel ignores `*.sqlite*` by default;
[`database/.gitignore`](database/.gitignore) adds `!database.sqlite` so the **seeded demo
database is tracked** (the `-wal`/`-shm` sidecar files stay ignored). Reseed any time with
`php artisan migrate:fresh --seed`.

---

## Gemini configuration

All keys live server-side in `.env` (never bundled into the JS). Defaults in
[`config/services.php`](config/services.php):

```dotenv
GEMINI_API_KEY=                 # your key
GEMINI_LIVE_MODEL=gemini-2.5-flash-native-audio-preview-12-2025   # realtime voice
GEMINI_TEXT_MODEL=gemini-2.5-flash                                # summaries / extraction
GEMINI_VOICE=Aoede              # one of the prebuilt HD voices
VOICE_ALLOW_DIRECT_KEY=true     # localhost: browser gets the key to open the Live socket
VOICE_ALLOW_MUTATIONS=false     # voice "write" tools require an in-app confirm
```

> **Model availability varies by key.** Live models aren't returned by `models.list`, and
> some (`gemini-2.0-flash-live-001`, `gemini-live-2.5-flash-native-audio`) weren't reachable
> on the test key. `gemini-2.5-flash-native-audio-preview-12-2025` connected and returned
> audio + transcripts. If voice fails to connect, try a different live model name here.
> The text model uses `thinkingBudget: 0` so the reasoning model replies in ~1–2s.

Everything **degrades gracefully**: with no key, AI text uses deterministic local logic and
voice shows a "configure a key" hint — so the app still runs and demos.

---

## Features

- **Command Centre** — stats, who-to-chase, commitments coming due, project health, topics, recent comms, and a **"Simulate inbound email"** button that runs an email through AI into a summary + actions + a blocker (the live wow-moment).
- **Stakeholders** — a directory with skills, reliability, availability and an **AI finder** ("who knows our payment gateway?"). Each person has a dossier: profile, personal notes, how to work with them, their commitments, recent comms and topics.
- **Commitments** — filterable table of every promise; nudge or mark done.
- **Communications** — email / chat / meeting inbox with AI summaries and on-demand **summarise / extract actions**.
- **Topics** — durable memory of recurring themes across conversations.
- **Projects** — health, progress, team (with roles) and per-project activity.
- **Atlas voice assistant** — tap the mic (top-right) and talk.

### Voice architecture (tool-based)

The model gets a **small persona**, not a context dump. It calls **tools** for facts, so the
app stays the source of truth:

```
VoiceOrb (global)  →  useVoiceSession  →  GET /voice/session (persona + tool decls + key)
       │                     │
   MicCapture (16kHz PCM) ───┤            Gemini Live (WebSocket, @google/genai)
   PcmPlayer  (24kHz PCM) ───┘                    │
                          functionCall ──► POST /agent/tools/execute ──► Laravel tools
                          (write tools ──► needs_confirmation ──► /agent/tools/confirm)
```

Tools: `who_to_chase`, `find_stakeholder`, `get_person_dossier`, `list_people`,
`search_interactions`, `navigate`, and `create_reminder` (write — gated by a confirm step).

Try: *"Who should I chase today?"* · *"Tell me about Priya before my meeting"* ·
*"Who can help get the payment gateway live?"* · *"Open the commitments page."*

---

## Project structure

```
app/
  Http/Controllers/   Dashboard, Stakeholder, Commitment, Communication, Topic, Project,
                      Ai (summarize/extract/find/process-email), Voice, AgentTool
  Models/             Stakeholder, Project, Commitment, Communication, Topic, Reminder
  Services/           GeminiService (text + Live session), AgentTools (the tool registry)
  Support/Present.php Canonical JSON shapes for the Inertia payloads
database/
  migrations/         stakeholders, projects(+pivot), commitments, communications, topics, reminders
  seeders/DemoSeeder  ~13 people, 3 projects, 21 commitments, 12 comms, 10 topics, 8 reminders
  database.sqlite     committed, seeded
resources/js/
  Pages/              Inertia pages (Carbon)
  Layouts/AppLayout   Carbon UI Shell + global voice orb + flash toasts
  Components/         shared UI + LiveEmailDemo
  Voice/              VoiceOrb, useVoiceSession, audio/{MicCapture,PcmPlayer,pcm}
docs/                 the original plans + demo-data-questionnaire.md
```

## Demo data

Seeded data is realistic but placeholder. To make it real, the team can fill in
[`docs/demo-data-questionnaire.md`](docs/demo-data-questionnaire.md) — every answer maps to a
field in [`database/seeders/DemoSeeder.php`](database/seeders/DemoSeeder.php).
