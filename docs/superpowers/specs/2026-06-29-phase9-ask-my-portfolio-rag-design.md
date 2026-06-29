# Phase 9 — "Ask my portfolio" live RAG demo — Design Spec

**Status:** Approved design (ready for implementation) · **Date:** 2026-06-29
**Owner:** Sergio Cuéllar Almagro · **Source plan:** `ULTRAPLAN.md` §11.2, §13 (Phase 9), §15 Q8

> This is a self-contained design hand-off. It is written so a fresh session — working
> primarily in a **new, separate API repo** — can build the feature without the original
> brainstorming context. The companion portfolio repo (`sergio-portfolio`) needs only a
> small frontend integration (Part B).

---

## 1. Goal

A public **"Ask my portfolio"** chat console on `sergiocuellar.dev` that answers questions
about Sergio using his own RAG/edge stack — the portfolio becomes a live demo of the exact
skills it describes. It must be **reliable**, **refuse off-topic questions**, and
**cannot exceed a hard cost cap** under abuse.

**Acceptance criteria (Phase 9 exit):**

1. A visitor can ask questions about Sergio and get accurate, grounded, streamed answers.
2. Off-topic questions are politely refused ("I can only answer questions about Sergio…").
3. The endpoint cannot exceed a configured daily cost/budget cap; abuse degrades gracefully
   to a "demo limit reached" fallback, never an uncapped spend.
4. No secrets in any repo; the public site stays static.

---

## 2. Locked decisions (with rationale)

| Decision | Choice | Why |
|---|---|---|
| Stack philosophy | **Dogfood Sergio's real stack** | The demo proves the CV: RAG + pgvector + LLM + edge |
| API runtime | **Standalone Cloudflare Worker (TypeScript)**, separate repo | Scales to zero (≈€0 idle), native Turnstile/KV abuse controls, nothing to patch, isolates risk from the Hetzner/n8n box |
| Retrieval store | **Supabase + pgvector** | Sergio's real retrieval stack (Kynetix/Weebu) |
| Embeddings | **OpenAI `text-embedding-3-small`** (1536-dim) | Single vendor with generation, trivial to call identically at ingest + query, negligible cost |
| Generation | **OpenAI `gpt-5.4-mini`**, streamed (SSE) | Sergio's choice; small/fast/cheap, good refusal with a strict system prompt |
| Orchestration | **Simple RAG chain** (embed → retrieve → 1 LLM call) | YAGNI; the Kynetix case study already showcases heavy LangGraph orchestration |
| Conversation | **Multi-turn, capped** (short history window + per-session message cap) | Real-assistant UX, bounded cost |
| Console placement | **Inline "Ask my portfolio" home section** (React island, `client:visible`) | Discoverable, on-narrative ("proof of self") |
| Guardrails | **Turnstile + KV per-IP rate-limit + global daily budget cap** | Public LLM endpoint must be abuse-proof |
| Frontend adapter | **None** — site stays fully static | API is a separate Worker, not an Astro endpoint; deviation from ULTRAPLAN §8.2 (simplification) |

> **Verify at build time:** confirm the exact OpenAI model IDs (`gpt-5.4-mini`,
> `text-embedding-3-small`), their context limits, streaming params, and current pricing
> against the live OpenAI API docs before wiring — model knowledge may be stale.

---

## 3. Architecture

Two repos, talking over HTTPS:

```
┌─────────────────────────────────────────┐        ┌──────────────────────────────────────┐
│ sergio-portfolio (existing, STATIC)      │        │ sergio-portfolio-api (NEW, Worker)   │
│  Workers Static Assets @ sergiocuellar.dev│       │  TS Worker @ api.sergiocuellar.dev   │
│                                          │        │                                      │
│  "Ask my portfolio" section              │  POST  │  POST /api/chat  (SSE)               │
│   └ AIConsole React island (client:visible) ─────▶│   1 Turnstile verify                 │
│       + Turnstile widget                 │  CORS  │   2 KV rate-limit + daily budget     │
│                                          │◀────── │   3 embed → pgvector top-k           │
│                                          │  SSE   │   4 prompt + stream gpt-5.4-mini     │
└─────────────────────────────────────────┘        │   5 KV counters++                    │
                                                    └──────────┬───────────────────────────┘
                                                               │ HTTPS
                                                  ┌────────────▼─────────────┐   ┌──────────────┐
                                                  │ Supabase (pgvector)      │   │ OpenAI API   │
                                                  │  documents + match RPC   │   │ embed + chat │
                                                  └──────────────────────────┘   └──────────────┘
```

---

## Part A — API repo (`sergio-portfolio-api`)

### A1. Stack & layout

- **Runtime:** Cloudflare Worker, TypeScript, `wrangler`. Tests in **Vitest**
  (`@cloudflare/vitest-pool-workers`). Lint/format mirror the portfolio repo.
- **No heavy framework** — a small fetch router (or Hono if preferred) is enough for one route.

```
sergio-portfolio-api/
├─ src/
│  ├─ index.ts            # Worker entry: router, CORS, POST /api/chat
│  ├─ chat.ts             # request handler: orchestrates the RAG chain
│  ├─ turnstile.ts        # siteverify
│  ├─ ratelimit.ts        # KV per-IP limit + global daily budget cap
│  ├─ retrieve.ts         # OpenAI embed + Supabase match_documents RPC
│  ├─ prompt.ts           # system prompt + context/history assembly
│  ├─ openai.ts           # chat completion (streaming) client
│  ├─ sse.ts              # SSE framing helpers
│  └─ types.ts
├─ knowledge/             # KB source markdown (see A6)
│  ├─ about.md  experience.md  expertise.md
│  ├─ projects/ kynetix.md  pneumonia.md  airline-sentiment.md
│  ├─ cv-summary.md
│  └─ faq.md
├─ scripts/
│  └─ ingest.ts           # chunk → embed → upsert to Supabase
├─ test/                  # Vitest units + eval set
├─ supabase/
│  └─ schema.sql          # documents table + match_documents() + index
├─ wrangler.jsonc
├─ package.json
└─ README.md
```

### A2. API contract — `POST /api/chat`

**Request** (JSON):
```jsonc
{
  "messages": [                         // multi-turn; server truncates to the history window
    { "role": "user", "content": "What's his experience with RAG?" }
  ],
  "turnstileToken": "<cf-turnstile-response>"
}
```

**Response:** `Content-Type: text/event-stream`. JSON-over-SSE, one event per line:
```
data: {"type":"token","text":"Sergio has "}
data: {"type":"token","text":"shipped RAG ..."}
data: {"type":"sources","items":[{"title":"Kynetix","ref":"projects/kynetix"}]}
data: {"type":"done","usage":{"input":812,"output":143}}
```
Errors use **HTTP status codes for pre-stream hard failures** (Turnstile `403`, rate-limit
`429`, malformed `400`, non-POST `405`) and a **`200` + SSE `error` event** for the
budget-exceeded fallback (so the console renders the friendly message inline):
```
data: {"type":"error","code":"rate_limited","message":"You're going a bit fast — try again in a moment."}
data: {"type":"error","code":"budget_exceeded","message":"The live demo has hit its daily limit. Here's a summary… and you can reach Sergio at info@sergiocuellar.dev."}
```

**Status codes:** `403` Turnstile fail · `429` per-IP rate limit · `200` (SSE) for normal +
budget-exceeded fallback · `400` malformed · `405` non-POST.

**CORS:** `Access-Control-Allow-Origin` restricted to `https://sergiocuellar.dev` (and
`http://localhost:4321` in dev); handle the `OPTIONS` preflight.

### A3. RAG pipeline (`chat.ts`)

1. Parse + validate body; reject if no user message.
2. **Turnstile** verify (`turnstile.ts`) → 403 on fail.
3. **Rate-limit + budget** (`ratelimit.ts`):
   - per-IP counter in KV (`rl:<ip>`, TTL 60s) → 429 if over `RATE_PER_MIN`.
   - global daily token budget (`budget:<YYYY-MM-DD>`) → if over `DAILY_TOKEN_BUDGET`,
     emit the `budget_exceeded` fallback and stop (no OpenAI call).
4. **Retrieve** (`retrieve.ts`): embed the latest user question
   (`text-embedding-3-small`) → call Supabase `match_documents(embedding, top_k)` →
   top-k chunks (with metadata for the `sources` event).
5. **Prompt** (`prompt.ts`): strict scope **system prompt** + retrieved context +
   the last `HISTORY_WINDOW` messages.
6. **Generate** (`openai.ts`): stream `gpt-5.4-mini`; relay tokens as SSE `token` events;
   emit `sources` then `done` with usage.
7. **Account**: increment the daily budget counter by tokens used.

### A4. System prompt (scope guard — sketch, finalize in code)

> You are the assistant for Sergio Cuéllar Almagro's portfolio. Answer **only** using the
> provided context about Sergio (his experience, projects, skills). If a question is not
> about Sergio or isn't covered by the context, say you can only answer questions about
> Sergio and suggest emailing info@sergiocuellar.dev. Never invent facts, employers,
> metrics, or links. Be concise, first-person-about-Sergio, and professional.

Refusal behavior is enforced by the prompt **and** validated by the eval set (A7).

### A5. Data model (`supabase/schema.sql`)

```sql
create extension if not exists vector;

create table documents (
  id          bigint generated always as identity primary key,
  content     text not null,
  metadata    jsonb not null default '{}',   -- { source, title, ref, chunk }
  embedding   vector(1536) not null          -- text-embedding-3-small
);

create index on documents using hnsw (embedding vector_cosine_ops);

create function match_documents(query_embedding vector(1536), match_count int default 5)
returns table (id bigint, content text, metadata jsonb, similarity float)
language sql stable as $$
  select id, content, metadata,
         1 - (embedding <=> query_embedding) as similarity
  from documents
  order by embedding <=> query_embedding
  limit match_count;
$$;
```
The Worker calls `match_documents` via Supabase PostgREST RPC (service key in a Worker
secret; the Worker is the only client, so RLS can stay simple).

### A6. Knowledge base + ingest

- **Source:** curated markdown in `knowledge/` — distilled from the site (about,
  experience, expertise, the 3 project case studies) + a CV summary + a recruiter `faq.md`
  (availability, relocation, role interests, contact). Self-contained in this repo
  (minor duplication with the site; decoupled by design — automating a pull from the site
  is a future item, see A9).
- **`scripts/ingest.ts`** (Node, run locally / CI):
  1. read every `knowledge/**/*.md`,
  2. chunk (~500–800 tokens, small overlap; keep headings as `metadata.title`/`ref`),
  3. embed each chunk (`text-embedding-3-small`),
  4. upsert into `documents` (truncate-and-reload, or upsert by a stable chunk id).
  - Run via `npm run ingest`. Re-run whenever `knowledge/` changes. Needs
    `OPENAI_API_KEY` + Supabase URL/service key in the local env.

### A7. Testing

- **Unit (Vitest):** Turnstile verify (mock siteverify), rate-limit + budget math (mock KV),
  prompt assembly (history truncation, context injection), retrieval (mock Supabase RPC),
  SSE framing.
- **Eval set:** ~8–12 cases — grounded questions → expected facts present; off-topic →
  refusal; prompt-injection ("ignore your instructions") → still refuses/stays in scope.
  Run against a test Supabase (or a recorded retrieval fixture).
- **Local dev:** `wrangler dev`; point the island at `http://localhost:8787`.

### A8. Config, secrets, bindings (`wrangler.jsonc`)

- **Bindings:** `KV` namespace (rate-limit + budget); custom domain route
  `api.sergiocuellar.dev`.
- **Secrets** (`wrangler secret put`): `OPENAI_API_KEY`, `TURNSTILE_SECRET`,
  `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`.
- **Vars (tunable, see §Tuning):** `RATE_PER_MIN`, `DAILY_TOKEN_BUDGET`, `HISTORY_WINDOW`,
  `TOP_K`, `MAX_OUTPUT_TOKENS`, `ALLOWED_ORIGIN`.
- **Deploy:** create Supabase project → run `schema.sql` → `npm run ingest` → create KV
  namespace → `wrangler secret put …` → `wrangler deploy` → attach `api.sergiocuellar.dev`
  custom domain → smoke-test from `sergiocuellar.dev`.

### A9. Future / out of scope for v1

Automate KB ingest from the live site (vs. curated markdown); Logpush/observability
dashboard; per-conversation server memory beyond the history window; multiple namespaces.

---

## Part B — Frontend integration (`sergio-portfolio`, this repo)

- **New section:** `src/components/sections/AskPortfolio.astro` placed in `index.astro`
  between Experience and Contact, using the existing `Section` wrapper + `SectionHeader`
  ("Ask my portfolio").
- **New island:** `src/components/islands/AIConsole.tsx` (React, `client:visible`) — the
  streaming chat UI (transcript, input, suggested starter questions, loading/typing,
  error + "demo limit reached" states). Reuse design tokens (glass panel, lavender accent,
  inset-glow — **no drop shadows**); honor `prefers-reduced-motion`.
- **Turnstile:** load the widget script; obtain a token per send; include it in the POST.
  Turnstile **site key** (public) + the **API base URL** go in `src/data/site.ts`
  (e.g. `apiBaseUrl`, `turnstileSiteKey`).
- **SSE consumption:** `fetch` + `ReadableStream` reader parsing the `data:` events from A2;
  append `token` text live; render `sources`; handle `error`/`done`.
- **Graceful degradation:** no-JS / reduced-motion → the section renders a static
  "Ask me anything — or email info@sergiocuellar.dev" prompt + contact CTA (the island
  enhances on hydrate).
- **Security headers:** the existing `public/_headers` may need a CSP allowance later if a
  CSP is added (Turnstile + the API origin) — tracked with the deferred CSP item.

---

## 4. Tuning defaults (start here, adjust after observing real usage)

| Var | Default | Note |
|---|---|---|
| `RATE_PER_MIN` | 5 | per-IP, KV TTL 60s |
| `DAILY_TOKEN_BUDGET` | ~200k tokens/day | hard global cap → fallback; sized to a few hundred answers |
| `HISTORY_WINDOW` | last 4 messages | bounds multi-turn cost |
| `TOP_K` | 5 | pgvector matches |
| `MAX_OUTPUT_TOKENS` | 400 | caps answer length/cost |

---

## 5. Build order (suggested for the new session)

1. Supabase project + `schema.sql`; author `knowledge/` markdown; `ingest.ts`; verify
   retrieval quality with a quick query script.
2. Worker skeleton + CORS + `POST /api/chat` returning a stubbed SSE stream.
3. Retrieval + prompt + streaming generation (end-to-end happy path).
4. Guardrails: Turnstile, rate-limit, daily budget + fallback (+ unit tests + eval set).
5. Deploy to `api.sergiocuellar.dev`; smoke-test.
6. Frontend: `AskPortfolio` section + `AIConsole` island + Turnstile + SSE parsing;
   wire to the live API; degrade gracefully; deploy the portfolio.
7. Tune the caps from real usage; update ULTRAPLAN §13 Phase 9 → complete.

> Recommended: in the new session, run the superpowers **writing-plans** skill on this spec
> to produce a phased implementation plan with TDD checkpoints before coding.
