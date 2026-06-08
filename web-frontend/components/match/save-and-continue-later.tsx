"use client";

import { Save } from "lucide-react";

export function SaveAndContinueLater({
  lastSavedLabel,
  onSave,
}: {
  lastSavedLabel?: string | null;
  onSave: () => void;
}) {
  return (
    <div className="grid gap-2 rounded-md border border-border bg-surface p-3">
      <button
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
        type="button"
        onClick={onSave}
      >
        <Save className="h-4 w-4" aria-hidden="true" />
        Salvar e continuar depois
      </button>
      <p className="text-center text-xs text-muted">
        {lastSavedLabel ?? "Progresso salvo neste dispositivo."}
      </p>
    </div>
  );
}
