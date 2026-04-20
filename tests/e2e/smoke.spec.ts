import { expect, test } from "@playwright/test";

const profileStorageKey = "endsideout-player-profile";

test.describe("Depth 1 smoke journeys", () => {
  test("home renders key navigation options", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "EndsideOut Games" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /3d wellness/i })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /know your health/i })
    ).toBeVisible();
  });

  test("can navigate from home to 3D wellness", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /3d wellness/i }).click();
    await expect(page).toHaveURL(/\/3d-wellness$/);
    await expect(
      page.getByRole("heading", { name: /3d wellness dimensions/i })
    ).toBeVisible();
  });

  test("direct game route redirects to player info when profile is missing", async ({
    page,
  }) => {
    await page.goto("/least-sugar-game");
    await expect(page).toHaveURL(/\/player-info\?returnTo=%2Fleast-sugar-game/);
    await expect(
      page.getByRole("heading", { name: /before you start/i })
    ).toBeVisible();
  });

  test("player info submit returns to the target game", async ({ page }) => {
    await page.goto("/least-sugar-game");
    await page.getByRole("textbox", { name: /student name/i }).fill("Maya");
    await page.getByRole("combobox", { name: /grade/i }).selectOption("5");
    await page.getByRole("textbox", { name: /teacher name/i }).fill("Ms Parker");
    await page.getByRole("textbox", { name: /school name/i }).fill("WHES");
    await page.getByRole("button", { name: /continue to game/i }).click();

    await expect(page).toHaveURL(/\/least-sugar-game$/);
    await expect(
      page.getByRole("heading", { name: /added vs. natural sugar/i })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /let's go!/i })).toBeVisible();
  });

  test("existing local profile bypasses gate", async ({ page }) => {
    await page.addInitScript((storageKey) => {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          name: "Jordan",
          grade: "4",
          teacherName: "Mr Chen",
          schoolName: "Riverside",
          school: "Riverside",
        })
      );
    }, profileStorageKey);

    await page.goto("/least-sugar-game");
    await expect(page).toHaveURL(/\/least-sugar-game$/);
    await expect(
      page.getByRole("heading", { name: /added vs. natural sugar/i })
    ).toBeVisible();
  });

  test("invalid returnTo in player info falls back to home", async ({ page }) => {
    await page.goto("/player-info?returnTo=//evil.example");
    await page.getByRole("textbox", { name: /student name/i }).fill("Nina");
    await page.getByRole("combobox", { name: /grade/i }).selectOption("6");
    await page.getByRole("textbox", { name: /teacher name/i }).fill("Ms Bell");
    await page.getByRole("textbox", { name: /school name/i }).fill("Northview");
    await page.getByRole("button", { name: /continue to game/i }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", { name: /endsideout games/i })
    ).toBeVisible();
  });

  test("admin login route renders sign in controls", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(
      page.getByRole("heading", { name: /admin dashboard/i })
    ).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
});
