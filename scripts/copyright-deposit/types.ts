export type ItemType =
  | "mcq"
  | "binary_choice"
  | "statement"
  | "sort_item"
  | "match_pair"
  | "match_item"
  | "scenario"
  | "definition"
  | "pose"
  | "trait_quiz"
  | "skill_match"
  | "action_item"
  | "habit_item"
  | "food_item"
  | "budget_item"
  | "word_search";

export interface QuestionAnswerRow {
  content_id: string;
  course: string;
  module_or_dimension: string;
  game_id: string;
  game_title: string;
  route: string;
  sequence_index: string;
  item_type: ItemType;
  prompt: string;
  choices_json: string;
  correct_answer: string;
  category: string;
  mode: string;
  grade_band: string;
}

export interface FeedbackRow {
  content_id: string;
  game_id: string;
  route: string;
  item_type: ItemType;
  prompt: string;
  feedback_text: string;
  feedback_kind: string;
}

export interface NarrativeRow {
  content_id: string;
  course: string;
  game_id: string;
  route: string;
  narrative_kind: string;
  text: string;
  audio_path: string;
}

export interface ProgressionRow {
  game_id: string;
  game_title: string;
  route: string;
  course: string;
  module_or_dimension: string;
  set_name: string;
  set_sequence: string;
  game_duration_seconds: string;
  points_correct: string;
  scoring_notes: string;
  progression_notes: string;
}

export interface OrganizationNode {
  id: string;
  type: "course" | "module" | "dimension" | "set" | "game" | "hub";
  name: string;
  description: string;
  route: string;
  parent_id: string;
  sequence: number | null;
  children: OrganizationNode[];
}

export interface ExportBundle {
  questionAnswer: QuestionAnswerRow[];
  feedback: FeedbackRow[];
  narrative: NarrativeRow[];
  progression: ProgressionRow[];
  organization: OrganizationNode[];
}
