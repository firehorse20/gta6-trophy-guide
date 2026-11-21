# Vice City Trophy Guide — GTA VI (PS5)

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/firehorse20/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/firehorse20/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline trophy guide and tracker for **Grand Theft Auto VI** on PlayStation 5, built for the [make.fun bounty “Make GTA 6 Trophy Guide”](https://make.fun/bounty/gta6-trophy-guide-01) ($250, 50 places paid).

## What it is

- **All 55 official trophies** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze — with the official name, description and grade for each, exactly as published for the PS5 list.
- **A real guide for every trophy**, written in our own words, with its sources cited beside it. The list was cross-checked against the GTADB crosschecked PS5 list (updated 2026-11-18), PowerPyx's trophy roadmap, Sixshore's trophy list and eGamers' trophy list. No trophy names, descriptions or grades were invented.
- **Tracker**: tick trophies off, progress saves in the browser (localStorage), with export/import as JSON. Filters by grade, kind and status, plus text search.
- **Spoiler setting**: story trophies stay hidden until earned or until you switch spoilers on.
- **Platinum roadmap**: three phases — story, side strands & activities, clean-up & collections — plus the one possibly missable trophy, *Positive Mental Attitude* (a Chapter 1 meditation may count; keep a manual save before leaving Chapter 1).
- **Fully offline**: plain static files in `app/`, no network requests, no Rockstar logo, artwork or game screenshots. Open `app/index.html` in a desktop browser, or run `node serve.ts` and open http://localhost:8080.

## Layout

- `main.ts` — hands the entry in: copies `app/` and `screenshots/` to the output and writes `dossier.json` with the vendored `buildDossier` from `vendor/makefun-frontend.ts`.
- `app/index.html`, `app/app.js`, `app/style.css` — the guide and tracker.
- `app/data/trophies.json` — the 55 trophies with guides, sources, kinds, spoiler and missable flags.
- `screenshots/` — 4 real renders of the running app.

## Run it

```sh
node serve.ts          # app/ on http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # writes out/dossier.json
```

## License

MIT — see `LICENSE`.
