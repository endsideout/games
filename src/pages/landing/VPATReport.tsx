import React from "react";
import { Link } from "react-router-dom";

const BRAND   = "#005d5b";
const BRAND_L = "#e6f3f3";
const WCAG    = "https://www.w3.org/TR/WCAG22/";

const META = {
  product: "EndsideOut Games Platform",
  version: "v1.0",
  date:    "May 2026",
  contact: "info@endsideout.org",

  description:
    "EndsideOut Games is a web-based interactive health-education platform serving K–12 students. " +
    "It provides 22 curriculum-aligned mini-games organized across three course tracks: Know Your Health, " +
    "covering nutrition, hydration, brain health, physical activity, and body image; the 7 Dimensions of " +
    "Wellbeing, encompassing social, emotional, environmental, intellectual, occupational, physical, and " +
    "spiritual health; and Financial Literacy. Game interactions include multiple-choice selection, " +
    "drag-and-drop sorting, and fill-in-the-blank mechanics. The platform includes text-to-speech " +
    "voiceovers, animated characters, and real-time progress tracking stored via Firebase Firestore. " +
    "It is deployed on Netlify and integrates with the Thinkific learning management system.",

  evalMethods:
    "Evaluation was conducted by the product engineering team through manual source-code review of all " +
    "game React components against each applicable WCAG 2.x success criterion. Automated accessibility " +
    "checks were performed using the Storybook Accessibility Addon (axe-core ruleset) during component " +
    "development. Keyboard-only navigation was tested in Chrome 124 and Safari 17. Semantic structure " +
    "and ARIA role verification were performed using macOS VoiceOver and the Chrome Accessibility Tree " +
    "inspector. Colour contrast was evaluated using the Chrome DevTools contrast checker. All testers " +
    "had full working knowledge of the product's functionality and interaction flows.",

  notes:
    "This report reflects the accessibility state of the platform as of the report date. A number of " +
    "criteria are not currently met; these are identified and described honestly below. EndsideOut has " +
    "initiated an accessibility remediation roadmap with the goal of achieving WCAG 2.2 Level AA " +
    "conformance. This document will be revised as remediation milestones are completed.",
};

type Level =
  | "Supports"
  | "Partially Supports"
  | "Does Not Support"
  | "Not Applicable"
  | "Not Evaluated";

interface Criterion {
  id:      string;
  label:   string;
  anchor:  string;
  badge?:  string;
  level:   Level;
  remarks: string;
}

const LEVEL_STYLE: Record<Level, { color: string; bg: string; border: string }> = {
  "Supports":           { color: "#14532d", bg: "#f0fdf4", border: "#86efac" },
  "Partially Supports": { color: "#78350f", bg: "#fffbeb", border: "#fcd34d" },
  "Does Not Support":   { color: "#7f1d1d", bg: "#fef2f2", border: "#fca5a5" },
  "Not Applicable":     { color: "#374151", bg: "#f9fafb", border: "#d1d5db" },
  "Not Evaluated":      { color: "#374151", bg: "#f9fafb", border: "#d1d5db" },
};

const LEVEL_A: Criterion[] = [
  {
    id: "1.1.1", label: "Non-text Content", anchor: "#text-equiv-all", badge: "Level A",
    level: "Does Not Support",
    remarks:
      "SVG game characters, including the FlameMan character and the 3D mascot widget, are " +
      "rendered without a role of img or an accessible label. Emoji characters that serve as " +
      "primary game content, such as food items and activity icons, have no text alternative. " +
      "Inline SVG illustrations added for specific game scenarios contain no accessible name " +
      "or description. The application logo is missing an alt attribute.",
  },
  {
    id: "1.2.1", label: "Audio-only and Video-only (Prerecorded)", anchor: "#audio-only-and-video-only-prerecorded", badge: "Level A",
    level: "Not Applicable",
    remarks: "The platform does not contain standalone prerecorded audio-only or video-only content.",
  },
  {
    id: "1.2.2", label: "Captions (Prerecorded)", anchor: "#captions-prerecorded", badge: "Level A",
    level: "Does Not Support",
    remarks:
      "Prerecorded instruction audio clips, which run up to approximately 30 seconds in length, " +
      "play without a synchronized caption track, a transcript, or any on-screen text equivalent " +
      "timed to the audio. Static instructional text displayed on screen is not a substitute for " +
      "synchronized captions.",
  },
  {
    id: "1.2.3", label: "Audio Description or Media Alternative (Prerecorded)", anchor: "#audio-description-or-media-alternative-prerecorded", badge: "Level A",
    level: "Not Applicable",
    remarks: "The platform does not use prerecorded synchronized video content.",
  },
  {
    id: "1.3.1", label: "Info and Relationships", anchor: "#info-and-relationships", badge: "Level A",
    level: "Does Not Support",
    remarks:
      "Game choice cards are implemented as div elements with click event handlers. They carry " +
      "no ARIA role, no accessible name, and no grouping relationship that communicates their " +
      "purpose to assistive technology. Score badges and countdown timers are conveyed visually " +
      "through icons and numbers without corresponding semantic markup. The application uses no " +
      "ARIA landmark regions. Correct and incorrect answer states are communicated through colour " +
      "and text labels only, with no ARIA state attributes such as aria-pressed or aria-selected.",
  },
  {
    id: "1.3.2", label: "Meaningful Sequence", anchor: "#meaningful-sequence", badge: "Level A",
    level: "Supports",
    remarks: "Content is presented in a DOM order that matches the intended reading sequence.",
  },
  {
    id: "1.3.3", label: "Sensory Characteristics", anchor: "#sensory-characteristics", badge: "Level A",
    level: "Does Not Support",
    remarks:
      "The text-to-speech instruction for the SometimesAnytimeGame directs users to drag food " +
      "items to the green side or the red side, identifying targets by colour alone. The " +
      "HabitGuardGame similarly describes its interaction using directional and colour-only " +
      "references. Neither game provides a colour-independent means of identifying the correct " +
      "drop zone.",
  },
  {
    id: "1.4.1", label: "Use of Color", anchor: "#use-of-color", badge: "Level A",
    level: "Partially Supports",
    remarks:
      "In choice-based games, correct and incorrect feedback is indicated by colour paired with " +
      "text labels and icons, satisfying the criterion for those interactions. However, the " +
      "countdown timer changes colour from green to amber to red as time decreases, with no " +
      "non-colour indicator of urgency.",
  },
  {
    id: "1.4.2", label: "Audio Control", anchor: "#audio-control", badge: "Level A",
    level: "Does Not Support",
    remarks:
      "Instruction audio clips and browser text-to-speech voiceovers begin automatically on " +
      "route change and at game launch. No mechanism is provided to pause, stop, or independently " +
      "adjust the volume of this audio relative to the overall system volume. The Help button in " +
      "the mascot widget can replay audio but cannot pause or stop a clip that is currently playing.",
  },
  {
    id: "2.1.1", label: "Keyboard", anchor: "#keyboard", badge: "Level A",
    level: "Does Not Support",
    remarks:
      "Game choice cards are div elements without a tabIndex attribute or button role, making " +
      "them unreachable and non-activatable via keyboard. The HabitGuardGame and " +
      "SometimesAnytimeGame rely exclusively on mouse drag events with no keyboard-operable " +
      "alternative. The three-dimensional mascot canvas may intercept pointer events in ways " +
      "that interfere with keyboard focus.",
  },
  {
    id: "2.1.2", label: "No Keyboard Trap", anchor: "#no-keyboard-trap", badge: "Level A",
    level: "Supports",
    remarks: "No modal dialogs or custom focus traps are implemented. Keyboard users can navigate freely between elements.",
  },
  {
    id: "2.1.4", label: "Character Key Shortcuts", anchor: "#character-key-shortcuts", badge: "Level A — 2.1 and 2.2",
    level: "Not Applicable",
    remarks: "The platform does not implement single-character keyboard shortcuts.",
  },
  {
    id: "2.2.1", label: "Timing Adjustable", anchor: "#timing-adjustable", badge: "Level A",
    level: "Does Not Support",
    remarks:
      "Game sessions include countdown timers ranging from 60 to 120 seconds. The platform " +
      "provides no mechanism to turn off, adjust, or extend the time limit before it expires, " +
      "and no untimed game mode is available.",
  },
  {
    id: "2.2.2", label: "Pause, Stop, Hide", anchor: "#pause-stop-hide", badge: "Level A",
    level: "Supports",
    remarks:
      "The platform contains no moving, blinking, scrolling, or auto-updating content other " +
      "than the countdown timer. The timer qualifies under the essential-activity exception, " +
      "as the timed game mechanic cannot function without it. CSS transitions use smooth easing " +
      "with durations well below the flash threshold.",
  },
  {
    id: "2.3.1", label: "Three Flashes or Below Threshold", anchor: "#three-flashes-or-below-threshold", badge: "Level A",
    level: "Supports",
    remarks: "The platform contains no flashing or strobing content.",
  },
  {
    id: "2.4.1", label: "Bypass Blocks", anchor: "#bypass-blocks", badge: "Level A",
    level: "Does Not Support",
    remarks:
      "No skip navigation links are provided. The logo, exit link, score badge, and timer bar " +
      "are repeated on every game screen without a mechanism for users to bypass them.",
  },
  {
    id: "2.4.2", label: "Page Titled", anchor: "#page-titled", badge: "Level A",
    level: "Partially Supports",
    remarks:
      "The HTML document carries the static title \"EndsideOut Games,\" which does not change " +
      "per route. All 22 game pages share this same generic title; individual game names are " +
      "never reflected in document.title.",
  },
  {
    id: "2.4.3", label: "Focus Order", anchor: "#focus-order", badge: "Level A",
    level: "Does Not Support",
    remarks:
      "Game choice cards are div elements without a tabIndex attribute and cannot receive " +
      "keyboard focus. No programmatic focus management is applied during game-phase transitions, " +
      "such as moving focus to the result screen heading after a game ends or to feedback " +
      "content after an answer is selected.",
  },
  {
    id: "2.4.4", label: "Link Purpose (In Context)", anchor: "#link-purpose-in-context", badge: "Level A",
    level: "Supports",
    remarks:
      "All navigation links use descriptive visible text, including \"Back to Set 1\", \"Exit\", " +
      "\"Play Again\", and \"See Results\". No ambiguous link text is present.",
  },
  {
    id: "2.5.1", label: "Pointer Gestures", anchor: "#pointer-gestures", badge: "Level A — 2.1 and 2.2",
    level: "Does Not Support",
    remarks:
      "The HabitGuardGame and SometimesAnytimeGame require a path-based drag gesture to place " +
      "items. No single-point tap or click alternative is available to complete these interactions.",
  },
  {
    id: "2.5.2", label: "Pointer Cancellation", anchor: "#pointer-cancellation", badge: "Level A — 2.1 and 2.2",
    level: "Supports",
    remarks:
      "Game selections in choice-based games are triggered on pointer-up. Releasing the pointer " +
      "outside a target before the up-event cancels the action. No irreversible function is " +
      "triggered on the down-event.",
  },
  {
    id: "2.5.3", label: "Label in Name", anchor: "#label-in-name", badge: "Level A — 2.1 and 2.2",
    level: "Does Not Support",
    remarks:
      "Game choice cards display visible text such as \"Talk to a Friend\" but are implemented " +
      "as div elements with no accessible name. The mascot Help button and audio replay controls " +
      "are icon-only elements with no aria-label that would provide an accessible name matching " +
      "a visible label.",
  },
  {
    id: "2.5.4", label: "Motion Actuation", anchor: "#motion-actuation", badge: "Level A — 2.1 and 2.2",
    level: "Not Applicable",
    remarks: "No functionality is triggered by device motion or user motion.",
  },
  {
    id: "3.1.1", label: "Language of Page", anchor: "#language-of-page", badge: "Level A",
    level: "Supports",
    remarks: "The root HTML element sets lang=\"en\" in the application's index.html file.",
  },
  {
    id: "3.2.1", label: "On Focus", anchor: "#on-focus", badge: "Level A",
    level: "Supports",
    remarks: "No unexpected context changes occur when any element receives focus.",
  },
  {
    id: "3.2.2", label: "On Input", anchor: "#on-input", badge: "Level A",
    level: "Supports",
    remarks: "The player profile form does not trigger page navigation or context changes on input.",
  },
  {
    id: "3.2.6", label: "Consistent Help", anchor: "#consistent-help", badge: "Level A — 2.2 only",
    level: "Supports",
    remarks:
      "The mascot widget Help button appears in a consistent position on every game screen and " +
      "provides audio instruction replay.",
  },
  {
    id: "3.3.1", label: "Error Identification", anchor: "#error-identification", badge: "Level A",
    level: "Partially Supports",
    remarks:
      "Incorrect game answers are accompanied by explanatory text feedback. The player profile " +
      "form displays visual validation indicators, but form errors are not programmatically " +
      "identified or associated with their respective input fields.",
  },
  {
    id: "3.3.2", label: "Labels or Instructions", anchor: "#labels-or-instructions", badge: "Level A",
    level: "Partially Supports",
    remarks:
      "Game instructions are provided visually and through text-to-speech at game launch. The " +
      "player profile form includes visible field labels; however, programmatic for/id " +
      "associations are not confirmed for all fields, and required fields are not identified " +
      "programmatically.",
  },
  {
    id: "3.3.7", label: "Redundant Entry", anchor: "#redundant-entry", badge: "Level A — 2.2 only",
    level: "Supports",
    remarks:
      "Player profile information, including name, grade, teacher, and school, is stored in " +
      "localStorage and is not requested again during a session.",
  },
  {
    id: "4.1.1", label: "Parsing", anchor: "#parsing", badge: "Level A",
    level: "Supports",
    remarks:
      "React 19 produces valid HTML5 markup. Per the WCAG 2.0 and 2.1 September 2023 editorial " +
      "errata, this criterion is considered satisfied when markup is valid.",
  },
  {
    id: "4.1.2", label: "Name, Role, Value", anchor: "#name-role-value", badge: "Level A",
    level: "Does Not Support",
    remarks:
      "Game choice cards are div elements with no ARIA role, no accessible name, and no state " +
      "attributes. Score badges and countdown timers are conveyed visually only, with no " +
      "programmatic label. Drag-and-drop target zones in the HabitGuardGame and " +
      "SometimesAnytimeGame carry no ARIA drag-and-drop roles.",
  },
];

const LEVEL_AA: Criterion[] = [
  {
    id: "1.2.4", label: "Captions (Live)", anchor: "#captions-live", badge: "Level AA",
    level: "Not Applicable",
    remarks: "The platform does not include live audio or video streaming.",
  },
  {
    id: "1.2.5", label: "Audio Description (Prerecorded)", anchor: "#audio-description-prerecorded", badge: "Level AA",
    level: "Not Applicable",
    remarks: "The platform does not use prerecorded synchronized video content.",
  },
  {
    id: "1.3.4", label: "Orientation", anchor: "#orientation", badge: "Level AA — 2.1 and 2.2",
    level: "Supports",
    remarks:
      "Game layouts use responsive CSS utilities and adapt to both portrait and landscape " +
      "orientations without restricting display to a single orientation.",
  },
  {
    id: "1.3.5", label: "Identify Input Purpose", anchor: "#identify-input-purpose", badge: "Level AA — 2.1 and 2.2",
    level: "Does Not Support",
    remarks:
      "The player profile form collects name, grade, teacher, and school information. Standard " +
      "HTML autocomplete attribute values are not set on any form field.",
  },
  {
    id: "1.4.3", label: "Contrast (Minimum)", anchor: "#contrast-minimum", badge: "Level AA",
    level: "Partially Supports",
    remarks:
      "White text on the primary deep-blue and purple gradient backgrounds generally meets the " +
      "4.5:1 minimum contrast ratio for normal text. Translucent text elements, including hint " +
      "labels at approximately 35% opacity and sub-labels at approximately 55% opacity, do not " +
      "meet the minimum ratio against their semi-transparent card backgrounds.",
  },
  {
    id: "1.4.4", label: "Resize text", anchor: "#resize-text", badge: "Level AA",
    level: "Supports",
    remarks:
      "Text is sized using relative units. Content reflows without loss of content or " +
      "functionality when browser text size is increased to 200%.",
  },
  {
    id: "1.4.5", label: "Images of Text", anchor: "#images-of-text", badge: "Level AA",
    level: "Supports",
    remarks: "All text is rendered as HTML text. The platform does not use images of text.",
  },
  {
    id: "1.4.10", label: "Reflow", anchor: "#reflow", badge: "Level AA — 2.1 and 2.2",
    level: "Does Not Support",
    remarks:
      "The 25%/75% split-panel layout used in the BrainHealthGame and FinishRaceGame does not " +
      "reflow to a single column at a 320-pixel viewport width. Users at that viewport width " +
      "must scroll horizontally to access both panels.",
  },
  {
    id: "1.4.11", label: "Non-text Contrast", anchor: "#non-text-contrast", badge: "Level AA — 2.1 and 2.2",
    level: "Does Not Support",
    remarks:
      "Game choice card borders use a low-opacity white value against a dark gradient " +
      "background, falling below the 3:1 minimum contrast ratio required for user interface " +
      "components. No visible focus indicators are present on any custom interactive element.",
  },
  {
    id: "1.4.12", label: "Text Spacing", anchor: "#text-spacing", badge: "Level AA — 2.1 and 2.2",
    level: "Supports",
    remarks:
      "No inline CSS properties prevent text-spacing adjustments. Content remains functional " +
      "when letter-spacing, word-spacing, line-height, and paragraph spacing are overridden " +
      "by a user stylesheet.",
  },
  {
    id: "1.4.13", label: "Content on Hover or Focus", anchor: "#content-on-hover-or-focus", badge: "Level AA — 2.1 and 2.2",
    level: "Not Applicable",
    remarks: "The platform does not present content that appears exclusively on hover or focus.",
  },
  {
    id: "2.4.5", label: "Multiple Ways", anchor: "#multiple-ways", badge: "Level AA",
    level: "Does Not Support",
    remarks:
      "Games are accessible only via their specific module overview pages or direct URLs. The " +
      "platform provides no site-wide search, site map, or navigable content index.",
  },
  {
    id: "2.4.6", label: "Headings and Labels", anchor: "#headings-and-labels", badge: "Level AA",
    level: "Partially Supports",
    remarks:
      "Each game page includes an h1 heading. ARIA landmark regions are not used, and " +
      "programmatic labels are absent for several form fields and interactive sections.",
  },
  {
    id: "2.4.7", label: "Focus Visible", anchor: "#focus-visible", badge: "Level AA",
    level: "Does Not Support",
    remarks:
      "Default focus outlines are suppressed on several elements through CSS. Game choice cards, " +
      "implemented as div elements, cannot receive keyboard focus. No custom focus-visible styles " +
      "have been added to interactive components.",
  },
  {
    id: "2.4.11", label: "Focus Not Obscured (Minimum)", anchor: "#focus-not-obscured-minimum", badge: "Level AA — 2.2 only",
    level: "Partially Supports",
    remarks:
      "The mascot widget floating overlay occupies the bottom-right corner of the viewport and " +
      "may partially obscure focused elements positioned in that area.",
  },
  {
    id: "2.5.7", label: "Dragging Movements", anchor: "#dragging-movements", badge: "Level AA — 2.2 only",
    level: "Does Not Support",
    remarks:
      "The HabitGuardGame and SometimesAnytimeGame require a mouse drag operation to sort items. " +
      "No single-pointer click or tap alternative is provided.",
  },
  {
    id: "2.5.8", label: "Target Size (Minimum)", anchor: "#target-size-minimum", badge: "Level AA — 2.2 only",
    level: "Supports",
    remarks:
      "Game choice panels and primary action buttons substantially exceed the 24 by 24 pixel " +
      "minimum target size.",
  },
  {
    id: "3.1.2", label: "Language of Parts", anchor: "#language-of-parts", badge: "Level AA",
    level: "Not Applicable",
    remarks: "The platform is English-only and contains no passages in other languages.",
  },
  {
    id: "3.2.3", label: "Consistent Navigation", anchor: "#consistent-navigation", badge: "Level AA",
    level: "Supports",
    remarks:
      "Navigation elements, including back links, exit links, the logo, the score badge, and " +
      "the timer, appear in the same relative order across all game and module screens.",
  },
  {
    id: "3.2.4", label: "Consistent Identification", anchor: "#consistent-identification", badge: "Level AA",
    level: "Supports",
    remarks:
      "Components that perform the same function, such as the score badge, timer, mascot Help " +
      "button, and back link, are identified consistently across all screens.",
  },
  {
    id: "3.3.3", label: "Error Suggestion", anchor: "#error-suggestion", badge: "Level AA",
    level: "Partially Supports",
    remarks:
      "Incorrect game answers are accompanied by a text explanation of the correct choice. The " +
      "player profile form does not provide specific suggestions to help users correct invalid inputs.",
  },
  {
    id: "3.3.4", label: "Error Prevention (Legal, Financial, Data)", anchor: "#error-prevention-legal-financial-data", badge: "Level AA",
    level: "Not Applicable",
    remarks: "The platform does not involve legal, financial, or irreversible data submission.",
  },
  {
    id: "3.3.8", label: "Accessible Authentication (Minimum)", anchor: "#accessible-authentication-minimum", badge: "Level AA — 2.2 only",
    level: "Supports",
    remarks:
      "The player profile form requires only name and grade entry and imposes no cognitive " +
      "function test. The admin login uses standard email and password without a CAPTCHA.",
  },
  {
    id: "4.1.3", label: "Status Messages", anchor: "#status-messages", badge: "Level AA — 2.1 and 2.2",
    level: "Does Not Support",
    remarks:
      "Score updates, correct and incorrect feedback banners, level-up notifications, and game " +
      "result screens are rendered visually without aria-live region announcements. Users of " +
      "screen readers receive no programmatic notification of game state changes.",
  },
];

const LEVEL_AAA: Criterion[] = [
  {
    id: "1.2.6", label: "Sign Language (Prerecorded)", anchor: "#sign-language-prerecorded", badge: "Level AAA",
    level: "Does Not Support",
    remarks: "No sign language interpretation is provided for audio content.",
  },
  {
    id: "1.2.7", label: "Extended Audio Description (Prerecorded)", anchor: "#extended-audio-description-prerecorded", badge: "Level AAA",
    level: "Not Applicable",
    remarks: "The platform does not use prerecorded synchronized video content.",
  },
  {
    id: "1.2.8", label: "Media Alternative (Prerecorded)", anchor: "#media-alternative-prerecorded", badge: "Level AAA",
    level: "Not Applicable",
    remarks: "The platform does not use prerecorded video content.",
  },
  {
    id: "1.2.9", label: "Audio-only (Live)", anchor: "#audio-only-live", badge: "Level AAA",
    level: "Not Applicable",
    remarks: "The platform does not stream live audio content.",
  },
  {
    id: "1.3.6", label: "Identify Purpose", anchor: "#identify-purpose", badge: "Level AAA — 2.1 and 2.2",
    level: "Not Evaluated",
    remarks: "This criterion was not evaluated in the current report cycle.",
  },
  {
    id: "1.4.6", label: "Contrast (Enhanced)", anchor: "#contrast-enhanced", badge: "Level AAA",
    level: "Not Evaluated",
    remarks: "A comprehensive enhanced contrast audit has not been completed.",
  },
  {
    id: "1.4.7", label: "Low or No Background Audio", anchor: "#low-or-no-background-audio", badge: "Level AAA",
    level: "Supports",
    remarks:
      "Text-to-speech voiceovers are delivered without background audio. Sound effects are " +
      "brief and do not play concurrently with speech.",
  },
  {
    id: "1.4.8", label: "Visual Presentation", anchor: "#visual-presentation", badge: "Level AAA",
    level: "Not Evaluated",
    remarks: "This criterion was not evaluated in the current report cycle.",
  },
  {
    id: "1.4.9", label: "Images of Text (No Exception)", anchor: "#images-of-text-no-exception", badge: "Level AAA",
    level: "Supports",
    remarks: "The platform does not use images of text.",
  },
  {
    id: "2.1.3", label: "Keyboard (No Exception)", anchor: "#keyboard-no-exception", badge: "Level AAA",
    level: "Does Not Support",
    remarks:
      "Drag-and-drop games have no keyboard alternative. Full keyboard operability without " +
      "exception is not achieved. Refer to criterion 2.1.1 for detail.",
  },
  {
    id: "2.2.3", label: "No Timing", anchor: "#no-timing", badge: "Level AAA",
    level: "Does Not Support",
    remarks:
      "All game modes include countdown timers as a core mechanic. No untimed game mode " +
      "is available.",
  },
  {
    id: "2.2.4", label: "Interruptions", anchor: "#interruptions", badge: "Level AAA",
    level: "Not Evaluated",
    remarks: "This criterion was not evaluated in the current report cycle.",
  },
  {
    id: "2.2.5", label: "Re-authenticating", anchor: "#re-authenticating", badge: "Level AAA",
    level: "Not Applicable",
    remarks: "The platform does not implement session timeouts that require re-authentication.",
  },
  {
    id: "2.2.6", label: "Timeouts", anchor: "#timeouts", badge: "Level AAA — 2.1 and 2.2",
    level: "Supports",
    remarks:
      "Game sessions do not expire due to inactivity. Firebase authentication sessions persist " +
      "without data loss.",
  },
  {
    id: "2.3.2", label: "Three Flashes", anchor: "#three-flashes", badge: "Level AAA",
    level: "Supports",
    remarks: "No content flashes more than three times per second.",
  },
  {
    id: "2.3.3", label: "Animation from Interactions", anchor: "#animation-from-interactions", badge: "Level AAA — 2.1 and 2.2",
    level: "Does Not Support",
    remarks:
      "CSS animations triggered by user interaction do not respond to the prefers-reduced-motion " +
      "media query. No reduced-motion alternative is implemented.",
  },
  {
    id: "2.4.8", label: "Location", anchor: "#location", badge: "Level AAA",
    level: "Partially Supports",
    remarks:
      "Module overview pages indicate which games belong to each module. The platform does not " +
      "provide breadcrumb navigation or a site-map location indicator.",
  },
  {
    id: "2.4.9", label: "Link Purpose (Link Only)", anchor: "#link-purpose-link-only", badge: "Level AAA",
    level: "Supports",
    remarks: "All links use descriptive visible text that conveys their purpose without requiring surrounding context.",
  },
  {
    id: "2.4.10", label: "Section Headings", anchor: "#section-headings", badge: "Level AAA",
    level: "Partially Supports",
    remarks:
      "Each game page uses an h1 heading. Multi-section game screens, such as the scenario " +
      "card, choice area, and feedback panel, do not use additional section-level headings.",
  },
  {
    id: "2.4.12", label: "Focus Not Obscured (Enhanced)", anchor: "#focus-not-obscured-enhanced", badge: "Level AAA — 2.2 only",
    level: "Not Evaluated",
    remarks: "This criterion was not evaluated in the current report cycle.",
  },
  {
    id: "2.4.13", label: "Focus Appearance", anchor: "#focus-appearance", badge: "Level AAA — 2.2 only",
    level: "Does Not Support",
    remarks:
      "No custom focus-visible styles meeting the minimum area, perimeter, and contrast " +
      "requirements have been implemented for interactive elements.",
  },
  {
    id: "2.5.5", label: "Target Size", anchor: "#target-size", badge: "Level AAA — 2.1 and 2.2",
    level: "Supports",
    remarks:
      "Game choice panels and primary action buttons substantially exceed the 44 by 44 pixel " +
      "enhanced target size requirement.",
  },
  {
    id: "2.5.6", label: "Concurrent Input Mechanisms", anchor: "#concurrent-input-mechanisms", badge: "Level AAA — 2.1 and 2.2",
    level: "Supports",
    remarks: "The platform supports touch and mouse pointer input simultaneously without restricting either.",
  },
  {
    id: "3.1.3", label: "Unusual Words", anchor: "#unusual-words", badge: "Level AAA",
    level: "Partially Supports",
    remarks:
      "Health terminology is explained in context through game feedback text and text-to-speech " +
      "narration. No dedicated glossary is available.",
  },
  {
    id: "3.1.4", label: "Abbreviations", anchor: "#abbreviations", badge: "Level AAA",
    level: "Not Applicable",
    remarks: "Game content does not use unexpanded abbreviations.",
  },
  {
    id: "3.1.5", label: "Reading Level", anchor: "#reading-level", badge: "Level AAA",
    level: "Supports",
    remarks:
      "Game content is written and validated at a Grade 3 to 4 reading level. Text-to-speech " +
      "pacing is set to approximately 120 words per minute, calibrated for the target age group.",
  },
  {
    id: "3.1.6", label: "Pronunciation", anchor: "#pronunciation", badge: "Level AAA",
    level: "Not Applicable",
    remarks: "Game content does not contain words with ambiguous pronunciation.",
  },
  {
    id: "3.2.5", label: "Change on Request", anchor: "#change-on-request", badge: "Level AAA",
    level: "Not Evaluated",
    remarks: "This criterion was not evaluated in the current report cycle.",
  },
  {
    id: "3.3.5", label: "Help", anchor: "#help", badge: "Level AAA",
    level: "Partially Supports",
    remarks:
      "The mascot widget provides instruction replay on all game screens. Step-by-step " +
      "contextual help for individual game interactions is not available.",
  },
  {
    id: "3.3.6", label: "Error Prevention (All)", anchor: "#error-prevention-all", badge: "Level AAA",
    level: "Partially Supports",
    remarks:
      "Game choices can be reviewed before a user advances to the next question. No data loss " +
      "results from an incorrect selection. The player profile form does not include a " +
      "confirmation step prior to submission.",
  },
  {
    id: "3.3.9", label: "Accessible Authentication (Enhanced)", anchor: "#accessible-authentication-enhanced", badge: "Level AAA — 2.2 only",
    level: "Supports",
    remarks: "No cognitive function tests are required for any authentication flow in the platform.",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: Level }) {
  const s = LEVEL_STYLE[level];
  return (
    <span style={{
      display:      "inline-block",
      padding:      "3px 10px",
      borderRadius: 99,
      fontSize:     "0.77rem",
      fontWeight:   700,
      fontFamily:   "sans-serif",
      color:        s.color,
      background:   s.bg,
      border:       `1px solid ${s.border}`,
      whiteSpace:   "nowrap",
    }}>
      {level}
    </span>
  );
}

function CriteriaTable({ criteria, tableNum, title }: {
  criteria:  Criterion[];
  tableNum:  number;
  title:     string;
}) {
  return (
    <section aria-labelledby={`t${tableNum}`} style={{ marginBottom: "3rem" }}>
      <h2
        id={`t${tableNum}`}
        style={{
          fontSize:     "1rem",
          fontWeight:   700,
          color:        "white",
          background:   BRAND,
          padding:      "10px 16px",
          margin:       0,
          borderRadius: "6px 6px 0 0",
          fontFamily:   "sans-serif",
        }}
      >
        Table {tableNum}: Success Criteria, {title}
      </h2>
      <div style={{ overflowX: "auto", border: "1px solid #d1d5db", borderTop: "none", borderRadius: "0 0 6px 6px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
          <thead>
            <tr style={{ background: "#f8fafa" }}>
              {(["Criteria", "Conformance Level", "Remarks and Explanations"] as const).map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  style={{
                    padding:       "10px 14px",
                    textAlign:     "left",
                    fontFamily:    "sans-serif",
                    fontWeight:    700,
                    borderBottom:  `2px solid ${BRAND}`,
                    color:         BRAND,
                    width:         i === 0 ? "34%" : i === 1 ? "18%" : undefined,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, i) => (
              <tr key={c.id} style={{ background: i % 2 === 0 ? "white" : BRAND_L, borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "10px 14px", verticalAlign: "top", lineHeight: 1.5 }}>
                  <a
                    href={`${WCAG}${c.anchor}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: BRAND, fontWeight: 700, textDecoration: "underline", fontFamily: "sans-serif" }}
                  >
                    {c.id} {c.label}
                  </a>
                  {c.badge && (
                    <span style={{ display: "block", fontSize: "0.72rem", color: "#6b7280", marginTop: 2, fontFamily: "sans-serif" }}>
                      ({c.badge})
                    </span>
                  )}
                </td>
                <td style={{ padding: "10px 14px", verticalAlign: "top" }}>
                  <LevelBadge level={c.level} />
                </td>
                <td style={{ padding: "10px 14px", verticalAlign: "top", lineHeight: 1.75, color: "#374151", fontFamily: "sans-serif" }}>
                  {c.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function VPATReport(): React.JSX.Element {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          a[href]::after { content: none; }
        }
      `}</style>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "2rem 1.25rem", color: "#1a1a1a" }}>

        {/* Toolbar */}
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <Link to="/" style={{ color: BRAND, fontWeight: 600, fontFamily: "sans-serif", fontSize: "0.88rem", textDecoration: "none" }}>
            &larr; Back to Home
          </Link>
          <button
            onClick={() => window.print()}
            style={{
              background:   BRAND,
              color:        "white",
              border:       "none",
              borderRadius: 8,
              padding:      "9px 20px",
              fontWeight:   700,
              fontSize:     "0.88rem",
              cursor:       "pointer",
              fontFamily:   "sans-serif",
            }}
          >
            Print / Save as PDF
          </button>
        </div>

        {/* Report header */}
        <header style={{ borderBottom: `3px solid ${BRAND}`, paddingBottom: "1.75rem", marginBottom: "2rem" }}>
          <p style={{
            fontSize:      "0.78rem",
            fontWeight:    700,
            color:         BRAND,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily:    "sans-serif",
            margin:        "0 0 6px",
          }}>
            WCAG Edition &middot; Based on VPAT&reg; Version 2.5Rev
          </p>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: BRAND, margin: "0 0 1.5rem", fontFamily: "sans-serif", lineHeight: 1.25 }}>
            EndsideOut Accessibility Conformance Report
          </h1>

          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.88rem" }}>
            <tbody>
              {([
                ["Name of Product / Version", `${META.product}, ${META.version}`],
                ["Report Date",               META.date],
                ["Contact Information",       META.contact],
                ["Product Description",       META.description],
                ["Notes",                     META.notes],
                ["Evaluation Methods Used",   META.evalMethods],
              ] as [string, string][]).map(([k, v]) => (
                <tr key={k} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th scope="row" style={{ padding: "9px 14px 9px 0", fontWeight: 700, fontFamily: "sans-serif", color: "#374151", width: "22%", verticalAlign: "top", whiteSpace: "nowrap" }}>
                    {k}
                  </th>
                  <td style={{ padding: "9px 0", fontFamily: "sans-serif", color: "#374151", lineHeight: 1.75 }}>
                    {k === "Contact Information"
                      ? <a href={`mailto:${v}`} style={{ color: BRAND }}>{v}</a>
                      : v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </header>

        {/* Applicable Standards */}
        <section aria-labelledby="standards-h" style={{ marginBottom: "2.5rem" }}>
          <h2 id="standards-h" style={{ fontSize: "1.05rem", fontWeight: 700, color: BRAND, fontFamily: "sans-serif", marginBottom: "0.75rem" }}>
            Applicable Standards / Guidelines
          </h2>
          <p style={{ fontFamily: "sans-serif", fontSize: "0.88rem", marginBottom: "0.75rem", color: "#374151" }}>
            This report covers the degree of conformance for the following accessibility standards:
          </p>
          <table style={{ borderCollapse: "collapse", fontSize: "0.85rem", width: "100%", border: "1px solid #c9cdd4" }}>
            <thead>
              <tr style={{ background: "#e8edf0" }}>
                <th scope="col" style={{ padding: "10px 16px", textAlign: "left",   fontFamily: "sans-serif", fontWeight: 700, color: "#374151", borderBottom: "1px solid #c9cdd4", borderRight: "1px solid #c9cdd4" }}>
                  Standard / Guideline
                </th>
                {(["Level A", "Level AA", "Level AAA"] as const).map(lv => (
                  <th key={lv} scope="col" style={{ padding: "10px 16px", textAlign: "left", fontFamily: "sans-serif", fontWeight: 700, color: "#374151", borderBottom: "1px solid #c9cdd4", borderRight: "1px solid #c9cdd4", width: 110 }}>
                    {lv}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {([
                ["Web Content Accessibility Guidelines 2.0", "Yes", "Yes", "Yes"],
                ["Web Content Accessibility Guidelines 2.1", "Yes", "Yes", "Yes"],
                ["Web Content Accessibility Guidelines 2.2", "Yes", "Yes", "Yes"],
              ] as [string, string, string, string][]).map(([std, a, aa, aaa], i) => (
                <tr key={std} style={{ background: i % 2 === 0 ? "white" : "#f4f6f8" }}>
                  <td style={{ padding: "10px 16px", fontFamily: "sans-serif", color: "#374151", borderBottom: "1px solid #e2e5e9", borderRight: "1px solid #c9cdd4" }}>
                    {std}
                  </td>
                  {[a, aa, aaa].map((val, j) => (
                    <td key={j} style={{ padding: "10px 16px", fontFamily: "sans-serif", color: "#374151", borderBottom: "1px solid #e2e5e9", borderRight: "1px solid #c9cdd4" }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Terms */}
        <section aria-labelledby="terms-h" style={{ marginBottom: "2.5rem" }}>
          <h2 id="terms-h" style={{ fontSize: "1.05rem", fontWeight: 700, color: BRAND, fontFamily: "sans-serif", marginBottom: "0.75rem" }}>
            Terms
          </h2>
          <ul style={{ fontFamily: "sans-serif", fontSize: "0.88rem", lineHeight: 2.1, paddingLeft: "1.5rem", color: "#374151" }}>
            {([
              ["Supports",           "The functionality of the product has at least one method that meets the criterion without known defects or meets with equivalent facilitation."],
              ["Partially Supports", "Some functionality of the product does not meet the criterion."],
              ["Does Not Support",   "The majority of product functionality does not meet the criterion."],
              ["Not Applicable",     "The criterion is not relevant to the product."],
              ["Not Evaluated",      "The product has not been evaluated against the criterion. This term may only be used for WCAG Level AAA criteria."],
            ] as [Level, string][]).map(([term, def]) => (
              <li key={term}>
                <LevelBadge level={term} />{" "}
                <span style={{ marginLeft: 6 }}>{def}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* WCAG tables */}
        <section aria-labelledby="wcag-h">
          <h2 id="wcag-h" style={{ fontSize: "1.1rem", fontWeight: 800, color: BRAND, fontFamily: "sans-serif", marginBottom: "0.4rem" }}>
            WCAG 2.x Report
          </h2>
          <p style={{ fontFamily: "sans-serif", fontSize: "0.83rem", color: "#6b7280", marginBottom: "2rem" }}>
            Criteria are evaluated for full pages and complete processes, using technology in ways that
            are supported by accessibility features, in accordance with the WCAG 2.0 Conformance
            Requirements. Each criterion title links to the corresponding section of the W3C WCAG 2.2
            specification.
          </p>

          <CriteriaTable criteria={LEVEL_A}   tableNum={1} title="Level A" />
          <CriteriaTable criteria={LEVEL_AA}  tableNum={2} title="Level AA" />
          <CriteriaTable criteria={LEVEL_AAA} tableNum={3} title="Level AAA" />
        </section>

        {/* Footer */}
        <footer style={{ borderTop: `2px solid ${BRAND}`, paddingTop: "1rem", marginTop: "2rem", fontSize: "0.77rem", color: "#6b7280", fontFamily: "sans-serif" }}>
          <p>
            For questions regarding this report, contact{" "}
            <a href={`mailto:${META.contact}`} style={{ color: BRAND }}>{META.contact}</a>
          </p>
        </footer>

      </div>
    </>
  );
}
