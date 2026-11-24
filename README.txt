SPIKE LAB — CHANGES FOR THE endsideout/games REPO
=================================================
Prepared 24 November 2026. Branch point: origin/staging @ 416ed6c.

This folder mirrors the repo's own layout. Every file sits at the path it
belongs at, so you can copy the four top-level folders straight over a clone:

    public/   docs/   src/   tests/   vpat/   eslint.config.js

Verified before packaging, on a branch off staging:
    npm run lint        clean
    npm run build       passes
    npm run test:e2e    13 passed, 2 skipped  (6 of them new, for Spike Lab)
    axe-core 4.10.2     0 violations across 20 page states


TWO WAYS TO USE THIS
--------------------
A. Apply the patch (keeps authorship and comments tidy):

       git fetch origin
       git checkout -b spike-lab-v47 origin/staging
       git apply spike-lab-repo-changes.patch

   The patch covers everything EXCEPT the three binary/large static files,
   which git apply cannot carry. Copy those in by hand afterwards:

       public/spike-lab/index.html
       public/spike-lab/voice/hexi-en.mp3
       public/spike-lab/voice/hexi-en.json

B. Or just copy the folders over your clone and commit the result.

Either way you also need the OCR files, which are already on the existing
branch and are unchanged — they are not duplicated here because they are 11 MB:

       git checkout origin/spike-lab-staging -- public/spike-lab/ocr/


WHAT EACH FILE IS FOR
---------------------
public/spike-lab/index.html
    The lab itself, v47. Replaces the 625 KB v30-era file on the old branch.

public/spike-lab/voice/hexi-en.mp3, hexi-en.json
    Hexi's English voice: 52 clips in one sprite, 213 seconds. The page loads
    these by relative path, so they must stay in voice/ beside index.html.

public/spike-lab/THIRD-PARTY-NOTICES.txt
    New. The bundled Tesseract LICENSE.txt only names regenerator-runtime; it
    does not cover Tesseract.js, the trained data, or the two fonts. This file
    does. The repo LICENSE needs a clause pointing at it.

public/_headers
    New. Vite copies public/ without content hashes, so without these rules a
    browser that has loaded the lab once keeps serving the old build after every
    deploy — fixes reach us and never reach the classroom.

public/_redirects
    Adds /spike-lab and /spike-lab/ aliases above the existing SPA catch-all.

eslint.config.js
    Adds "public" to globalIgnores. Without this, npm run lint fails with 277
    errors from the four minified Tesseract bundles. This would have gone red in
    CI on the first push.

src/pages/courses/KnowYourHealth.tsx
    Adds a Labs section linking to the lab with a plain <a href>. It is NOT in
    SET1_GAMES: that list drives an ordered playlist with a game count and a
    "Play All" run, shown on three other pages, and Spike Lab is open-ended.
    The href names index.html deliberately — see the comment in the file.

src/components/RequirePlayerProfile.tsx
    *** NEEDS TEAM SIGN-OFF ***
    Excludes /accessibility and /game-content from the player-profile gate.
    That gate wraps the entire route table, so before this change a dietitian
    had to type a student name, grade, teacher and school to read the content
    registry, and a district the same to read the accessibility report. This
    changes behaviour on two existing routes that are not Spike Lab's.

src/pages/landing/ContentRegistryData.ts
    Registers Spike Lab's 56 food values (51 foods + 5 Candy Lab items) under a
    new "Labs" module, with a reviewNote stating plainly that these are relative
    0-10 weights, NOT grams, and that no serving size is defined anywhere in the
    app. Adds a NutritionRow type and a reviewNote field to Game.

src/pages/landing/ContentRegistry.tsx
    Renders the new table and the reviewNote callout at /game-content.

src/pages/landing/generateContentRegistry.ts
    Same for the "Download as Word" export. Without this, Spike Lab appeared in
    the downloaded doc as a heading with no table — a silent gap in exactly the
    document a reviewer would use.

src/components/Mascot/gameInstructions.ts
    Comment only. Records why static labs are deliberately absent: MascotWidget
    reads GAME_INSTRUCTIONS[location.pathname] from inside the router, so it
    never mounts on a separate static document. An entry would be dead code.

tests/e2e/spike-lab.spec.ts
    New. Six Depth 1 journeys. Does not assert the Events tab, whose name
    changes with the season.

vpat/EndsideOut_VPAT_Checklist.md
    Adds Appendix A for Spike Lab: what was tested and how, two failures found
    and fixed, and a "Not verified — do not claim these" list. Read that list
    before anyone quotes the clean axe run as conformance.


KNOWN, AND NOT FIXED HERE
-------------------------
1. The nutrition values have still not been reviewed by a dietitian. They are
   in front of children now. This is the one item worth holding main on.

2. Confirm the ElevenLabs plan permits redistributing generated audio in a
   public repo before this reaches production.

3. The repo LICENSE needs a third-party carve-out pointing at
   THIRD-PARTY-NOTICES.txt.

4. npx tsc --noEmit reports 5 errors on clean staging, all under
   src/pages/admin/dashboard/. None are from these changes, but somebody
   should know.

5. Nothing here has run on real hardware. No Chromebook, no phone. The camera
   in "Snap a label" and Web Audio on iOS are the two things most likely to
   behave differently, and neither can be emulated.
