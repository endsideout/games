import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "@playwright/test";

const profileStorageKey = "endsideout-player-profile";
const outputRoot =
  process.env.COPYRIGHT_OUTPUT_DIR ??
  join(process.cwd(), `copyright-deposit-${new Date().toISOString().slice(0, 10)}`);
const visualDir = join(outputRoot, "06_visual_samples");

const GAME_ROUTES = [
  "/sometimes-anytime-food",
  "/least-sugar-game",
  "/brain-health-game",
  "/water-glass-game",
  "/finish-race-game",
  "/habit-guard-game",
  "/body-image-game",
  "/principle-of-relationship-pair-matching-game",
  "/fruit-vegetable-matching-game",
  "/fruit-veggie-quiz",
  "/challenge-quiz",
  "/emotion-detective-game",
  "/environmental-wellbeing/eco-fix-it",
  "/environmental-wellbeing/planet-protector",
  "/budgeting-game",
  "/banking-word-search",
  "/study-habits-game",
  "/dream-job-builder",
  "/job-path-maze",
  "/skills-jobs-sort",
  "/healthy-plate",
  "/surya-namaskar",
];

async function seedProfile(page: import("@playwright/test").Page): Promise<void> {
  await page.addInitScript((storageKey) => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        name: "Jordan",
        grade: "4",
        teacherName: "Mr Chen",
        schoolName: "Riverside",
        school: "Riverside",
      }),
    );
  }, profileStorageKey);
}

test.describe("copyright visual samples", () => {
  test.beforeAll(() => {
    mkdirSync(visualDir, { recursive: true });
  });

  test("capture hub and set pages", async ({ page }) => {
    const hubRoutes = [
      { path: "/", name: "home" },
      { path: "/know-your-health", name: "know-your-health-hub" },
      { path: "/know-your-health/set-1", name: "know-your-health-set-1" },
      { path: "/know-your-health/module-1", name: "know-your-health-module-1" },
      { path: "/3d-wellness", name: "3d-wellness-hub" },
      { path: "/3d-wellness/set-1", name: "3d-wellness-set-1" },
      { path: "/financial-literacy", name: "financial-literacy-hub" },
    ];

    for (const route of hubRoutes) {
      await page.goto(route.path);
      await page.waitForTimeout(800);
      await page.screenshot({
        path: join(visualDir, `${route.name}__intro.png`),
        fullPage: true,
      });
    }
  });

  test("capture representative game screens", async ({ page }) => {
    await seedProfile(page);

    for (const route of GAME_ROUTES) {
      await page.goto(route);
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: join(
          visualDir,
          `${route.replace(/^\//, "").replaceAll("/", "__")}__intro.png`,
        ),
        fullPage: true,
      });
    }
  });
});
