import React from "react";
import { Link } from "react-router-dom";
import { GAMES, CHANGELOG } from "./ContentRegistryData";
import type { QARow, ItemRow, VocabRow, ScenarioRow, Game } from "./ContentRegistryData";
import { downloadContentRegistryDocx } from "./generateContentRegistry";

const BRAND   = "#005d5b";
const BRAND_L = "#e6f3f3";
const GREY    = "#374151";
const LIGHT   = "#f8fafa";

// ── Print styles ─────────────────────────────────────────────────────────────

const PRINT_CSS = `
  .no-print { display: none !important; }
  a[href]::after { content: none; }
  * { line-height: 1.35 !important; }
  body, p, td, th, li, span { font-size: 8.5pt !important; }
  h1 { font-size: 15pt !important; }
  h2 { font-size: 11pt !important; page-break-after: avoid; margin-top: 0 !important; }
  h3 { font-size: 9.5pt !important; page-break-after: avoid; }
  p  { margin-top: 0.1rem !important; margin-bottom: 0.3rem !important; }
  td, th { padding: 5px 8px !important; }
  div { overflow: visible !important; }
  section { margin-top: 0 !important; margin-bottom: 0.5rem !important; }
  table { page-break-inside: auto; border-collapse: collapse !important; width: 100%; }
  thead { display: table-header-group; }
  tr { page-break-inside: avoid; }
  .game-section { page-break-before: auto; }
  .module-header { page-break-after: avoid; }
  .print-container { max-width: 100% !important; padding: 0.25rem 0.75rem !important; }
  .repeat-header { display: table-row !important; }
`;

// ── Rendering helpers ─────────────────────────────────────────────────────────

function SectionBadge({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-block",
      background: BRAND_L,
      color: BRAND,
      fontWeight: 600,
      fontSize: "0.72rem",
      padding: "2px 8px",
      borderRadius: 999,
      fontFamily: "sans-serif",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    }}>
      {label}
    </span>
  );
}

function GameHeader({ game }: { game: Game }) {
  return (
    <div style={{ marginBottom: "0.6rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: "0.35rem" }}>
        <span style={{ fontFamily: "sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {game.id}
        </span>
        <SectionBadge label={game.module} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 16px", fontFamily: "sans-serif", fontSize: "0.8rem", color: GREY, marginBottom: "0.5rem" }}>
        <span><strong>Type:</strong> {game.type}</span>
        <span><strong>Grade Level:</strong> {game.gradeLevel}</span>
        <span><strong>Duration:</strong> {game.duration}</span>
      </div>
      <div style={{
        background: BRAND_L,
        borderLeft: `3px solid ${BRAND}`,
        padding: "8px 12px",
        borderRadius: "0 4px 4px 0",
        fontFamily: "sans-serif",
        fontSize: "0.8rem",
        color: GREY,
        marginBottom: "0.75rem",
      }}>
        <strong style={{ color: BRAND, display: "block", marginBottom: 2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Voiceover Instruction Script</strong>
        {game.voiceover}
      </div>
    </div>
  );
}

function QATable({ rows }: { rows: QARow[] }) {
  const hasScenario = rows.some(r => r.scenario);
  const hasOptionC  = rows.some(r => r.optionC);
  const hasOptionD  = rows.some(r => r.optionD);
  return (
    <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
        <thead>
          <tr style={{ background: LIGHT }}>
            <th style={TH}>{hasScenario ? "ID / Scenario" : "ID"}</th>
            <th style={TH}>Question</th>
            <th style={TH}>Option A</th>
            <th style={TH}>Option B</th>
            {hasOptionC && <th style={TH}>Option C</th>}
            {hasOptionD && <th style={TH}>Option D</th>}
            <th style={{ ...TH, color: "#14532d", background: "#f0fdf4" }}>Correct Answer</th>
            <th style={TH}>Feedback / Explanation</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 === 0 ? "white" : BRAND_L, borderBottom: "1px solid #e5e7eb" }}>
              <td style={TD}>
                <span style={{ fontWeight: 700, color: BRAND, fontFamily: "sans-serif" }}>{r.id}</span>
                {r.scenario && <span style={{ display: "block", color: "#6b7280", fontSize: "0.75rem", marginTop: 2, fontStyle: "italic" }}>{r.scenario}</span>}
              </td>
              <td style={TD}>{r.question}</td>
              <td style={TD}>{r.optionA}</td>
              <td style={TD}>{r.optionB}</td>
              {hasOptionC && <td style={TD}>{r.optionC ?? ""}</td>}
              {hasOptionD && <td style={TD}>{r.optionD ?? ""}</td>}
              <td style={{ ...TD, fontWeight: 700, color: "#14532d" }}>{r.correct}</td>
              <td style={TD}>{r.feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ItemTable({ rows }: { rows: ItemRow[] }) {
  const hasNotes = rows.some(r => r.notes);
  return (
    <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
        <thead>
          <tr style={{ background: LIGHT }}>
            <th style={TH}>ID</th>
            <th style={TH}>Content Item</th>
            <th style={TH}>Category</th>
            {hasNotes && <th style={TH}>Educational Notes</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 === 0 ? "white" : BRAND_L, borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ ...TD, fontWeight: 700, color: BRAND, fontFamily: "sans-serif" }}>{r.id}</td>
              <td style={TD}>{r.item}</td>
              <td style={TD}>{r.category}</td>
              {hasNotes && <td style={TD}>{r.notes ?? ""}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VocabTable({ rows }: { rows: VocabRow[] }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
        <thead>
          <tr style={{ background: LIGHT }}>
            <th style={TH}>ID</th>
            <th style={TH}>Word</th>
            <th style={TH}>Definition</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 === 0 ? "white" : BRAND_L, borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ ...TD, fontWeight: 700, color: BRAND, fontFamily: "sans-serif" }}>{r.id}</td>
              <td style={{ ...TD, fontWeight: 700 }}>{r.word}</td>
              <td style={TD}>{r.definition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScenarioTable({ rows }: { rows: ScenarioRow[] }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
        <thead>
          <tr style={{ background: LIGHT }}>
            <th style={TH}>ID</th>
            <th style={TH}>Situation / Scenario</th>
            <th style={TH}>Emotion Options</th>
            <th style={{ ...TH, color: "#14532d", background: "#f0fdf4" }}>Correct Answer</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 === 0 ? "white" : BRAND_L, borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ ...TD, fontWeight: 700, color: BRAND, fontFamily: "sans-serif" }}>{r.id}</td>
              <td style={TD}>{r.situation}</td>
              <td style={TD}>{r.options}</td>
              <td style={{ ...TD, fontWeight: 700, color: "#14532d" }}>{r.correct}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TH: React.CSSProperties = {
  padding: "9px 12px",
  textAlign: "left",
  fontFamily: "sans-serif",
  fontWeight: 700,
  fontSize: "0.75rem",
  color: BRAND,
  borderBottom: `2px solid ${BRAND}`,
  whiteSpace: "nowrap",
};

const TD: React.CSSProperties = {
  padding: "9px 12px",
  verticalAlign: "top",
  lineHeight: 1.6,
  fontFamily: "sans-serif",
  color: GREY,
};

// ── Page ──────────────────────────────────────────────────────────────────────

export function ContentRegistry(): React.JSX.Element {
  const modules = Array.from(new Set(GAMES.map(g => g.module)));

  return (
    <>
      <style>{`@media print { ${PRINT_CSS} }`}</style>

      <div className="print-container" style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem", color: GREY }}>

        {/* Toolbar */}
        <div className="no-print" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <Link to="/" style={{ color: BRAND, fontWeight: 600, fontFamily: "sans-serif", fontSize: "0.88rem", textDecoration: "none" }}>
            &larr; Back to Home
          </Link>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => downloadContentRegistryDocx()}
              style={{ background: BRAND, color: "white", border: "none", borderRadius: 6, padding: "8px 18px", fontFamily: "sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
            >
              Download as Word (.docx)
            </button>
            <button
              onClick={() => window.print()}
              style={{ background: "white", color: BRAND, border: `2px solid ${BRAND}`, borderRadius: 6, padding: "8px 18px", fontFamily: "sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
            >
              Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Document header */}
        <header style={{ borderBottom: `3px solid ${BRAND}`, paddingBottom: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.78rem", fontWeight: 700, color: BRAND, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "sans-serif", margin: "0 0 6px" }}>
            EndsideOut Games Platform
          </p>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: BRAND, margin: "0 0 1.25rem", fontFamily: "sans-serif", lineHeight: 1.2 }}>
            Game Content Registry
          </h1>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.88rem" }}>
            <tbody>
              {([
                ["Document Type",    "Copyright Deposit Documentation"],
                ["Platform Version", "v1.0"],
                ["Date Prepared",    "May 2026"],
                ["Contact",         "info@endsideout.org"],
                ["Total Games",     `${GAMES.length} games across ${modules.length} modules`],
              ] as [string, string][]).map(([k, v]) => (
                <tr key={k} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th scope="row" style={{ padding: "8px 14px 8px 0", fontWeight: 700, fontFamily: "sans-serif", color: GREY, width: "22%", verticalAlign: "top", whiteSpace: "nowrap" }}>{k}</th>
                  <td style={{ padding: "8px 0", fontFamily: "sans-serif", color: GREY, lineHeight: 1.6 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </header>

        {/* Authorship declaration */}
        <section style={{ marginBottom: "2rem" }}>
          <div style={{
            background: BRAND_L,
            borderLeft: `3px solid ${BRAND}`,
            padding: "12px 16px",
            borderRadius: "0 4px 4px 0",
            fontFamily: "sans-serif",
            fontSize: "0.83rem",
            color: GREY,
            lineHeight: 1.7,
          }}>
            <strong style={{ color: BRAND, display: "block", marginBottom: 6, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Authorship and Ownership Declaration
            </strong>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <tbody>
                {([
                  ["Copyright Claimant",    "EndsideOut, Inc."],
                  ["Nature of Authorship",  "All original textual content comprising this work, including but not limited to: instructional question prompts, answer choices, correct-answer designations, feedback rationale, voiceover and mascot instruction scripts, game narrative text, career guidance content, pose and activity cues, and the original selection, arrangement, and sequencing of the foregoing content into an educational game platform for K–12 students."],
                  ["Type of Work",          "Literary work; compilation."],
                  ["Year of First Publication", "2025. First repository commit: September 16, 2025."],
                  ["Contact",              "info@endsideout.org"],
                ] as [string, string][]).map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row" style={{ padding: "4px 14px 4px 0", fontWeight: 700, color: BRAND, width: "26%", verticalAlign: "top", whiteSpace: "nowrap", fontFamily: "sans-serif", fontSize: "0.83rem" }}>{k}</th>
                    <td style={{ padding: "4px 0", color: GREY, lineHeight: 1.6, fontFamily: "sans-serif", fontSize: "0.83rem" }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Purpose statement */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: BRAND, fontFamily: "sans-serif", marginBottom: "0.6rem" }}>Purpose of This Document</h2>
          <p style={{ fontFamily: "sans-serif", fontSize: "0.88rem", lineHeight: 1.75, color: GREY, maxWidth: 780 }}>
            This registry documents all original authored content created for the EndsideOut Games platform. It is intended to serve as the copyright deposit copy for submission to the United States Copyright Office and as a living reference for content governance. The document captures every game's question bank, answer choices, educational feedback, gameplay instructions, and voiceover scripts as originally authored by the EndsideOut team.
          </p>
          <p style={{ fontFamily: "sans-serif", fontSize: "0.88rem", lineHeight: 1.75, color: GREY, maxWidth: 780, marginTop: "0.5rem" }}>
            When content is updated or new games are added, a new version of this document should be prepared and a supplementary copyright registration filed. All updates are tracked in the Change Log at the end of this document. Trello tickets referencing specific content item IDs should be linked in that log.
          </p>
        </section>

        {/* Table of contents */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: BRAND, fontFamily: "sans-serif", marginBottom: "0.75rem" }}>Contents</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 24px", fontFamily: "sans-serif", fontSize: "0.83rem" }}>
            {GAMES.map(g => (
              <a key={g.id} href={`#${g.id}`} style={{ color: BRAND, textDecoration: "none", padding: "2px 0" }}>
                {g.id} — {g.name}
              </a>
            ))}
          </div>
        </section>

        <hr style={{ border: "none", borderTop: `2px solid ${BRAND}`, marginBottom: "2rem" }} />

        {/* Game sections grouped by module */}
        {modules.map(mod => (
          <div key={mod}>
            <div className="module-header" style={{ background: BRAND, color: "white", padding: "10px 16px", borderRadius: 6, marginBottom: "1.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, fontFamily: "sans-serif", color: "white" }}>
                {mod}
              </h2>
            </div>

            {GAMES.filter(g => g.module === mod).map(game => (
              <section id={game.id} key={game.id} className="game-section" style={{ marginBottom: "2.5rem", borderLeft: `3px solid ${BRAND}`, paddingLeft: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: BRAND, fontFamily: "sans-serif", margin: "0 0 0.5rem" }}>
                  {game.id} — {game.name}
                </h3>
                <GameHeader game={game} />

                {game.qa        && <QATable       rows={game.qa} />}
                {game.items     && <ItemTable     rows={game.items} />}
                {game.vocab     && <VocabTable    rows={game.vocab} />}
                {game.scenarios && <ScenarioTable rows={game.scenarios} />}
              </section>
            ))}
          </div>
        ))}

        <hr style={{ border: "none", borderTop: `2px solid ${BRAND}`, margin: "2rem 0" }} />

        {/* Change log */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: BRAND, fontFamily: "sans-serif", marginBottom: "0.5rem" }}>Change Log</h2>
          <p style={{ fontFamily: "sans-serif", fontSize: "0.83rem", color: GREY, marginBottom: "0.75rem" }}>
            Each entry in this log corresponds to a content update. When filing a supplementary copyright registration, reference the version number and the Trello ticket that authorized the change.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
            <thead>
              <tr style={{ background: LIGHT }}>
                {["Version", "Date", "Game / Module Affected", "Change Description", "Trello Ticket", "Updated By"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHANGELOG.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "white" : BRAND_L, borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{r.version}</td>
                  <td style={TD}>{r.date}</td>
                  <td style={TD}>{r.game}</td>
                  <td style={TD}>{r.change}</td>
                  <td style={TD}>{r.ticket || "—"}</td>
                  <td style={TD}>{r.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: `2px solid ${BRAND}`, paddingTop: "1rem", fontFamily: "sans-serif", fontSize: "0.8rem", color: "#6b7280" }}>
          For questions regarding this document, contact{" "}
          <a href="mailto:info@endsideout.org" style={{ color: BRAND }}>info@endsideout.org</a>
        </footer>

      </div>
    </>
  );
}
