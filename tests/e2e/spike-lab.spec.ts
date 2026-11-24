/* © 2026 EndsideOut, Inc. All rights reserved. */
import { expect, test } from "@playwright/test";

/**
 * Spike Lab is served as a static page out of public/spike-lab/, not as a React
 * route, so it sits outside the router and outside RequirePlayerProfile. These
 * are the Depth 1 journeys for it: it opens, Hexi introduces himself and stays
 * reachable, every graph carries a caption, and the copyright notice is there.
 *
 * Deliberately not asserted: the Events tab. That lab is time-limited and its
 * name changes between events, so pinning it here would turn a content date
 * into a red build.
 */

// The file, not the directory: Vite's dev server answers "/spike-lab/" with
// the SPA shell, so the pretty URL would pass in production and fail in CI.
const LAB = "/spike-lab/index.html";
const profileStorageKey = "endsideout-player-profile";

test.describe("Spike Lab", () => {
  test("opens with no player profile", async ({ page }) => {
    // The rest of the site redirects to /player-info without one. This lab
    // collects nothing by design, so it must not. If this test starts failing,
    // something has put the lab behind the router.
    await page.goto(LAB);
    await expect(page).toHaveURL(/\/spike-lab\/index\.html$/);
    await expect(page.getByRole("heading", { name: "Spike Lab", level: 1 })).toBeVisible();
  });

  test("Hexi introduces himself, and stays reachable after the intro closes", async ({ page }) => {
    await page.goto(LAB);

    const welcome = page.getByRole("heading", { name: /Hi, I.m Hexi!/ });
    await expect(welcome).toBeVisible();

    // "Let's go" closes the card and starts the tour, which moves to Hexi's Day.
    await page.getByRole("button", { name: "Let's go" }).click();
    await expect(welcome).toBeHidden();

    // The way back in lives on Today.
    await page.getByRole("tab", { name: "Today" }).click();
    await page.getByRole("button", { name: "Meet Hexi" }).click();
    await expect(welcome).toBeVisible();
  });

  test("the ride graph carries a plain-language caption", async ({ page }) => {
    await page.goto(LAB);
    await page.getByRole("button", { name: "Let's go" }).click();
    await page.getByRole("tab", { name: /Hexi.s Day/ }).click();

    // The caption and the graph's accessible name come from the same sentence,
    // so a child who cannot read the graph and a screen reader get the same text.
    const caption = page.locator("#chart-cap");
    await expect(caption).not.toBeEmpty();
    await expect(page.locator("#chart")).toHaveAttribute("aria-label", /\S/);
  });

  test("choosing a meal changes what the caption says", async ({ page }) => {
    await page.goto(LAB);
    await page.getByRole("button", { name: "Let's go" }).click();
    await page.getByRole("tab", { name: /Hexi.s Day/ }).click();

    const caption = page.locator("#chart-cap");
    const before = (await caption.textContent())?.trim();
    await page.getByRole("button", { name: "Roti + dal" }).click();
    await expect(caption).not.toHaveText(before ?? "");
    await expect(caption).not.toBeEmpty();
  });

  test("shows the copyright notice", async ({ page }) => {
    await page.goto(LAB);
    await expect(page.locator(".sitefoot")).toContainText(
      "© 2026 EndsideOut, Inc. All rights reserved."
    );
  });

  test("is linked from Know Your Health with a plain anchor", async ({ page }) => {
    await page.addInitScript((storageKey) => {
      window.localStorage.setItem(storageKey, JSON.stringify({
        name: "Test User", grade: "3", teacherName: "Ms Test",
        schoolName: "Graceland Park", school: "Graceland Park",
      }));
    }, profileStorageKey);
    await page.goto("/know-your-health");

    // A react-router <Link> would be intercepted client-side and land on a blank
    // screen, because no route serves this path. It has to be a real anchor.
    const lab = page.getByRole("link", { name: /Spike Lab/ });
    await expect(lab).toHaveAttribute("href", LAB);

    await lab.click();
    await expect(page).toHaveURL(/\/spike-lab\/index\.html$/);
    await expect(page.getByRole("heading", { name: "Spike Lab", level: 1 })).toBeVisible();
  });
});
