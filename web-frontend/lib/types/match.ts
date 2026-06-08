export type MatchStepType =
  | "budget"
  | "deal-breakers"
  | "multi-choice"
  | "optional-info"
  | "range";

export type MatchChoiceMode = "multiple" | "single";

export interface MatchChoiceOption {
  description?: string;
  id: string;
  label: string;
}

export interface MatchBaseStep {
  category: string;
  id: string;
  optional?: boolean;
  title: string;
  type: MatchStepType;
  why: string;
}

export interface MatchMultiChoiceStep extends MatchBaseStep {
  maxSelections?: number;
  minSelections?: number;
  mode: MatchChoiceMode;
  options: MatchChoiceOption[];
  type: "multi-choice";
}

export interface MatchRangeField {
  defaultValue: number;
  highLabel: string;
  id: string;
  label: string;
  lowLabel: string;
  max: number;
  min: number;
  step: number;
  unit?: string;
}

export interface MatchRangeStep extends MatchBaseStep {
  fields: MatchRangeField[];
  type: "range";
}

export interface MatchBudgetStep extends MatchBaseStep {
  max: number;
  min: number;
  suggestedMax: number;
  type: "budget";
}

export interface MatchDealBreakersStep extends MatchBaseStep {
  options: MatchChoiceOption[];
  type: "deal-breakers";
}

export interface MatchOptionalInfoStep extends MatchBaseStep {
  placeholder: string;
  priorityOptions: MatchChoiceOption[];
  type: "optional-info";
}

export type MatchWizardStep =
  | MatchBudgetStep
  | MatchDealBreakersStep
  | MatchMultiChoiceStep
  | MatchOptionalInfoStep
  | MatchRangeStep;

export interface BudgetPreferenceAnswer {
  maxMonthly: number;
  moveInBudget: number;
}

export interface OptionalInfoAnswer {
  note: string;
  priorities: string[];
}

export type MatchAnswerValue =
  | BudgetPreferenceAnswer
  | OptionalInfoAnswer
  | number
  | Record<string, number>
  | string
  | string[];

export type MatchAnswers = Record<string, MatchAnswerValue | undefined>;

export interface MatchProfileSummary {
  budgetLabel: string;
  dealBreakers: string[];
  houseStyle: string[];
  profileTags: string[];
  routineLabel: string;
  studyLabel: string;
}
