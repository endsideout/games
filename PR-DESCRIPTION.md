Spike Lab v47: current build, Hexi's English voice, repo wiring

---

## What this is

Spike Lab was on neither `main` nor `staging`. PR #19 was never merged, and the
only copy was on the `spike-lab-staging` branch, where `index.html` was the
625 KB v30-era build with no `voice/` directory. This replaces it with the
current build and wires the lab into the repo properly.

Spike Lab is a single static page under `public/`, not a React route. That is
deliberate: it has no accounts, no tracking, and photos from the label scanner
never leave the device. It does not collect a player profile and does not report
to the classroom LMS, so it will not appear in the admin dashboard and produces
no `game_events`. If we want usage data from the pilot, that is a separate piece
of work and it conflicts with the no-tracking design — worth deciding before the
pilot rather than after.

## Contents

| | |
|---|---|
| `public/spike-lab/index.html` | The lab, v47 (655 KB) |
| `public/spike-lab/voice/` | Hexi's English voice — 52 clips in one sprite, 213 s (1.66 MB) |
| `public/spike-lab/ocr/` | Vendored Tesseract, unchanged from the old branch (11 MB) |
| `public/spike-lab/THIRD-PARTY-NOTICES.txt` | New — see below |
| `public/_headers` | New — cache rules for the unhashed static files |
| `public/_redirects` | Pretty-URL aliases above the existing SPA catch-all |
| `eslint.config.js` | Ignores `public/` |
| `src/pages/courses/KnowYourHealth.tsx` | New Labs section linking to the lab |
| `src/components/RequirePlayerProfile.tsx` | **Needs sign-off** — see below |
| `src/pages/landing/ContentRegistry*.ts(x)` | Registers the 56 food values |
| `src/components/Mascot/gameInstructions.ts` | Comment only |
| `tests/e2e/spike-lab.spec.ts` | New — six Depth 1 journeys |
| `vpat/EndsideOut_VPAT_Checklist.md` | New Appendix A for Spike Lab |

## Verified

- `npm run lint` — clean
- `npm run build` — passes
- `npm run test:e2e` — **13 passed, 2 skipped** (6 new)
- axe-core 4.10.2 — **0 violations** across 20 page states (5 tabs × 2 widths × light/dark)

Pre-existing and not touched here: `npx tsc --noEmit` reports 5 errors under
`src/pages/admin/dashboard/` on clean `staging`.

## Three things found while doing this

**1. ESLint would have failed CI immediately.** The four minified Tesseract
bundles produced 277 errors. `public/` is now in `globalIgnores`, which also
stops it recurring for any future static lab.

**2. `/spike-lab/` works in production and silently breaks in local dev.**
Netlify serves the directory form from the file; Vite's dev server answers it
with the SPA shell, which then redirects to `/player-info`. Shipped as-is, every
developer would have concluded the lab was broken. In-app links and the tests
name `index.html`; `_redirects` keeps the pretty URL working for links we hand
out.

**3. `public/` assets get no content hash from Vite**, so without `_headers` a
browser that had loaded the lab once would keep serving the stale build after
every deploy — fixes would reach us and never reach the classroom.

## Please review this bit specifically

`src/components/RequirePlayerProfile.tsx` now excludes `/accessibility` and
`/game-content` from the player-profile gate.

That gate wraps the **entire** route table, excluding only `/player-info` and
`/admin`. So before this change, a dietitian reviewing game content had to type
a student's name, grade, teacher and school to reach `/game-content`, and a
district reading our accessibility report had to do the same. Neither page is
gameplay and neither is for children.

This changes behaviour on two existing routes that are not Spike Lab's, so it is
the team's call. It can be dropped from this PR on its own; the cost is that the
content registry and the VPAT report stay unusable for the two audiences they
exist for.

## Also

`public/spike-lab/THIRD-PARTY-NOTICES.txt` is new because the bundled
`ocr/tesseract.min.js.LICENSE.txt` names only regenerator-runtime — it carries
neither Tesseract.js's Apache-2.0 notice, nor the trained-data licence, nor
anything about the two OFL fonts. **The repo `LICENSE` asserts "all rights
reserved" over the whole tree and needs a clause pointing at that file**, so the
OFL and Apache-2.0 components are not misrepresented as proprietary. The lab's
own notice also named "Inter", a font that is not in the page; the embedded
faces are Baloo 2 and Nunito. Corrected.

## Not done, and not claimed

- **The nutrition values have not been reviewed by a dietitian.** They are
  already in front of children in Big Meal Lab. `/game-content` now shows all 56
  of them with a note stating plainly that they are relative 0–10 weights, not
  grams, and that no serving size is defined anywhere in the app.
- **Nobody has confirmed the ElevenLabs plan permits redistributing generated
  audio in a public repo.** Worth settling before this reaches `main`.
- **Nothing has run on real hardware.** No Chromebook, no phone. The camera in
  "Snap a label" and Web Audio on iOS are the two things most likely to differ,
  and neither can be emulated. Appendix A of the VPAT lists this and the other
  unverified criteria — please read that list before anyone quotes the clean axe
  run as conformance.
