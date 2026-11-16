# Put Spike Lab on staging (endsideout/games)

These files add Spike Lab to the games site as a static folder. It will open at `/spike-lab/`.
Nothing existing is changed except one ignore line in `eslint.config.js` and one section in `docs/staging-game-links.md`.

## What's in `files/`

| Path (same place in the repository) | What it is |
|---|---|
| `public/spike-lab/index.html` | The Spike Lab app |
| `public/spike-lab/ocr/` | On-device label reader (6 files) |
| `eslint.config.js` | Same as main, plus `"public/spike-lab"` in the ignore list so CI lint passes |
| `docs/staging-game-links.md` | Same as main, plus a Spike Lab section |

## Steps on github.com (no command line)

1. Open https://github.com/endsideout/games
2. Click the **main** branch button, type `spike-lab-staging`, and choose **Create branch**.
3. On that branch: **Add file → Upload files**. Drag in the **contents of the `files` folder** (the `public` folder, the `docs` folder and `eslint.config.js`) so the folder structure is kept.
4. Commit message: `Add Spike Lab static prototype under /spike-lab/`. Commit to `spike-lab-staging`.
5. Click **Compare & pull request** and open the pull request into `main`.
6. Netlify adds a **Deploy Preview** link to the pull request (it runs in staging mode). Open `<preview link>/spike-lab/`.
7. After review, merging the pull request publishes it at `https://endsideoutgames.netlify.app/spike-lab/`.

If the team's staging site follows a specific branch instead of pull-request previews, ask which branch and upload there.

## Checked before packaging

- `npm run lint` and `npm run build` pass with these files added.
- In the built site, `/spike-lab/` loads, all six tabs work, and the label reader files load.
- The games home page still loads.
- Spike Lab does not use the player profile form or Firebase tracking.
