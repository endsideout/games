export type GameMode = 1 | 2 | 3;

export const MODE_INFO: Record<GameMode, { label: string; grades: string; emoji: string; gradient: string }> = {
  1: { label: "Mode 1", grades: "PreK – Grade 2", emoji: "🌱", gradient: "linear-gradient(135deg, #f59e0b, #10b981)" },
  2: { label: "Mode 2", grades: "Grade 3 – 5",   emoji: "🚀", gradient: "linear-gradient(135deg, #6366f1, #06b6d4)" },
  3: { label: "Mode 3", grades: "Grade 6 – 8",   emoji: "⭐", gradient: "linear-gradient(135deg, #0284c7, #7c3aed)" },
};

export function gradeToMode(grade: string | null | undefined): GameMode | null {
  if (!grade) return null;
  const g = grade.toLowerCase().trim();
  if (g === "prek" || g === "k" || g === "1" || g === "2") return 1;
  if (g === "3" || g === "4" || g === "5") return 2;
  if (g === "6" || g === "7" || g === "8") return 3;
  return null;
}
