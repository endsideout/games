# EndsideOut Games — VPAT Accessibility Checklist
**Product:** EndsideOut Games (endsideoutgames.netlify.app)  
**Date:** May 2026  
**Standard:** WCAG 2.0 / 2.1 / 2.2 — Level A & AA  

Use this file to audit your codebase against each criterion. Update the rating and notes column as you review.

---

## Table 1: Level A Criteria

| # | Criterion | Current Rating | What to look for in code | Your Notes |
|---|-----------|---------------|--------------------------|------------|
| 1.1.1 | Non-text Content | Partially Supports | All `<img>`, `<canvas>`, `<svg>`, icon buttons — do they have `alt`, `aria-label`, or `aria-labelledby`? Game elements with no text equivalent? | |
| 1.2.1 | Audio-only / Video-only (Prerecorded) | Not Applicable | Any `<audio>` or `<video>` tags with no visual counterpart? | |
| 1.2.2 | Captions (Prerecorded) | Not Applicable | Any `<video>` elements? Do they have `<track kind="captions">`? | |
| 1.2.3 | Audio Description or Media Alternative | Not Applicable | Any synchronized media (video + audio together)? | |
| 1.3.1 | Info and Relationships | Partially Supports | Are headings using `<h1>`–`<h6>` (not just styled `<div>`)? Are lists `<ul>`/`<ol>`? Are form fields wrapped in `<label>`? Are tables using `<th>` with `scope`? | |
| 1.3.2 | Meaningful Sequence | Partially Supports | Does DOM order match visual reading order? Check if CSS `order`, `position: absolute`, or `flex` reorders elements visually vs. DOM. | |
| 1.3.3 | Sensory Characteristics | Partially Supports | Any instructions like "click the red button" or "see the panel on the left"? Replace with non-visual cues. | |
| 1.4.1 | Use of Color | Partially Supports | Is color the ONLY way info is conveyed (e.g., red = error, green = correct)? Add icons, text, or patterns as additional indicators. | |
| 1.4.2 | Audio Control | Not Applicable | Any `<audio autoplay>` or background sounds? If yes, is there a stop/pause control within first 3 interactions? | |
| 2.1.1 | Keyboard | Partially Supports | Tab through the entire site. Can you reach every game button, link, and control? Are custom components (game tiles, drag targets) keyboard operable? Look for `tabindex`, `onkeydown`/`onkeyup` handlers on interactive elements. | |
| 2.1.2 | No Keyboard Trap | Partially Supports | Tab into modals, dialogs, game overlays — can you Tab back out without a mouse? Check focus management in modal open/close logic. | |
| 2.1.4 | Character Key Shortcuts | Not Applicable | Any `addEventListener('keypress')` or `hotkeys` library binding single letters? If yes, can they be remapped or disabled? | |
| 2.2.1 | Timing Adjustable | Partially Supports | Any game timers, session timeouts, or countdown elements? Is there a way to extend or turn off the time limit? | |
| 2.2.2 | Pause, Stop, Hide | Partially Supports | Any CSS animations (`animation`, `transition`) that loop? Any `setInterval` updating content? Add pause controls. | |
| 2.3.1 | Three Flashes or Below Threshold | Supports | Search for rapid `setInterval` toggling visibility or opacity more than 3x/sec. Confirm none exist. | |
| 2.4.1 | Bypass Blocks | Partially Supports | Is there a `<a href="#main-content">Skip to main content</a>` as the first focusable element? Is there a `<main id="main-content">` landmark? | |
| 2.4.2 | Page Titled | Supports | Check `<title>` tag in `<head>` of each page/route. Is it descriptive and unique per page? | |
| 2.4.3 | Focus Order | Partially Supports | Tab through pages — does focus move in a logical top-to-bottom, left-to-right order? Check for negative `tabindex` removing elements unexpectedly. | |
| 2.4.4 | Link Purpose (In Context) | Partially Supports | Any `<a>Read more</a>` or `<a>Click here</a>` links? Add `aria-label` or visible text that describes the destination. | |
| 2.5.1 | Pointer Gestures | Partially Supports | Any drag-and-drop game mechanics? Any swipe gestures? Is there a single-tap/click alternative for every multi-point gesture? | |
| 2.5.2 | Pointer Cancellation | Partially Supports | Are actions triggered on `mousedown`/`pointerdown` instead of `mouseup`/`click`? Move logic to `mouseup` or add abort-on-drag-away behavior. | |
| 2.5.3 | Label in Name | Partially Supports | Any button where visible text says "Play" but `aria-label` says something different? The accessible name must contain the visible label text. | |
| 2.5.4 | Motion Actuation | Not Applicable | Any `DeviceMotion` or `DeviceOrientation` event listeners? If yes, add a non-motion alternative. | |
| 3.1.1 | Language of Page | Supports | Check `<html lang="en">` is present on every page. | |
| 3.2.1 | On Focus | Partially Supports | Does focusing any element trigger a page change, form submit, or navigation? It shouldn't without user action. | |
| 3.2.2 | On Input | Partially Supports | Does changing a `<select>` or checkbox auto-navigate or submit? Warn users if it does. | |
| 3.3.1 | Error Identification | Partially Supports | Check form validation logic. Are errors shown as text (not just red border)? Do error messages identify which field failed? | |
| 3.3.2 | Labels or Instructions | Partially Supports | Every `<input>`, `<select>`, `<textarea>` — does it have a `<label>` or `aria-label`? Are required fields marked? | |
| 4.1.1 | Parsing | Partially Supports | Run HTML through [validator.w3.org](https://validator.w3.org). Fix duplicate IDs, unclosed tags, invalid nesting. | |
| 4.1.2 | Name, Role, Value | Partially Supports | Custom game components built with `<div>` or `<span>` — do they have `role`, `aria-label`, and `aria-pressed`/`aria-expanded` etc.? | |
| 4.1.3 | Status Messages | Partially Supports | Score updates, "Level complete!", error toasts — are they in an `aria-live="polite"` region so screen readers announce them? | |

---

## Table 2: Level AA Criteria

| # | Criterion | Current Rating | What to look for in code | Your Notes |
|---|-----------|---------------|--------------------------|------------|
| 1.2.4 | Captions (Live) | Not Applicable | Any live streaming video or audio? If yes, real-time captions needed. | |
| 1.2.5 | Audio Description (Prerecorded) | Not Applicable | Any videos where visual content isn't conveyed by audio? | |
| 1.3.4 | Orientation | Partially Supports | Any CSS `@media (orientation: portrait)` that hides or locks content? Remove orientation locks unless essential. | |
| 1.3.5 | Identify Input Purpose | Partially Supports | Do `<input>` fields for name, email, phone have `autocomplete="name"`, `autocomplete="email"`, etc.? | |
| 1.4.3 | Contrast (Minimum) | Partially Supports | Run site through [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker). Normal text needs 4.5:1, large text (18pt+) needs 3:1. Check game UI text especially. | |
| 1.4.4 | Resize Text | Partially Supports | Zoom browser to 200%. Does text reflow properly? Any text clipped or overlapping? Avoid `px` for font sizes — use `rem`/`em`. | |
| 1.4.5 | Images of Text | Partially Supports | Any game titles, score displays, or labels rendered as images (`<img>` of text)? Replace with CSS-styled HTML text. | |
| 1.4.10 | Reflow | Partially Supports | Resize browser to 320px wide. Does content scroll only vertically (no horizontal scroll)? Check game layouts for fixed-width containers. | |
| 1.4.11 | Non-text Contrast | Partially Supports | Game buttons, icons, input borders — do they have 3:1 contrast against their background? Check unfocused form field borders. | |
| 1.4.12 | Text Spacing | Partially Supports | Apply this bookmarklet test: line-height 1.5x, letter-spacing 0.12em, word-spacing 0.16em. Does text overflow or get clipped? Avoid fixed-height containers for text. | |
| 1.4.13 | Content on Hover or Focus | Partially Supports | Any tooltips or dropdowns on hover? Can the user move the mouse over them without them disappearing? Can they be dismissed with Escape? | |
| 2.4.5 | Multiple Ways | Partially Supports | Is there a site map, search bar, or breadcrumb navigation? Users need more than one way to find content. | |
| 2.4.6 | Headings and Labels | Partially Supports | Are heading levels logical (h1 → h2 → h3, no skipping)? Do form labels actually describe the expected input? | |
| 2.4.7 | Focus Visible | Partially Supports | Tab through site — is there always a visible focus ring? Check for `outline: none` or `outline: 0` in CSS and remove or replace with a custom visible focus style. | |
| 2.5.7 | Dragging Movements | Partially Supports | Any drag-to-sort, drag-to-play, or drag-to-match game mechanics? Provide a click/tap alternative (e.g., select then click target). | |
| 2.5.8 | Target Size (Minimum) | Partially Supports | Interactive elements (buttons, links, game tiles) should be at least 24×24 CSS pixels. Check small icon buttons and close/X buttons. | |
| 3.1.2 | Language of Parts | Partially Supports | Any foreign language phrases in content? Wrap with `<span lang="es">` etc. | |
| 3.2.3 | Consistent Navigation | Partially Supports | Does the nav menu appear in the same order on every page? Check header/footer across all routes. | |
| 3.2.4 | Consistent Identification | Partially Supports | Are the same icons/buttons labeled the same way everywhere? (e.g., don't call it "Start" on one page and "Play" on another for the same action.) | |
| 3.3.3 | Error Suggestion | Partially Supports | When a form field has an error, does the error message tell users HOW to fix it (not just "invalid input")? | |
| 3.3.4 | Error Prevention (Legal, Financial, Data) | Not Applicable | No legal/financial/data-deletion transactions present. | |
| 3.2.6 | Consistent Help | Partially Supports | If there's a help button or contact link, does it appear in the same location on every page? | |
| 3.3.7 | Redundant Entry | Partially Supports | Any multi-step flows where users re-enter the same data? Auto-populate previously entered values. | |
| 3.3.8 | Accessible Authentication (Minimum) | Partially Supports | Any login flow? Avoid CAPTCHAs that require cognitive tests with no alternative. Allow password managers (`autocomplete="current-password"`). | |

---

## Quick Code Search Commands

Run these in your codebase to find common issues fast:

```bash
# Missing alt text on images
grep -rn "<img" src/ | grep -v "alt="

# Outline none (kills focus visibility)
grep -rn "outline: none\|outline:none\|outline: 0" src/

# Missing lang attribute
grep -rn "<html" public/ | grep -v "lang="

# onClick without keyboard equivalent (divs/spans acting as buttons)
grep -rn "onClick" src/ | grep -v "<button\|<a\|<input"

# aria-live regions (check if status messages are announced)
grep -rn "aria-live" src/

# Skip link present?
grep -rn "skip\|#main" src/

# Autoplay audio/video
grep -rn "autoplay" src/

# Fixed height containers (can clip reflowed text)
grep -rn "height: [0-9]" src/styles/

# tabindex misuse (values > 0 cause focus order issues)
grep -rn "tabindex=[\"'][1-9]" src/
```

---

## Recommended Free Tools

| Tool | URL | What it checks |
|------|-----|----------------|
| WAVE | wave.webaim.org | Visual overlay of errors on live site |
| axe DevTools | Chrome extension | Maps issues to WCAG criteria |
| W3C Validator | validator.w3.org | HTML parsing errors (4.1.1) |
| Contrast Checker | webaim.org/resources/contrastchecker | Color contrast ratios |
| Lighthouse | Chrome DevTools → Lighthouse tab | Automated accessibility score |

---

*This checklist is based on VPAT 2.5 WCAG Edition. Update ratings in the Word doc version (EndsideOut_VPAT_2026.docx) after reviewing your codebase.*
