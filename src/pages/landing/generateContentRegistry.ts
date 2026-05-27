import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  PageOrientation,
  TableLayoutType,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { GAMES, CHANGELOG } from "./ContentRegistryData";

// ── Page geometry ─────────────────────────────────────────────────────────────
// Landscape 11" × 8.5" page, 0.75" margins all sides
// Usable width = (11 - 1.5) inches × 1440 twips/inch = 13,680 twips

const PW = 13680; // usable page width in twips

// ── Colours ───────────────────────────────────────────────────────────────────

const BRAND  = "005d5b";
const LIGHT  = "e6f3f3";
const GREY   = "374151";
const WHITE  = "FFFFFF";
const GREEN  = "14532d";
const GREENBG = "f0fdf4";
const ROWALT  = "f4fafa";

// ── Border / shading helpers ──────────────────────────────────────────────────

function border(color = "CCCCCC") {
  const s = { style: BorderStyle.SINGLE, size: 4, color };
  return { top: s, bottom: s, left: s, right: s };
}

function cell(
  text: string,
  widthTwips: number,
  opts?: { bold?: boolean; color?: string; bg?: string; italic?: boolean; header?: boolean },
): TableCell {
  return new TableCell({
    width: { size: widthTwips, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, color: "auto", fill: opts?.bg ?? WHITE },
    borders: border(opts?.header ? BRAND : "D1D5DB"),
    children: [
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text: text ?? "",
            bold:    opts?.bold    ?? false,
            italics: opts?.italic  ?? false,
            color:   opts?.color   ?? (opts?.header ? BRAND : GREY),
            size:    opts?.header  ? 16 : 17,
            font:    "Calibri",
          }),
        ],
      }),
    ],
  });
}

function th(text: string, w: number) { return cell(text, w, { bold: true, bg: "F3FAFA", header: true }); }
function td(text: string, w: number, opts?: { bold?: boolean; color?: string; bg?: string }) { return cell(text, w, opts); }
function tdGreen(text: string, w: number) { return cell(text, w, { bold: true, color: GREEN, bg: GREENBG }); }
function tdBrand(text: string, w: number) { return cell(text, w, { bold: true, color: BRAND }); }

function table(rows: TableRow[]): Table {
  return new Table({
    width: { size: PW, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    rows,
  });
}

// ── Common helpers ────────────────────────────────────────────────────────────

function para(text: string, opts?: { bold?: boolean; color?: string; size?: number; italic?: boolean; before?: number; after?: number }): Paragraph {
  return new Paragraph({
    spacing: { before: opts?.before ?? 60, after: opts?.after ?? 80 },
    children: [new TextRun({ text, bold: opts?.bold ?? false, italics: opts?.italic ?? false, color: opts?.color ?? GREY, size: opts?.size ?? 20, font: "Calibri" })],
  });
}

function heading(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_2): Paragraph {
  const size = level === HeadingLevel.HEADING_1 ? 40 : level === HeadingLevel.HEADING_2 ? 28 : 23;
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, color: BRAND, size, font: "Calibri" })],
  });
}

function divider(): Paragraph {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND } },
    spacing: { before: 180, after: 180 },
    children: [],
  });
}

function gap(before = 100): Paragraph {
  return new Paragraph({ spacing: { before, after: 0 }, children: [] });
}

// ── Meta / declaration tables ─────────────────────────────────────────────────

const L = Math.round(PW * 0.22); // label col ~22%
const V = PW - L;                 // value col ~78%

function metaRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      cell(label, L, { bold: true, color: BRAND, bg: "F9FAFA" }),
      cell(value, V, { bg: WHITE }),
    ],
  });
}

// ── Table builders ────────────────────────────────────────────────────────────

type QARow       = { id: string; scenario?: string; question: string; optionA: string; optionB: string; optionC?: string; optionD?: string; correct: string; feedback: string };
type ItemRow     = { id: string; item: string; category: string; notes?: string };
type VocabRow    = { id: string; word: string; definition: string };
type ScenarioRow = { id: string; situation: string; options: string; correct: string };

function qaTable(rows: QARow[]): Table {
  const hasScenario = rows.some(r => r.scenario);
  const hasC        = rows.some(r => r.optionC);
  const hasD        = rows.some(r => r.optionD);

  // Column widths in twips (must sum to PW = 13680)
  let wId: number, wQ: number, wA: number, wB: number, wC: number, wD: number, wCor: number, wFb: number;
  if (hasD) {
    wId = 1100; wQ = 2100; wA = 1440; wB = 1440; wC = 1300; wD = 1300; wCor = 1300; wFb = 3700;
  } else if (hasC) {
    wId = 1200; wQ = 2400; wA = 1600; wB = 1600; wC = 1500; wD = 0; wCor = 1380; wFb = 4000;
  } else {
    wId = 1300; wQ = 2900; wA = 2000; wB = 2000; wC = 0; wD = 0; wCor = 1480; wFb = 4000;
  }

  return table([
    new TableRow({
      tableHeader: true,
      children: [
        th(hasScenario ? "ID / Scenario" : "ID", wId),
        th("Question", wQ),
        th("Option A",  wA),
        th("Option B",  wB),
        ...(hasC ? [th("Option C", wC)] : []),
        ...(hasD ? [th("Option D", wD)] : []),
        th("Correct Answer",       wCor),
        th("Feedback / Explanation", wFb),
      ],
    }),
    ...rows.map((r, i) => {
      const bg = i % 2 === 0 ? WHITE : ROWALT;
      return new TableRow({
        children: [
          (() => {
            const lines: TextRun[] = [new TextRun({ text: r.id, bold: true, color: BRAND, size: 17, font: "Calibri" })];
            if (r.scenario) lines.push(new TextRun({ text: `\n${r.scenario}`, italics: true, color: "6B7280", size: 15, font: "Calibri", break: 1 }));
            return new TableCell({
              width: { size: wId, type: WidthType.DXA },
              shading: { type: ShadingType.CLEAR, color: "auto", fill: bg },
              borders: border("D1D5DB"),
              children: [new Paragraph({ spacing: { before: 40, after: 40 }, children: lines })],
            });
          })(),
          td(r.question,  wQ,   { bg }),
          td(r.optionA,   wA,   { bg }),
          td(r.optionB,   wB,   { bg }),
          ...(hasC ? [td(r.optionC ?? "", wC, { bg })] : []),
          ...(hasD ? [td(r.optionD ?? "", wD, { bg })] : []),
          tdGreen(r.correct,  wCor),
          td(r.feedback,  wFb,  { bg }),
        ],
      });
    }),
  ]);
}

function itemTable(rows: ItemRow[]): Table {
  const hasNotes = rows.some(r => r.notes);
  const wId   = 1300;
  const wItem = hasNotes ? 3600 : 7080;
  const wCat  = hasNotes ? 2680 : 5300;
  const wNote = hasNotes ? PW - wId - wItem - wCat : 0;

  return table([
    new TableRow({
      tableHeader: true,
      children: [
        th("ID", wId),
        th("Content Item", wItem),
        th("Category", wCat),
        ...(hasNotes ? [th("Educational Notes", wNote)] : []),
      ],
    }),
    ...rows.map((r, i) => {
      const bg = i % 2 === 0 ? WHITE : ROWALT;
      return new TableRow({
        children: [
          tdBrand(r.id,       wId),
          td(r.item,          wItem, { bg }),
          td(r.category,      wCat,  { bg }),
          ...(hasNotes ? [td(r.notes ?? "", wNote, { bg })] : []),
        ],
      });
    }),
  ]);
}

function vocabTable(rows: VocabRow[]): Table {
  const wId   = 1100;
  const wWord = 2580;
  const wDef  = PW - wId - wWord;

  return table([
    new TableRow({ tableHeader: true, children: [th("ID", wId), th("Word", wWord), th("Definition", wDef)] }),
    ...rows.map((r, i) => {
      const bg = i % 2 === 0 ? WHITE : ROWALT;
      return new TableRow({
        children: [tdBrand(r.id, wId), td(r.word, wWord, { bold: true, bg }), td(r.definition, wDef, { bg })],
      });
    }),
  ]);
}

function scenarioTable(rows: ScenarioRow[]): Table {
  const wId   = 950;
  const wSit  = 4730;
  const wOpts = 3500;
  const wCor  = PW - wId - wSit - wOpts;

  return table([
    new TableRow({ tableHeader: true, children: [th("ID", wId), th("Situation / Scenario", wSit), th("Emotion Options", wOpts), th("Correct Answer", wCor)] }),
    ...rows.map((r, i) => {
      const bg = i % 2 === 0 ? WHITE : ROWALT;
      return new TableRow({
        children: [tdBrand(r.id, wId), td(r.situation, wSit, { bg }), td(r.options, wOpts, { bg }), tdGreen(r.correct, wCor)],
      });
    }),
  ]);
}

function changelogTable(): Table {
  const wVer = 900; const wDate = 1100; const wGame = 2200; const wDesc = 5180; const wTrello = 1600; const wBy = PW - wVer - wDate - wGame - wDesc - wTrello;
  return table([
    new TableRow({ tableHeader: true, children: [th("Version", wVer), th("Date", wDate), th("Game / Module", wGame), th("Change Description", wDesc), th("Trello Ticket", wTrello), th("Updated By", wBy)] }),
    ...CHANGELOG.map((r, i) => {
      const bg = i % 2 === 0 ? WHITE : ROWALT;
      return new TableRow({
        children: [
          td(r.version,       wVer,   { bold: true, bg }),
          td(r.date,          wDate,  { bg }),
          td(r.game,          wGame,  { bg }),
          td(r.change,        wDesc,  { bg }),
          td(r.ticket || "—", wTrello,{ bg }),
          td(r.updatedBy,     wBy,    { bg }),
        ],
      });
    }),
  ]);
}

// ── Document assembly ─────────────────────────────────────────────────────────

export async function downloadContentRegistryDocx(): Promise<void> {
  const modules = Array.from(new Set(GAMES.map(g => g.module)));
  const children: (Paragraph | Table)[] = [];

  // Cover
  children.push(
    para("EndsideOut Games Platform", { bold: true, color: BRAND, size: 20, before: 0, after: 60 }),
    heading("Game Content Registry", HeadingLevel.HEADING_1),
  );

  // Metadata
  children.push(
    table([
      metaRow("Document Type",    "Copyright Deposit Documentation"),
      metaRow("Platform Version", "v1.0"),
      metaRow("Date Prepared",    "May 2026"),
      metaRow("Contact",          "info@endsideout.org"),
      metaRow("Total Games",      `${GAMES.length} games across ${modules.length} modules`),
    ]),
  );

  // Authorship declaration
  children.push(
    gap(240),
    para("Authorship and Ownership Declaration", { bold: true, color: BRAND, size: 20, before: 0, after: 60 }),
    table([
      metaRow("Copyright Claimant",        "EndsideOut, Inc."),
      metaRow("Nature of Authorship",       "All original textual content comprising this work, including but not limited to: instructional question prompts, answer choices, correct-answer designations, feedback rationale, voiceover and mascot instruction scripts, game narrative text, career guidance content, pose and activity cues, and the original selection, arrangement, and sequencing of the foregoing content into an educational game platform for K–12 students."),
      metaRow("Type of Work",              "Literary work; compilation."),
      metaRow("Year of First Publication", "2025. First repository commit: September 16, 2025."),
      metaRow("Contact",                   "info@endsideout.org"),
    ]),
  );

  children.push(divider());

  // Purpose
  children.push(
    heading("Purpose of This Document"),
    para("This registry documents all original authored content created for the EndsideOut Games platform. It is intended to serve as the copyright deposit copy for submission to the United States Copyright Office and as a living reference for content governance. The document captures every game's question bank, answer choices, educational feedback, gameplay instructions, and voiceover scripts as originally authored by the EndsideOut team."),
    para("When content is updated or new games are added, a new version of this document should be prepared and a supplementary copyright registration filed. All updates are tracked in the Change Log at the end of this document. Trello tickets referencing specific content item IDs should be linked in that log."),
  );

  children.push(divider());

  // Games
  for (const mod of modules) {
    // Module bar
    children.push(
      new Paragraph({
        shading: { type: ShadingType.CLEAR, color: "auto", fill: BRAND },
        spacing: { before: 240, after: 120 },
        children: [new TextRun({ text: mod, bold: true, color: WHITE, size: 22, font: "Calibri" })],
      }),
    );

    for (const game of GAMES.filter(g => g.module === mod)) {
      // Game title
      children.push(
        new Paragraph({
          spacing: { before: 180, after: 60 },
          children: [new TextRun({ text: `${game.id} — ${game.name}`, bold: true, color: BRAND, size: 22, font: "Calibri" })],
        }),
        new Paragraph({
          spacing: { before: 40, after: 60 },
          children: [
            new TextRun({ text: "Type: ",        bold: true, size: 18, color: GREY, font: "Calibri" }),
            new TextRun({ text: game.type + "     ", size: 18, color: GREY, font: "Calibri" }),
            new TextRun({ text: "Grade Level: ", bold: true, size: 18, color: GREY, font: "Calibri" }),
            new TextRun({ text: game.gradeLevel + "     ", size: 18, color: GREY, font: "Calibri" }),
            new TextRun({ text: "Duration: ",   bold: true, size: 18, color: GREY, font: "Calibri" }),
            new TextRun({ text: game.duration,  size: 18, color: GREY, font: "Calibri" }),
          ],
        }),
      );

      // Voiceover block
      children.push(
        table([
          new TableRow({
            children: [
              new TableCell({
                width: { size: PW, type: WidthType.DXA },
                shading: { type: ShadingType.CLEAR, color: "auto", fill: LIGHT },
                borders: { left: { style: BorderStyle.SINGLE, size: 14, color: BRAND }, top: border().top, bottom: border().bottom, right: border().right },
                children: [
                  new Paragraph({ spacing: { before: 30, after: 20 }, children: [new TextRun({ text: "Voiceover Instruction Script", bold: true, color: BRAND, size: 16, font: "Calibri" })] }),
                  new Paragraph({ spacing: { before: 0, after: 30 },  children: [new TextRun({ text: game.voiceover, italics: true, size: 17, color: GREY, font: "Calibri" })] }),
                ],
              }),
            ],
          }),
        ]),
        gap(80),
      );

      if (game.qa)        { children.push(qaTable(game.qa),        gap(80)); }
      if (game.items)     { children.push(itemTable(game.items),    gap(80)); }
      if (game.vocab)     { children.push(vocabTable(game.vocab),   gap(80)); }
      if (game.scenarios) { children.push(scenarioTable(game.scenarios), gap(80)); }
    }
  }

  children.push(divider());

  // Change log
  children.push(heading("Change Log"), changelogTable());

  // Footer
  children.push(
    gap(200),
    para("For questions regarding this document, contact info@endsideout.org", { color: "6B7280", italic: true }),
  );

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 20, color: GREY } },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { orientation: PageOrientation.LANDSCAPE },
          margin: {
            top:    convertInchesToTwip(0.75),
            bottom: convertInchesToTwip(0.75),
            left:   convertInchesToTwip(0.75),
            right:  convertInchesToTwip(0.75),
          },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "EndsideOut_Game_Content_Registry.docx");
}
