"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  BudgetPreferenceAnswer,
  MatchAnswers,
  MatchAnswerValue,
  MatchBudgetStep,
  MatchDealBreakersStep,
  MatchMultiChoiceStep,
  MatchOptionalInfoStep,
  MatchRangeStep,
  MatchWizardStep,
  OptionalInfoAnswer,
} from "@/lib/types";
import { BudgetStep } from "./budget-step";
import { CompletionSummary } from "./completion-summary";
import { DealBreakersStep } from "./deal-breakers-step";
import { MatchProfilePreview } from "./match-profile-preview";
import { MatchProgress } from "./match-progress";
import { MultiChoiceStep } from "./multi-choice-step";
import { OptionalInfoStep } from "./optional-info-step";
import { QuestionStep } from "./question-step";
import { RangePreferenceStep } from "./range-preference-step";
import { SaveAndContinueLater } from "./save-and-continue-later";

const storageKey = "uai-quartos-match-profile-v1";

interface PersistedMatchState {
  answers: MatchAnswers;
  completed: boolean;
  currentStepId: string;
  savedAt: string;
}

interface RuntimeState {
  answers: MatchAnswers;
  completed: boolean;
  currentStepId?: string;
  lastSavedLabel: string | null;
}

export function MatchWizardShell({
  initialStepId,
  steps,
}: {
  initialStepId?: string;
  steps: MatchWizardStep[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [runtime, setRuntime] = useState<RuntimeState>(() =>
    getInitialRuntime(steps, initialStepId),
  );
  const [error, setError] = useState<string | null>(null);
  const { answers, completed, currentStepId, lastSavedLabel } = runtime;

  const currentIndex = Math.max(
    steps.findIndex((step) => step.id === currentStepId),
    0,
  );
  const currentStep = steps[currentIndex];

  function updateUrl(stepId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", stepId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function updateAnswer(stepId: string, value: MatchAnswerValue) {
    setRuntime((current) => ({
      ...current,
      answers: {
        ...current.answers,
        [stepId]: value,
      },
    }));
    setError(null);
  }

  function goTo(index: number) {
    const next = steps[index];
    if (!next) return;
    setRuntime((current) => ({ ...current, currentStepId: next.id }));
    updateUrl(next.id);
    setError(null);
  }

  function next() {
    if (!currentStep) return;

    const validation = validateStep(currentStep, answers[currentStep.id]);
    if (validation) {
      setError(validation);
      return;
    }

    if (currentIndex >= steps.length - 1) {
      const finalAnswers = ensureStepDefaults(steps, answers);
      setRuntime((current) => ({
        ...current,
        answers: finalAnswers,
        completed: true,
      }));
      persist(finalAnswers, currentStep.id, true);
      return;
    }

    const nextStep = steps[currentIndex + 1];
    persist(ensureStepDefaults([currentStep], answers), nextStep.id, false);
    goTo(currentIndex + 1);
  }

  function previous() {
    goTo(Math.max(currentIndex - 1, 0));
  }

  function saveProgress() {
    const nextAnswers = ensureStepDefaults(steps, answers);
    setRuntime((current) => ({ ...current, answers: nextAnswers }));
    persist(nextAnswers, currentStep?.id ?? steps[0]?.id, completed);
  }

  function restart() {
    window.localStorage.removeItem(storageKey);
    const firstStepId = steps[0]?.id;
    setRuntime({
      answers: {},
      completed: false,
      currentStepId: firstStepId,
      lastSavedLabel: null,
    });
    if (firstStepId) updateUrl(firstStepId);
    setError(null);
  }

  function persist(
    nextAnswers: MatchAnswers,
    stepId: string | undefined,
    isCompleted: boolean,
  ) {
    if (!stepId) return;
    const savedAt = new Date().toISOString();
    const payload: PersistedMatchState = {
      answers: nextAnswers,
      completed: isCompleted,
      currentStepId: stepId,
      savedAt,
    };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    setRuntime((current) => ({
      ...current,
      lastSavedLabel: formatSavedAt(savedAt),
    }));
  }

  const answer = currentStep ? answers[currentStep.id] : undefined;
  const normalizedAnswers = useMemo(
    () => ensureStepDefaults(steps, answers),
    [answers, steps],
  );

  if (completed) {
    return (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <CompletionSummary answers={normalizedAnswers} onRestart={restart} />
      </div>
    );
  }

  if (!currentStep) return null;

  return (
    <div className="grid gap-5">
      <MatchProgress currentIndex={currentIndex} steps={steps} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="grid gap-4">
          <QuestionStep
            category={currentStep.category}
            error={error}
            optional={currentStep.optional}
            title={currentStep.title}
            why={currentStep.why}
          >
            <StepRenderer
              answer={answer}
              step={currentStep}
              onChange={(value) => updateAnswer(currentStep.id, value)}
            />
          </QuestionStep>

          <div className="grid gap-3 rounded-md border border-border bg-surface p-3 shadow-xs sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted disabled:opacity-60"
              disabled={currentIndex === 0}
              type="button"
              onClick={previous}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar
            </button>
            <p className="text-center text-sm text-muted">
              {currentStep.optional
                ? "Opcional: voce pode avancar sem responder."
                : "Se faltar algo, eu mostro aqui mesmo, sem modal."}
            </p>
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand px-5 text-sm font-bold text-white transition hover:bg-brand-strong"
              type="button"
              onClick={next}
            >
              {currentIndex >= steps.length - 1 ? (
                <>
                  Concluir perfil
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:sticky lg:top-24">
          <MatchProfilePreview answers={normalizedAnswers} />
          <SaveAndContinueLater
            lastSavedLabel={lastSavedLabel}
            onSave={saveProgress}
          />
        </div>
      </div>
    </div>
  );
}

function StepRenderer({
  answer,
  step,
  onChange,
}: {
  answer?: MatchAnswerValue;
  step: MatchWizardStep;
  onChange: (value: MatchAnswerValue) => void;
}) {
  if (step.type === "multi-choice") {
    return (
      <MultiChoiceStep
        answer={answer as string | string[] | undefined}
        step={step as MatchMultiChoiceStep}
        onChange={onChange}
      />
    );
  }

  if (step.type === "range") {
    return (
      <RangePreferenceStep
        answer={answer as Record<string, number> | undefined}
        step={step as MatchRangeStep}
        onChange={onChange}
      />
    );
  }

  if (step.type === "budget") {
    return (
      <BudgetStep
        answer={answer as BudgetPreferenceAnswer | undefined}
        step={step as MatchBudgetStep}
        onChange={onChange}
      />
    );
  }

  if (step.type === "deal-breakers") {
    return (
      <DealBreakersStep
        answer={answer as string[] | undefined}
        step={step as MatchDealBreakersStep}
        onChange={onChange}
      />
    );
  }

  return (
    <OptionalInfoStep
      answer={answer as OptionalInfoAnswer | undefined}
      step={step as MatchOptionalInfoStep}
      onChange={onChange}
    />
  );
}

function validateStep(step: MatchWizardStep, answer?: MatchAnswerValue) {
  if (step.optional) return null;

  if (step.type === "multi-choice") {
    const selected = Array.isArray(answer) ? answer : answer ? [answer] : [];
    const min = step.minSelections ?? 1;
    if (selected.length < min) {
      return "Escolha pelo menos uma opcao para melhorar seu matching.";
    }
  }

  if (step.type === "budget") {
    const value = answer as BudgetPreferenceAnswer | undefined;
    if (!value?.maxMonthly || value.maxMonthly < step.min) {
      return `Informe um orcamento mensal a partir de R$ ${step.min}.`;
    }
    if (value.moveInBudget < 0) {
      return "O valor de entrada nao pode ser negativo.";
    }
  }

  return null;
}

function ensureStepDefaults(steps: MatchWizardStep[], answers: MatchAnswers) {
  const next = { ...answers };

  steps.forEach((step) => {
    if (next[step.id] !== undefined) return;

    if (step.type === "range") {
      next[step.id] = step.fields.reduce<Record<string, number>>((acc, field) => {
        acc[field.id] = field.defaultValue;
        return acc;
      }, {});
    }

    if (step.type === "budget") {
      next[step.id] = {
        maxMonthly: step.suggestedMax,
        moveInBudget: Math.round(step.suggestedMax / 2),
      };
    }

    if (step.type === "deal-breakers") {
      next[step.id] = [];
    }

    if (step.type === "optional-info") {
      next[step.id] = { note: "", priorities: [] };
    }
  });

  return next;
}

function getValidStepId(steps: MatchWizardStep[], stepId?: string) {
  return steps.some((step) => step.id === stepId) ? stepId : undefined;
}

function getInitialRuntime(
  steps: MatchWizardStep[],
  initialStepId?: string,
): RuntimeState {
  const fallbackStepId = getValidStepId(steps, initialStepId) ?? steps[0]?.id;

  if (typeof window === "undefined") {
    return {
      answers: {},
      completed: false,
      currentStepId: fallbackStepId,
      lastSavedLabel: null,
    };
  }

  const stepFromUrl = getValidStepId(steps, initialStepId);
  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return {
      answers: {},
      completed: false,
      currentStepId: fallbackStepId,
      lastSavedLabel: null,
    };
  }

  try {
    const persisted = JSON.parse(raw) as PersistedMatchState;

    return {
      answers: persisted.answers ?? {},
      completed: stepFromUrl ? false : Boolean(persisted.completed),
      currentStepId:
        stepFromUrl ??
        getValidStepId(steps, persisted.currentStepId) ??
        fallbackStepId,
      lastSavedLabel: formatSavedAt(persisted.savedAt),
    };
  } catch {
    return {
      answers: {},
      completed: false,
      currentStepId: fallbackStepId,
      lastSavedLabel: "Nao foi possivel ler o progresso salvo.",
    };
  }
}

function formatSavedAt(value?: string) {
  if (!value) return null;

  return `Salvo as ${new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))}`;
}
