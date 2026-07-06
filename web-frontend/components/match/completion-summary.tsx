"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import type { MatchAnswers } from "@/lib/types";
import { MatchProfilePreview } from "./match-profile-preview";

export function CompletionSummary({
  answers,
  onRestart,
}: {
  answers: MatchAnswers;
  onRestart: () => void;
}) {
  return (
    <section className="grid gap-5 rounded-md border border-border bg-surface p-4 shadow-xs sm:p-5">
      <div className="grid gap-2">
        <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-success">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          perfil concluido
        </p>
        <h1 className="font-display text-3xl font-bold text-balance text-foreground">
          Seu perfil de convivência esta pronto.
        </h1>
        <p className="text-pretty text-sm leading-6 text-muted">
          Este resumo pode alimentar o score de compatibilidade, ordenar
          resultados e ajudar locadores a entenderem seu estilo de casa.
        </p>
      </div>

      <MatchProfilePreview answers={answers} />

      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <Link
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
          href="/buscar/resultados"
        >
          Ver moradias compatíveis
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
          type="button"
          onClick={onRestart}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Refazer
        </button>
      </div>
    </section>
  );
}
