import bank from "@/data/questions.json";

export interface SubQuestion {
  text: string;
  answer: boolean;
  explanation?: string;
}

export interface Scenario {
  id: string;
  scenario: string;
  /** Optional path to a scenario image, e.g. "/scenarios/row-001.jpg".
   *  Use your OWN or licensed images only. */
  image?: string;
  imageAlt?: string;
  subquestions: SubQuestion[];
}

export interface Category {
  category: string;
  questions: Scenario[];
}

export interface Bank {
  meta: Record<string, string>;
  categories: Category[];
}

const typedBank = bank as unknown as Bank;

export function getBank(): Bank {
  return typedBank;
}

export function getCategories(): Category[] {
  return typedBank.categories;
}

export function totalScenarios(): number {
  return typedBank.categories.reduce((n, c) => n + c.questions.length, 0);
}

export function totalOptions(): number {
  return typedBank.categories.reduce(
    (n, c) => n + c.questions.reduce((m, q) => m + q.subquestions.length, 0),
    0
  );
}

/** Build a randomized exam of N scenarios drawn across all categories. */
export function buildExam(size = 25): Scenario[] {
  const all: Scenario[] = typedBank.categories.flatMap((c) => c.questions);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(size, shuffled.length));
}

/** Scenarios for a single named category. */
export function scenariosForCategory(name: string): Scenario[] {
  const c = typedBank.categories.find((c) => c.category === name);
  return c ? c.questions : [];
}
