import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { collectExportBundle } from "./collect.ts";
import { rowsToCsv } from "./csv.ts";
import { GAME_ROUTES } from "./routes.ts";

const outputDir = join(
  process.cwd(),
  `copyright-deposit-${new Date().toISOString().slice(0, 10)}`,
);

mkdirSync(outputDir, { recursive: true });
mkdirSync(join(outputDir, "06_visual_samples"), { recursive: true });

const bundle = collectExportBundle();
const commitHash = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
const generatedAt = new Date().toISOString();

writeFileSync(
  join(outputDir, "01_question_answer_bank.csv"),
  rowsToCsv(bundle.questionAnswer, [
    "content_id",
    "course",
    "module_or_dimension",
    "game_id",
    "game_title",
    "route",
    "sequence_index",
    "item_type",
    "prompt",
    "choices_json",
    "correct_answer",
    "category",
    "mode",
    "grade_band",
  ]),
);

writeFileSync(
  join(outputDir, "01_question_answer_bank.json"),
  JSON.stringify(bundle.questionAnswer, null, 2),
);

writeFileSync(
  join(outputDir, "02_feedback_rationale.csv"),
  rowsToCsv(bundle.feedback, [
    "content_id",
    "game_id",
    "route",
    "item_type",
    "prompt",
    "feedback_text",
    "feedback_kind",
  ]),
);

writeFileSync(
  join(outputDir, "03_organization_structure.json"),
  JSON.stringify(bundle.organization, null, 2),
);

const organizationMarkdown = [
  "# Organization Structure",
  "",
  `Generated: ${generatedAt}`,
  "",
  "## Game Routes",
  "",
  ...GAME_ROUTES.map(
    (route) =>
      `- ${route.game_title} (${route.route}) — ${route.course}, ${route.module_or_dimension}`,
  ),
  "",
  "## Set Sequences",
  "",
  "### Know Your Health Set 1",
  "",
  ...bundle.organization[0].children[0].children[0].children.map(
    (game) => `${game.sequence}. ${game.name} — ${game.route}`,
  ),
  "",
  "### 3D Wellness Set 1",
  "",
  ...bundle.organization[0].children[1].children[0].children.map(
    (game) => `${game.sequence}. ${game.name} — ${game.route}`,
  ),
].join("\n");

writeFileSync(join(outputDir, "03_organization_structure.md"), organizationMarkdown);

writeFileSync(
  join(outputDir, "04_narrative_content.csv"),
  rowsToCsv(bundle.narrative, [
    "content_id",
    "course",
    "game_id",
    "route",
    "narrative_kind",
    "text",
    "audio_path",
  ]),
);

writeFileSync(
  join(outputDir, "05_progression_scoring.csv"),
  rowsToCsv(bundle.progression, [
    "game_id",
    "game_title",
    "route",
    "course",
    "module_or_dimension",
    "set_name",
    "set_sequence",
    "game_duration_seconds",
    "points_correct",
    "scoring_notes",
    "progression_notes",
  ]),
);

const countsByGame = bundle.questionAnswer.reduce<Record<string, number>>((counts, row) => {
  counts[row.game_id] = (counts[row.game_id] ?? 0) + 1;
  return counts;
}, {});

const readme = [
  "# Copyright Deposit Content Package",
  "",
  `Generated at: ${generatedAt}`,
  `Repository commit: ${commitHash}`,
  "",
  "## Files",
  "",
  "- `01_question_answer_bank.csv` / `.json`",
  "- `02_feedback_rationale.csv`",
  "- `03_organization_structure.md` / `.json`",
  "- `04_narrative_content.csv`",
  "- `05_progression_scoring.csv`",
  "- `06_visual_samples/`",
  "",
  "## Row counts",
  "",
  `- Question & answer bank: ${bundle.questionAnswer.length}`,
  `- Feedback / rationale: ${bundle.feedback.length}`,
  `- Narrative content: ${bundle.narrative.length}`,
  `- Progression / scoring rows: ${bundle.progression.length}`,
  "",
  "## Question counts by game",
  "",
  ...Object.entries(countsByGame)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([gameId, count]) => `- ${gameId}: ${count}`),
  "",
  "## Notes for counsel",
  "",
  "- This package exports authored instructional content from the game repository, not gameplay analytics or student data.",
  "- Some sort-based games teach primarily through mascot introductions or generic UI feedback rather than per-item post-answer rationale.",
  "- Audio files referenced in `04_narrative_content.csv` live under `public/audio/` and were not bundled as binary transcripts.",
].join("\n");

writeFileSync(join(outputDir, "README_for_attorney.md"), readme);

console.log(`Wrote copyright deposit package to ${outputDir}`);
console.log(`Question rows: ${bundle.questionAnswer.length}`);
console.log(`Feedback rows: ${bundle.feedback.length}`);
console.log(`Narrative rows: ${bundle.narrative.length}`);
