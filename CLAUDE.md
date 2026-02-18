# Blue Rose Signal — Claude Code Instructions

## What This Is
Personal creative portfolio site themed as the Blue Rose Division (fictional paranormal investigation agency). Next.js 16 app with a CRT/terminal aesthetic. Deployed on Vercel.

## Repo Structure
```
Blue-Rose-Signal/
├── blue-rose-signal-next/     ← The actual Next.js app (Vercel root dir)
│   ├── app/                   ← Pages (Next.js App Router)
│   ├── components/            ← Shared React components
│   ├── lib/                   ← Logic, types, data
│   ├── public/                ← Static assets (AudioWorklet processor)
│   └── vercel.json            ← Pins installCommand + framework for Vercel
├── HANDOVER.md
└── CLAUDE.md
```

## Git Workflow
- `dev` — working branch. Push here; Vercel auto-deploys to a preview URL.
- `main` — production. Merge from `dev` only after preview looks good.
- Never push directly to `main`.
- Remote uses SSH: `git@github.com:doc-tryphon/Blue-Rose-Signal.git`

## Vercel Setup
- Root Directory is set to `blue-rose-signal-next` in Vercel project settings.
- `vercel.json` inside `blue-rose-signal-next/` explicitly sets `installCommand` and `framework` to prevent Vercel from generating a broken install command.
- **`BACKEND_URL` env var** must be set in Vercel (Settings → Environment Variables) to the Hostinger VPS URL. Without it, the AEON chat fails silently in production (falls back to `localhost:8000`).

---

## Design System

The entire site uses a CRT amber terminal aesthetic. Consistency is critical — match existing pages before writing new UI.

### Colors
- **Primary:** `crt-amber` (`#ffcc00`) — defined in `tailwind.config.ts`
- Always use `crt-amber`, never `amber-500`
- Opacity variants: `text-crt-amber/60` for labels, `/40` for secondary, `/20` for backgrounds
- **Red** (`red-400` / `red-500`): danger controls, hot signals, active alerts only
- **Green** (`text-green-400`): ACTIVE/operational status indicators only
- **No gray text** — use `text-crt-amber/40` or `opacity-*` instead

### Shape
- **No rounded corners** on panels, cards, buttons, or badges — ever
- Exception: `rounded-full` only for literal dot/LED status indicators

### Typography
- Font: `font-vt323` everywhere
- Section labels: `text-xs uppercase tracking-wider text-crt-amber/60`
- Page titles: `text-2xl md:text-3xl font-bold leading-none tracking-wider`

### Standard Panel
```tsx
<div className="border border-crt-amber/30 p-3 bg-black/20">
  <div className="text-xs uppercase tracking-wider text-crt-amber/60 border-b border-crt-amber/20 pb-2">
    SECTION LABEL
  </div>
  {/* content */}
</div>
```

### Page Header (match AEON page)
```tsx
<div className="border-b-2 border-crt-amber/50 pb-4">
  <h1 className="text-2xl md:text-3xl font-bold leading-none tracking-wider">PAGE TITLE</h1>
  <div className="text-xs opacity-70 mt-1">SUBTITLE // STATUS</div>
</div>
```

### Navigation Bar (all content pages have this)
```tsx
<div className="flex flex-wrap gap-2 border-b border-crt-amber/30 pb-3">
  <Link href="/mainframe"
    className="px-3 py-1 uppercase tracking-wider text-sm border border-crt-amber/50 hover:bg-crt-amber hover:text-black transition-colors">
    ◄ MAINFRAME
  </Link>
  {/* other links */}
  <Link href="/"
    className="px-3 py-1 uppercase tracking-wider text-sm border border-crt-amber/30 text-crt-amber/50 hover:bg-crt-amber/20 hover:text-crt-amber transition-colors ml-auto">
    ◄ BOOT MENU
  </Link>
</div>
```

### Hover States
- Primary nav links: `hover:bg-crt-amber hover:text-black`
- Secondary/dimmer links: `hover:bg-crt-amber/20 hover:text-crt-amber`
- Active tab state (mainframe): `bg-crt-amber/20 text-crt-amber font-bold border-crt-amber shadow-[0_0_10px_rgba(255,204,0,0.15)]`

---

## Page Map

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Boot menu — terminal sequence, links to all modules |
| `/mainframe` | `app/mainframe/page.tsx` | Dashboard — case files, protocols, system status |
| `/mainframe/personnel/doc` | `app/mainframe/personnel/doc/page.tsx` | DOC operative dossier |
| `/case/[id]` | `app/case/[id]/page.tsx` | Dynamic case file viewer |
| `/spectrograph` | `app/spectrograph/page.tsx` | Web Audio synthesizer + visualizer |
| `/aeon` | `app/aeon/page.tsx` | AI chat interface (requires BACKEND_URL) |

## Key Components

| Component | Purpose |
|-----------|---------|
| `CRTMonitor` | Wraps all content pages. Provides TV cabinet, scanlines, vignette, voltage starvation effect. |
| `ChatInterface` | AEON chat UI, consumes `aeon-api.ts` |
| `FidelityMeter` | Signal integrity bar on AEON page |
| `ProtocolState` | Status indicator on AEON page |
| `AudioVisualizer` | Waveform + spectrogram canvases. Always rendered on spectrograph — shows standby (black) state when not playing. |
| `VUMeter` | Level meter canvas. Same always-rendered pattern. |

## AEON Backend Notes
- `/api/*` requests are proxied to `BACKEND_URL` via `next.config.js` rewrites
- `aeon-api.ts` handles session persistence (localStorage) and 404 retry logic
- Types in `aeon-types.ts`

## Data
- Case files and system protocols live in `lib/mainframe-data.ts`
- Audio presets in `lib/presets.ts`
- DSP math in `lib/dsp.ts`
- Synthesis engine in `lib/liveSynth.ts`
