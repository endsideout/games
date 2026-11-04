import { challengeCards } from "../../src/data/challengeCards.ts";
import { FRUIT_VEGGIE_QUESTIONS } from "../../src/data/fruitVeggieQuiz.ts";
import { GAME_INSTRUCTIONS } from "../../src/components/Mascot/gameInstructions.ts";
import { SET1_GAMES, TDW_SET1_GAMES } from "./catalog.ts";
import * as knowYourHealth from "./gameData/knowYourHealth.ts";
import * as wellbeing from "./gameData/wellbeing.ts";
import { GAME_ROUTES, routeMetaByGameId } from "./routes.ts";
import type {
  ExportBundle,
  FeedbackRow,
  NarrativeRow,
  OrganizationNode,
  ProgressionRow,
  QuestionAnswerRow,
} from "./types.ts";

function meta(gameId: string) {
  const route = routeMetaByGameId(gameId);
  if (!route) {
    throw new Error(`Missing route metadata for ${gameId}`);
  }
  return route;
}

function pushQuestion(
  rows: QuestionAnswerRow[],
  gameId: string,
  item: Omit<QuestionAnswerRow, "course" | "module_or_dimension" | "game_id" | "game_title" | "route" | "sequence_index">,
): void {
  const route = meta(gameId);
  rows.push({
    course: route.course,
    module_or_dimension: route.module_or_dimension,
    game_id: route.game_id,
    game_title: route.game_title,
    route: route.route,
    sequence_index: route.set_sequence ? String(route.set_sequence) : "",
    ...item,
  });
}

function pushFeedback(
  rows: FeedbackRow[],
  gameId: string,
  item: Omit<FeedbackRow, "game_id" | "route">,
): void {
  const route = meta(gameId);
  rows.push({
    game_id: route.game_id,
    route: route.route,
    ...item,
  });
}

function pushNarrative(
  rows: NarrativeRow[],
  gameId: string,
  item: Omit<NarrativeRow, "course" | "game_id" | "route">,
): void {
  const route = meta(gameId);
  rows.push({
    course: route.course,
    game_id: route.game_id,
    route: route.route,
    ...item,
  });
}

function collectKnowYourHealth(
  questionAnswer: QuestionAnswerRow[],
  feedback: FeedbackRow[],
  narrative: NarrativeRow[],
): void {
  knowYourHealth.MODE1_FOODS.forEach((food, index) => {
    pushQuestion(questionAnswer, "sometimes-anytime-food", {
      content_id: `sometimes-anytime-food:mode1:${food.id}`,
      item_type: "sort_item",
      prompt: `Sort ${food.name} into anytime or sometimes foods`,
      choices_json: JSON.stringify(["anytime", "sometimes"]),
      correct_answer: food.category,
      category: food.category,
      mode: "mode1",
      grade_band: "",
    });
    pushFeedback(feedback, "sometimes-anytime-food", {
      content_id: `sometimes-anytime-food:mode1:${food.id}`,
      item_type: "sort_item",
      prompt: food.name,
      feedback_text: "",
      feedback_kind: "category",
    });
    if (index === 0) {
      pushNarrative(narrative, "sometimes-anytime-food", {
        content_id: "sometimes-anytime-food:mode1:overview",
        narrative_kind: "mode_overview",
        text: "Mode 1 sorts foods into anytime foods and sometimes foods.",
        audio_path: "",
      });
    }
  });

  knowYourHealth.MODE2_FOODS.forEach((food) => {
    const effect = food.benefit ?? food.nonBenefit;
    pushQuestion(questionAnswer, "sometimes-anytime-food", {
      content_id: `sometimes-anytime-food:mode2:${food.id}`,
      item_type: "sort_item",
      prompt: `Sort ${food.name} and learn why it belongs in ${food.category} foods`,
      choices_json: JSON.stringify(["anytime", "sometimes"]),
      correct_answer: food.category,
      category: food.category,
      mode: "mode2",
      grade_band: "",
    });
    pushFeedback(feedback, "sometimes-anytime-food", {
      content_id: `sometimes-anytime-food:mode2:${food.id}`,
      item_type: "sort_item",
      prompt: food.name,
      feedback_text: [food.hint, effect?.text].filter(Boolean).join(" "),
      feedback_kind: food.benefit ? "benefit" : "non_benefit",
    });
  });

  knowYourHealth.LEAST_SUGAR_ROUNDS.forEach((round, index) => {
    pushQuestion(questionAnswer, "least-sugar-game", {
      content_id: `least-sugar-game:round:${index + 1}`,
      item_type: "binary_choice",
      prompt: round.question,
      choices_json: JSON.stringify([round.left, round.right]),
      correct_answer: round.answer === "left" ? round.left.name : round.right.name,
      category: round.questionType,
      mode: "",
      grade_band: "",
    });
    pushFeedback(feedback, "least-sugar-game", {
      content_id: `least-sugar-game:round:${index + 1}`,
      item_type: "binary_choice",
      prompt: round.question,
      feedback_text: round.explanation,
      feedback_kind: "explanation",
    });
    pushNarrative(narrative, "least-sugar-game", {
      content_id: `least-sugar-game:round:${index + 1}:facts`,
      narrative_kind: "choice_fact",
      text: `${round.left.name}: ${round.left.fact} | ${round.right.name}: ${round.right.fact}`,
      audio_path: "",
    });
  });

  knowYourHealth.BRAIN_HEALTH_SCENARIOS.forEach((scenario, index) => {
    pushQuestion(questionAnswer, "brain-health-game", {
      content_id: `brain-health-game:scenario:${index + 1}`,
      item_type: "scenario",
      prompt: `${scenario.situation} ${scenario.question}`,
      choices_json: JSON.stringify([scenario.left, scenario.right]),
      correct_answer: scenario.answer === "left" ? scenario.left.name : scenario.right.name,
      category: "brain_health",
      mode: "",
      grade_band: "",
    });
    pushFeedback(feedback, "brain-health-game", {
      content_id: `brain-health-game:scenario:${index + 1}`,
      item_type: "scenario",
      prompt: scenario.question,
      feedback_text: scenario.explanation,
      feedback_kind: "explanation",
    });
    pushNarrative(narrative, "brain-health-game", {
      content_id: `brain-health-game:scenario:${index + 1}:situation`,
      narrative_kind: "situation",
      text: scenario.situation,
      audio_path: "",
    });
  });

  knowYourHealth.WATER_GLASS_QUESTIONS.forEach((question, index) => {
    pushQuestion(questionAnswer, "water-glass-game", {
      content_id: `water-glass-game:question:${index + 1}`,
      item_type: "mcq",
      prompt: question.question,
      choices_json: JSON.stringify(question.options),
      correct_answer: question.answer,
      category: "hydration",
      mode: "",
      grade_band: "",
    });
    pushFeedback(feedback, "water-glass-game", {
      content_id: `water-glass-game:question:${index + 1}`,
      item_type: "mcq",
      prompt: question.question,
      feedback_text: question.explanation,
      feedback_kind: "explanation",
    });
    pushNarrative(narrative, "water-glass-game", {
      content_id: `water-glass-game:question:${index + 1}:voice`,
      narrative_kind: "voice_text",
      text: question.voiceText,
      audio_path: "",
    });
  });

  knowYourHealth.FINISH_RACE_QUESTIONS.forEach((question, index) => {
    pushQuestion(questionAnswer, "finish-race-game", {
      content_id: `finish-race-game:question:${index + 1}`,
      item_type: "mcq",
      prompt: question.question,
      choices_json: JSON.stringify(question.options),
      correct_answer: question.answer,
      category: "physical_activity",
      mode: "grade3",
      grade_band: "grade3",
    });
    pushFeedback(feedback, "finish-race-game", {
      content_id: `finish-race-game:question:${index + 1}`,
      item_type: "mcq",
      prompt: question.question,
      feedback_text: question.explanation,
      feedback_kind: "explanation",
    });
  });

  knowYourHealth.FINISH_RACE_QUESTIONS.slice(0, 3).forEach((question, index) => {
    pushQuestion(questionAnswer, "finish-race-game", {
      content_id: `finish-race-game:prek:question:${index + 1}`,
      item_type: "mcq",
      prompt: question.question,
      choices_json: JSON.stringify(question.options),
      correct_answer: question.answer,
      category: "physical_activity",
      mode: "prek",
      grade_band: "prek",
    });
  });

  knowYourHealth.PREK_HABIT_ITEMS.forEach((item, index) => {
    pushQuestion(questionAnswer, "habit-guard-game", {
      content_id: `habit-guard-game:prek:${index + 1}`,
      item_type: "habit_item",
      prompt: item.label,
      choices_json: JSON.stringify(["good", "bad"]),
      correct_answer: item.type,
      category: item.type,
      mode: "prek",
      grade_band: "prek",
    });
    pushNarrative(narrative, "habit-guard-game", {
      content_id: `habit-guard-game:prek:${index + 1}:voice`,
      narrative_kind: "voice_text",
      text: item.voice,
      audio_path: "",
    });
  });

  knowYourHealth.OLDER_HABIT_ITEMS.forEach((item, index) => {
    pushQuestion(questionAnswer, "habit-guard-game", {
      content_id: `habit-guard-game:older:${index + 1}`,
      item_type: "habit_item",
      prompt: item.label,
      choices_json: JSON.stringify(["good", "bad"]),
      correct_answer: item.type,
      category: item.type,
      mode: "older",
      grade_band: "older",
    });
    pushNarrative(narrative, "habit-guard-game", {
      content_id: `habit-guard-game:older:${index + 1}:voice`,
      narrative_kind: "voice_text",
      text: item.voice,
      audio_path: "",
    });
  });

  knowYourHealth.BODY_IMAGE_STATEMENTS.forEach((statement) => {
    pushQuestion(questionAnswer, "body-image-game", {
      content_id: `body-image-game:statement:${statement.id}`,
      item_type: "statement",
      prompt: statement.text,
      choices_json: JSON.stringify(["positive", "negative"]),
      correct_answer: statement.answer,
      category: "body_image",
      mode: "",
      grade_band: "",
    });
    pushFeedback(feedback, "body-image-game", {
      content_id: `body-image-game:statement:${statement.id}`,
      item_type: "statement",
      prompt: statement.text,
      feedback_text: statement.explanation,
      feedback_kind: "explanation",
    });
  });
}

function collectWellbeing(
  questionAnswer: QuestionAnswerRow[],
  feedback: FeedbackRow[],
  narrative: NarrativeRow[],
): void {
  wellbeing.EMOTION_SCENARIOS.forEach((scenario) => {
    pushQuestion(questionAnswer, "emotion-detective-game", {
      content_id: `emotion-detective-game:scenario:${scenario.id}`,
      item_type: "scenario",
      prompt: scenario.text,
      choices_json: JSON.stringify(scenario.options),
      correct_answer: scenario.correctAnswers.join(" | "),
      category: "emotion",
      mode: "",
      grade_band: "",
    });
  });

  wellbeing.RELATIONSHIP_WORDS.forEach((word, index) => {
    pushQuestion(questionAnswer, "principle-of-relationship-pair-matching-game", {
      content_id: `principle-of-relationship-pair-matching-game:word:${index + 1}`,
      item_type: "match_pair",
      prompt: word,
      choices_json: JSON.stringify(wellbeing.RELATIONSHIP_WORDS),
      correct_answer: word,
      category: "relationship_principle",
      mode: "",
      grade_band: "",
    });
  });

  [...wellbeing.FRUIT_ITEMS, ...wellbeing.VEGETABLE_ITEMS].forEach((name, index) => {
    const category = index < wellbeing.FRUIT_ITEMS.length ? "fruit" : "vegetable";
    pushQuestion(questionAnswer, "fruit-vegetable-matching-game", {
      content_id: `fruit-vegetable-matching-game:${category}:${name}`,
      item_type: "match_item",
      prompt: name,
      choices_json: JSON.stringify(["fruit", "vegetable"]),
      correct_answer: category,
      category,
      mode: "",
      grade_band: "",
    });
  });

  FRUIT_VEGGIE_QUESTIONS.forEach((question, index) => {
    pushQuestion(questionAnswer, "fruit-veggie-quiz", {
      content_id: `fruit-veggie-quiz:question:${index + 1}`,
      item_type: "mcq",
      prompt: question.prompt,
      choices_json: JSON.stringify(question.options),
      correct_answer: question.answer,
      category: "fruit_vegetable",
      mode: "",
      grade_band: "",
    });
  });

  challengeCards.forEach((card) => {
    pushQuestion(questionAnswer, "challenge-quiz", {
      content_id: `challenge-quiz:card:${card.id}`,
      item_type: "mcq",
      prompt: card.question,
      choices_json: JSON.stringify(card.options),
      correct_answer: card.options[card.correctAnswer],
      category: `${card.topic}:${card.resource}`,
      mode: "",
      grade_band: "",
    });
    pushFeedback(feedback, "challenge-quiz", {
      content_id: `challenge-quiz:card:${card.id}`,
      item_type: "mcq",
      prompt: card.question,
      feedback_text: card.explanation,
      feedback_kind: "explanation",
    });
  });

  [...wellbeing.ECO_FRIENDLY_ITEMS, ...wellbeing.NOT_ECO_FRIENDLY_ITEMS].forEach((item) => {
    pushQuestion(questionAnswer, "eco-fix-it-game", {
      content_id: `eco-fix-it-game:item:${item.id}`,
      item_type: "sort_item",
      prompt: item.name,
      choices_json: JSON.stringify(["eco-friendly", "not-eco-friendly"]),
      correct_answer: item.type,
      category: item.type,
      mode: "",
      grade_band: "",
    });
    pushFeedback(feedback, "eco-fix-it-game", {
      content_id: `eco-fix-it-game:item:${item.id}`,
      item_type: "sort_item",
      prompt: item.name,
      feedback_text: item.description,
      feedback_kind: "description",
    });
  });

  wellbeing.PLANET_GOOD_ACTIONS.forEach((action, index) => {
    pushQuestion(questionAnswer, "planet-protector-game", {
      content_id: `planet-protector-game:good:${index + 1}`,
      item_type: "action_item",
      prompt: action,
      choices_json: JSON.stringify(["good", "bad"]),
      correct_answer: "good",
      category: "environmental_action",
      mode: "",
      grade_band: "",
    });
  });

  wellbeing.PLANET_BAD_ACTIONS.forEach((action, index) => {
    pushQuestion(questionAnswer, "planet-protector-game", {
      content_id: `planet-protector-game:bad:${index + 1}`,
      item_type: "action_item",
      prompt: action,
      choices_json: JSON.stringify(["good", "bad"]),
      correct_answer: "bad",
      category: "environmental_action",
      mode: "",
      grade_band: "",
    });
  });

  pushNarrative(narrative, "planet-protector-game", {
    content_id: "planet-protector-game:menu-description",
    narrative_kind: "game_description",
    text: "Let good actions naturally reach Earth for +1 point and stop the bad actions for +1 point! Bonus: Drag good actions from the right onto bad actions to cancel out the bad for +2 points!",
    audio_path: "",
  });

  wellbeing.BUDGET_ITEMS.forEach((item, index) => {
    pushQuestion(questionAnswer, "budgeting-game", {
      content_id: `budgeting-game:item:${index + 1}`,
      item_type: "budget_item",
      prompt: item.name,
      choices_json: JSON.stringify(["need", "want"]),
      correct_answer: item.category,
      category: item.category,
      mode: "",
      grade_band: "",
    });
  });

  wellbeing.BANKING_WORDS.forEach((entry, index) => {
    pushQuestion(questionAnswer, "banking-word-search", {
      content_id: `banking-word-search:word:${index + 1}`,
      item_type: "definition",
      prompt: entry.word,
      choices_json: JSON.stringify([entry.definition]),
      correct_answer: entry.word,
      category: "banking_vocabulary",
      mode: "",
      grade_band: "",
    });
    pushFeedback(feedback, "banking-word-search", {
      content_id: `banking-word-search:word:${index + 1}`,
      item_type: "definition",
      prompt: entry.word,
      feedback_text: entry.definition,
      feedback_kind: "definition",
    });
  });

  wellbeing.STUDY_HABITS.forEach((habit, index) => {
    pushQuestion(questionAnswer, "study-habits-game", {
      content_id: `study-habits-game:habit:${index + 1}`,
      item_type: "sort_item",
      prompt: habit.name,
      choices_json: JSON.stringify(["good", "bad"]),
      correct_answer: habit.category,
      category: habit.category,
      mode: "",
      grade_band: "",
    });
  });

  wellbeing.HEALTHY_PLATE_FOODS.forEach((food) => {
    pushQuestion(questionAnswer, "healthy-plate", {
      content_id: `healthy-plate:food:${food.id}`,
      item_type: "food_item",
      prompt: food.name,
      choices_json: JSON.stringify(["vegetable", "fruit", "protein", "grain", "junk"]),
      correct_answer: food.category,
      category: food.category,
      mode: "",
      grade_band: "",
    });
  });

  wellbeing.SURYA_POSES.forEach((pose) => {
    pushQuestion(questionAnswer, "surya-namaskar", {
      content_id: `surya-namaskar:pose:${pose.id}`,
      item_type: "pose",
      prompt: `${pose.name} (${pose.sanskrit})`,
      choices_json: JSON.stringify([pose.subtitle, pose.image]),
      correct_answer: String(pose.id),
      category: "sun_salutation_sequence",
      mode: "",
      grade_band: "",
    });
    pushNarrative(narrative, "surya-namaskar", {
      content_id: `surya-namaskar:pose:${pose.id}:subtitle`,
      narrative_kind: "pose_cue",
      text: pose.subtitle,
      audio_path: pose.image,
    });
  });

  wellbeing.DREAM_JOB_QUESTIONS.forEach((question, index) => {
    pushQuestion(questionAnswer, "dream-job-builder", {
      content_id: `dream-job-builder:question:${index + 1}`,
      item_type: "trait_quiz",
      prompt: question.text,
      choices_json: JSON.stringify(question.options),
      correct_answer: "",
      category: "career_traits",
      mode: "",
      grade_band: "",
    });
  });

  wellbeing.DREAM_JOB_CAREERS.forEach((career, index) => {
    pushNarrative(narrative, "dream-job-builder", {
      content_id: `dream-job-builder:career:${index + 1}`,
      narrative_kind: "career_result",
      text: `${career.title}: ${career.description}`,
      audio_path: "",
    });
  });

  wellbeing.SKILLS_JOBS_SKILLS.forEach((skill) => {
    pushQuestion(questionAnswer, "skills-jobs-sort", {
      content_id: `skills-jobs-sort:skill:${skill.id}`,
      item_type: "skill_match",
      prompt: skill.name,
      choices_json: JSON.stringify(wellbeing.SKILLS_JOBS_CAREERS.map((career) => career.title)),
      correct_answer: skill.correctCareer,
      category: "career_skill",
      mode: "",
      grade_band: "",
    });
  });

  wellbeing.JOB_PATH_JOBS.forEach((job, jobIndex) => {
    pushNarrative(narrative, "job-path-maze", {
      content_id: `job-path-maze:job:${jobIndex + 1}:fact`,
      narrative_kind: "career_fact",
      text: `${job.title}: ${job.fact}`,
      audio_path: "",
    });
    job.checkpoints.forEach((checkpoint, checkpointIndex) => {
      pushQuestion(questionAnswer, "job-path-maze", {
        content_id: `job-path-maze:job:${jobIndex + 1}:checkpoint:${checkpointIndex + 1}`,
        item_type: "mcq",
        prompt: checkpoint.question,
        choices_json: JSON.stringify(checkpoint.options),
        correct_answer: checkpoint.options[checkpoint.correct],
        category: job.title,
        mode: "",
        grade_band: "",
      });
      pushFeedback(feedback, "job-path-maze", {
        content_id: `job-path-maze:job:${jobIndex + 1}:checkpoint:${checkpointIndex + 1}`,
        item_type: "mcq",
        prompt: checkpoint.question,
        feedback_text: checkpoint.explanation,
        feedback_kind: "explanation",
      });
    });
  });
}

function collectInstructions(narrative: NarrativeRow[]): void {
  Object.entries(GAME_INSTRUCTIONS).forEach(([route, instruction]) => {
    const routeMeta = GAME_ROUTES.find((entry) => entry.route === route);
    narrative.push({
      content_id: `instruction:${route}`,
      course: routeMeta?.course ?? "Platform",
      game_id: routeMeta?.game_id ?? route.replace(/^\//, ""),
      route,
      narrative_kind: "mascot_instruction",
      text: instruction.text,
      audio_path: instruction.audio,
    });
  });
}

function collectSetDescriptions(narrative: NarrativeRow[]): void {
  SET1_GAMES.forEach((game) => {
    const routeMeta = GAME_ROUTES.find((entry) => entry.route === game.route);
    if (!routeMeta) return;
    narrative.push({
      content_id: `know-your-health-set-1:${game.number}`,
      course: routeMeta.course,
      game_id: routeMeta.game_id,
      route: routeMeta.route,
      narrative_kind: "set_card_description",
      text: game.description,
      audio_path: "",
    });
  });

  TDW_SET1_GAMES.forEach((game) => {
    const routeMeta = GAME_ROUTES.find((entry) => entry.route === game.route);
    if (!routeMeta) return;
    narrative.push({
      content_id: `3d-wellness-set-1:${game.number}`,
      course: routeMeta.course,
      game_id: routeMeta.game_id,
      route: routeMeta.route,
      narrative_kind: "set_card_description",
      text: game.description,
      audio_path: "",
    });
  });
}

function buildOrganization(): OrganizationNode[] {
  const knowYourHealthSet: OrganizationNode = {
    id: "know-your-health-set-1",
    type: "set",
    name: "Know Your Health Set 1",
    description: "One game from each Know Your Health module.",
    route: "/know-your-health/set-1",
    parent_id: "know-your-health",
    sequence: 1,
    children: SET1_GAMES.map((game) => ({
      id: `know-your-health-set-1:${game.number}`,
      type: "game",
      name: game.name,
      description: game.description,
      route: game.route,
      parent_id: "know-your-health-set-1",
      sequence: game.number,
      children: [],
    })),
  };

  const tdwSet: OrganizationNode = {
    id: "3d-wellness-set-1",
    type: "set",
    name: "3D Wellness Set 1",
    description: "One game from each wellness dimension.",
    route: "/3d-wellness/set-1",
    parent_id: "3d-wellness",
    sequence: 1,
    children: TDW_SET1_GAMES.map((game) => ({
      id: `3d-wellness-set-1:${game.number}`,
      type: "game",
      name: game.name,
      description: game.description,
      route: game.route,
      parent_id: "3d-wellness-set-1",
      sequence: game.number,
      children: [],
    })),
  };

  const knowYourHealth: OrganizationNode = {
    id: "know-your-health",
    type: "course",
    name: "Know Your Health",
    description: "Seven-module health literacy course.",
    route: "/know-your-health",
    parent_id: "platform",
    sequence: 1,
    children: [knowYourHealthSet],
  };

  const tdw: OrganizationNode = {
    id: "3d-wellness",
    type: "course",
    name: "3D Wellness",
    description: "Eight-dimension wellness course.",
    route: "/3d-wellness",
    parent_id: "platform",
    sequence: 2,
    children: [tdwSet],
  };

  const additionalGames = GAME_ROUTES.filter(
    (route) => !route.set_name || route.set_sequence === null,
  ).map((route, index) => ({
    id: route.game_id,
    type: "game" as const,
    name: route.game_title,
    description: route.module_or_dimension,
    route: route.route,
    parent_id: "platform",
    sequence: index + 1,
    children: [],
  }));

  return [
    {
      id: "platform",
      type: "hub",
      name: "EndsideOut Games",
      description: "Course and game hierarchy for authored content.",
      route: "/",
      parent_id: "",
      sequence: null,
      children: [knowYourHealth, tdw, ...additionalGames],
    },
  ];
}

function buildProgression(): ProgressionRow[] {
  return [
    {
      game_id: "sometimes-anytime-food",
      game_title: "Sometimes or Anytime?",
      route: "/sometimes-anytime-food",
      course: "Know Your Health",
      module_or_dimension: "Module 1",
      set_name: "Know Your Health Set 1",
      set_sequence: "1",
      game_duration_seconds: "60",
      points_correct: "10",
      scoring_notes: "Correct sorts add points during timed play.",
      progression_notes: "Mode 1 and Mode 2 use different food banks.",
    },
    {
      game_id: "least-sugar-game",
      game_title: "Added vs. Natural Sugar",
      route: "/least-sugar-game",
      course: "Know Your Health",
      module_or_dimension: "Module 2",
      set_name: "Know Your Health Set 1",
      set_sequence: "2",
      game_duration_seconds: "120",
      points_correct: "10",
      scoring_notes: "Each correct binary choice awards 10 points.",
      progression_notes: "Five fixed rounds on added versus natural sugar.",
    },
    {
      game_id: "brain-health-game",
      game_title: "Help Flame-man!",
      route: "/brain-health-game",
      course: "Know Your Health",
      module_or_dimension: "Module 3",
      set_name: "Know Your Health Set 1",
      set_sequence: "3",
      game_duration_seconds: "90",
      points_correct: "10",
      scoring_notes: "Correct scenario answers award 10 points and raise flame level.",
      progression_notes: "Five brain-health scenarios in sequence.",
    },
    {
      game_id: "water-glass-game",
      game_title: "Fill the Glass!",
      route: "/water-glass-game",
      course: "Know Your Health",
      module_or_dimension: "Module 4",
      set_name: "Know Your Health Set 1",
      set_sequence: "4",
      game_duration_seconds: "120",
      points_correct: "10",
      scoring_notes: "Correct answers fill the glass and add score.",
      progression_notes: "Four hydration questions in sequence.",
    },
    {
      game_id: "finish-race-game",
      game_title: "Finish the Race!",
      route: "/finish-race-game",
      course: "Know Your Health",
      module_or_dimension: "Module 5",
      set_name: "Know Your Health Set 1",
      set_sequence: "5",
      game_duration_seconds: "120",
      points_correct: "10",
      scoring_notes: "Correct answers move the runner and add score.",
      progression_notes: "Pre-K uses first three questions; grade 3 uses all five.",
    },
    {
      game_id: "habit-guard-game",
      game_title: "Guard Your Health!",
      route: "/habit-guard-game",
      course: "Know Your Health",
      module_or_dimension: "Module 6",
      set_name: "Know Your Health Set 1",
      set_sequence: "6",
      game_duration_seconds: "",
      points_correct: "",
      scoring_notes: "Good habits increase score; bad habits add pimples up to 5.",
      progression_notes: "Pre-K and older modes use different habit banks.",
    },
    {
      game_id: "body-image-game",
      game_title: "Body Image Mirror",
      route: "/body-image-game",
      course: "Know Your Health",
      module_or_dimension: "Module 7",
      set_name: "Know Your Health Set 1",
      set_sequence: "7",
      game_duration_seconds: "",
      points_correct: "20",
      scoring_notes: "Each correct statement classification awards 20 points.",
      progression_notes: "Five body-image statements in sequence.",
    },
    {
      game_id: "principle-of-relationship-pair-matching-game",
      game_title: "Principle of Relationship",
      route: "/principle-of-relationship-pair-matching-game",
      course: "3D Wellness",
      module_or_dimension: "Social Wellbeing",
      set_name: "3D Wellness Set 1",
      set_sequence: "1",
      game_duration_seconds: "90",
      points_correct: "",
      scoring_notes: "Pair matching uses moves and remaining time.",
      progression_notes: "Six relationship principles are matched in pairs.",
    },
    {
      game_id: "fruit-vegetable-matching-game",
      game_title: "Fruit & Vegetable Matching",
      route: "/fruit-vegetable-matching-game",
      course: "3D Wellness",
      module_or_dimension: "Social Wellbeing",
      set_name: "",
      set_sequence: "",
      game_duration_seconds: "40",
      points_correct: "",
      scoring_notes: "Timed sort into fruit and vegetable columns.",
      progression_notes: "Twenty total items across fruit and vegetable banks.",
    },
    {
      game_id: "fruit-veggie-quiz",
      game_title: "Fruit & Veggie Quiz",
      route: "/fruit-veggie-quiz",
      course: "3D Wellness",
      module_or_dimension: "Social Wellbeing",
      set_name: "",
      set_sequence: "",
      game_duration_seconds: "",
      points_correct: "1",
      scoring_notes: "Shared quiz awards one point per correct answer.",
      progression_notes: "Six fruit versus vegetable classification questions.",
    },
    {
      game_id: "challenge-quiz",
      game_title: "Mental Health Challenge",
      route: "/challenge-quiz",
      course: "3D Wellness",
      module_or_dimension: "Social Wellbeing",
      set_name: "",
      set_sequence: "",
      game_duration_seconds: "",
      points_correct: "1",
      scoring_notes: "Shared quiz awards one point per correct answer.",
      progression_notes: "Eight challenge cards grouped by topic and resource.",
    },
    {
      game_id: "emotion-detective-game",
      game_title: "Emotional Detective",
      route: "/emotion-detective-game",
      course: "3D Wellness",
      module_or_dimension: "Emotional Wellbeing",
      set_name: "3D Wellness Set 1",
      set_sequence: "2",
      game_duration_seconds: "",
      points_correct: "",
      scoring_notes: "Scenario emotion identification with multiple acceptable answers on some prompts.",
      progression_notes: "Ten emotion scenarios in sequence.",
    },
    {
      game_id: "eco-fix-it-game",
      game_title: "Eco Sort Challenge",
      route: "/environmental-wellbeing/eco-fix-it",
      course: "3D Wellness",
      module_or_dimension: "Environmental Wellbeing",
      set_name: "3D Wellness Set 1",
      set_sequence: "3",
      game_duration_seconds: "60",
      points_correct: "",
      scoring_notes: "Timed eco-friendly sort with score on correct placements.",
      progression_notes: "Twenty eco items split across friendly and not-friendly banks.",
    },
    {
      game_id: "planet-protector-game",
      game_title: "Planet Protector",
      route: "/environmental-wellbeing/planet-protector",
      course: "3D Wellness",
      module_or_dimension: "Environmental Wellbeing",
      set_name: "",
      set_sequence: "",
      game_duration_seconds: "30",
      points_correct: "1",
      scoring_notes: "Good actions +1; stopping bad actions +1; cancel combo +2.",
      progression_notes: "Falling good and bad environmental actions.",
    },
    {
      game_id: "budgeting-game",
      game_title: "Budgeting Jars",
      route: "/budgeting-game",
      course: "3D Wellness",
      module_or_dimension: "Financial Literacy",
      set_name: "3D Wellness Set 1",
      set_sequence: "4",
      game_duration_seconds: "120",
      points_correct: "",
      scoring_notes: "Score equals number of correctly sorted need versus want items.",
      progression_notes: "Ten budget items presented in shuffled order.",
    },
    {
      game_id: "banking-word-search",
      game_title: "Banking Word Search",
      route: "/banking-word-search",
      course: "3D Wellness",
      module_or_dimension: "Financial Literacy",
      set_name: "",
      set_sequence: "",
      game_duration_seconds: "120",
      points_correct: "10",
      scoring_notes: "Each found word awards 10 points.",
      progression_notes: "Five words selected per session from a 13-word bank.",
    },
    {
      game_id: "study-habits-game",
      game_title: "Study Habits Sort",
      route: "/study-habits-game",
      course: "3D Wellness",
      module_or_dimension: "Intellectual Wellbeing",
      set_name: "3D Wellness Set 1",
      set_sequence: "5",
      game_duration_seconds: "90",
      points_correct: "",
      scoring_notes: "Timed sort of six randomly selected habits into good and bad columns.",
      progression_notes: "Full bank contains 24 study habits.",
    },
    {
      game_id: "dream-job-builder",
      game_title: "Dream Job Builder",
      route: "/dream-job-builder",
      course: "3D Wellness",
      module_or_dimension: "Occupational Wellbeing",
      set_name: "3D Wellness Set 1",
      set_sequence: "6",
      game_duration_seconds: "",
      points_correct: "",
      scoring_notes: "Trait-weighted answers map to top career matches.",
      progression_notes: "Five trait questions followed by career reveal.",
    },
    {
      game_id: "job-path-maze",
      game_title: "Job Path Maze",
      route: "/job-path-maze",
      course: "3D Wellness",
      module_or_dimension: "Occupational Wellbeing",
      set_name: "",
      set_sequence: "",
      game_duration_seconds: "60",
      points_correct: "",
      scoring_notes: "Three lives; 60 seconds per career path; score accumulates across checkpoints.",
      progression_notes: "Six careers with four checkpoints each.",
    },
    {
      game_id: "skills-jobs-sort",
      game_title: "Skills Jobs Sort",
      route: "/skills-jobs-sort",
      course: "3D Wellness",
      module_or_dimension: "Occupational Wellbeing",
      set_name: "",
      set_sequence: "",
      game_duration_seconds: "90",
      points_correct: "10",
      scoring_notes: "Each correct skill-to-career match awards 10 points.",
      progression_notes: "Eight skills matched to four careers.",
    },
    {
      game_id: "healthy-plate",
      game_title: "Healthy Plate Builder",
      route: "/healthy-plate",
      course: "3D Wellness",
      module_or_dimension: "Physical Wellbeing",
      set_name: "3D Wellness Set 1",
      set_sequence: "7",
      game_duration_seconds: "90",
      points_correct: "",
      scoring_notes: "Plate health percentage derives from food healthScore values.",
      progression_notes: "Up to six foods placed on the plate within 90 seconds.",
    },
    {
      game_id: "surya-namaskar",
      game_title: "Surya Namaskar",
      route: "/surya-namaskar",
      course: "3D Wellness",
      module_or_dimension: "Spiritual Wellbeing",
      set_name: "3D Wellness Set 1",
      set_sequence: "8",
      game_duration_seconds: "120",
      points_correct: "10",
      scoring_notes: "Each correctly ordered pose awards 10 points.",
      progression_notes: "Twelve-pose sun salutation sequence.",
    },
  ];
}

export function collectExportBundle(): ExportBundle {
  const questionAnswer: QuestionAnswerRow[] = [];
  const feedback: FeedbackRow[] = [];
  const narrative: NarrativeRow[] = [];

  collectKnowYourHealth(questionAnswer, feedback, narrative);
  collectWellbeing(questionAnswer, feedback, narrative);
  collectInstructions(narrative);
  collectSetDescriptions(narrative);

  return {
    questionAnswer,
    feedback,
    narrative,
    progression: buildProgression(),
    organization: buildOrganization(),
  };
}
