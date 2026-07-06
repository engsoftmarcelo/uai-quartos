"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, FileCheck2, MapPin, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import type { LandlordListingDraft } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CompatibilityProfileFormSection } from "./compatibility-profile-form-section";
import { HouseRulesFormSection } from "./house-rules-form-section";
import { ListingQualityChecklist } from "./listing-quality-checklist";
import { MediaUploadSection } from "./media-upload-section";
import { PricingTransparencySection } from "./pricing-transparency-section";

const steps = [
  "Mídia",
  "Localização",
  "Custos",
  "Regras",
  "Convivência",
  "Disponibilidade",
  "Documentação",
];

export function ListingWizardShell({
  initialDraft,
  mode,
}: {
  initialDraft: LandlordListingDraft;
  mode: "create" | "edit";
}) {
  const [draft, setDraft] = useState(initialDraft);
  const [activeStep, setActiveStep] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const quality = useMemo(() => {
    const checks = [
      draft.imageUrl.length > 10,
      draft.neighborhood.length > 2,
      draft.monthlyRent > 0,
      draft.depositAmount >= 0,
      draft.houseRules.length >= 3,
      draft.profileTags.length >= 3,
      draft.availabilityLabel.length > 2,
      draft.description.length >= 60,
    ];
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );
    const issues = [
      !checks[0] ? "Adicionar imagem principal real" : null,
      !checks[1] ? "Informar bairro/localização" : null,
      !checks[2] ? "Informar aluguel mensal" : null,
      !checks[4] ? "Selecionar pelo menos três regras da casa" : null,
      !checks[5] ? "Selecionar pelo menos três tags de convivência" : null,
      !checks[7] ? "Escrever descrição objetiva com pelo menos 60 caracteres" : null,
    ].filter(Boolean) as string[];

    return { issues, score };
  }, [draft]);

  function updateDraft(next: Partial<LandlordListingDraft>) {
    setDraft((current) => ({ ...current, ...next }));
    setFeedback(null);
  }

  function saveDraft() {
    setFeedback(
      mode === "create"
        ? "Rascunho pronto para criar anúncio quando a API estiver conectada."
        : "Alteracoes prontas para sincronizar com a API.",
    );
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_23rem] xl:items-start">
      <div className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {steps.map((step, index) => (
            <button
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)]",
                activeStep === index
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-surface text-muted-strong hover:bg-surface-muted",
              )}
              key={step}
              onClick={() => setActiveStep(index)}
              type="button"
            >
              {index < activeStep ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              ) : null}
              {step}
            </button>
          ))}
        </div>

        {activeStep === 0 ? (
          <MediaUploadSection
            imageUrl={draft.imageUrl}
            onChange={(imageUrl) => updateDraft({ imageUrl })}
          />
        ) : null}

        {activeStep === 1 ? (
          <section className="grid gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Localização
              </h2>
              <p className="mt-1 text-sm text-muted">
                Localização clara ajuda o estudante a decidir por campus e
                deslocamento.
              </p>
            </div>
            <Input
              label="Título do anúncio"
              onChange={(event) => updateDraft({ listingTitle: event.target.value })}
              value={draft.listingTitle}
            />
            <Input
              label="Bairro"
              leadingIcon={<MapPin className="h-4 w-4" aria-hidden="true" />}
              onChange={(event) => updateDraft({ neighborhood: event.target.value })}
              value={draft.neighborhood}
            />
            <Textarea
              label="Descrição"
              onChange={(event) => updateDraft({ description: event.target.value })}
              rows={5}
              value={draft.description}
            />
          </section>
        ) : null}

        {activeStep === 2 ? (
          <PricingTransparencySection
            billsIncluded={draft.billsIncluded}
            depositAmount={draft.depositAmount}
            monthlyRent={draft.monthlyRent}
            onBillsIncludedChange={(billsIncluded) => updateDraft({ billsIncluded })}
            onDepositChange={(depositAmount) => updateDraft({ depositAmount })}
            onRentChange={(monthlyRent) => updateDraft({ monthlyRent })}
          />
        ) : null}

        {activeStep === 3 ? (
          <HouseRulesFormSection
            onChange={(houseRules) => updateDraft({ houseRules })}
            rules={draft.houseRules}
          />
        ) : null}

        {activeStep === 4 ? (
          <CompatibilityProfileFormSection
            onProfileTagsChange={(profileTags) => updateDraft({ profileTags })}
            onRoomTypeChange={(roomType) => updateDraft({ roomType })}
            profileTags={draft.profileTags}
            roomType={draft.roomType}
          />
        ) : null}

        {activeStep === 5 ? (
          <section className="grid gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Disponibilidade
              </h2>
              <p className="mt-1 text-sm text-muted">
                Evita conflito de agenda e candidaturas para datas erradas.
              </p>
            </div>
            <Input
              label="Disponível a partir de"
              leadingIcon={<CalendarCheck className="h-4 w-4" aria-hidden="true" />}
              onChange={(event) =>
                updateDraft({ availabilityLabel: event.target.value })
              }
              value={draft.availabilityLabel}
            />
          </section>
        ) : null}

        {activeStep === 6 ? (
          <section className="grid gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Documentação
              </h2>
              <p className="mt-1 text-sm text-muted">
                Checklist visual para futura integração com verificação do
                anúncio e contrato.
              </p>
            </div>
            <div className="grid gap-2 rounded-md bg-surface-muted p-3">
              {[
                "Documento do locador verificado",
                "Comprovante do imóvel preparado",
                "Termos e custos revisados",
              ].map((item) => (
                <p
                  className="inline-flex items-center gap-2 text-sm font-bold text-muted-strong"
                  key={item}
                >
                  <FileCheck2 className="h-4 w-4 text-success" aria-hidden="true" />
                  {item}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            disabled={activeStep === 0}
            disabledReason="Você já esta na primeira etapa."
            onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
            variant="secondary"
          >
            Voltar
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={saveDraft}
              leftIcon={<Save className="h-4 w-4" aria-hidden="true" />}
              variant="secondary"
            >
              Salvar rascunho
            </Button>
            <Button
              onClick={() =>
                setActiveStep((step) => Math.min(steps.length - 1, step + 1))
              }
            >
              {activeStep === steps.length - 1 ? "Revisar anúncio" : "Continuar"}
            </Button>
          </div>
        </div>
        {feedback ? (
          <p className="rounded-md bg-brand-soft p-3 text-sm font-bold text-brand">
            {feedback}
          </p>
        ) : null}
      </div>

      <aside className="grid gap-4 xl:sticky xl:top-6">
        <article className="overflow-hidden rounded-md border border-border bg-surface shadow-xs">
          <div className="relative aspect-[4/3] bg-surface-muted">
            <Image
              alt={draft.listingTitle}
              className="object-cover"
              fill
              sizes="(min-width: 1280px) 368px, 100vw"
              src={draft.imageUrl}
            />
          </div>
          <div className="grid gap-3 p-4">
            <div>
              <Badge tone="brand">preview em tempo real</Badge>
              <h3 className="mt-2 font-display text-xl font-bold text-foreground">
                {draft.listingTitle}
              </h3>
              <p className="mt-1 text-sm text-muted">{draft.neighborhood}</p>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">
              {formatCurrency(draft.monthlyRent)}
              <span className="text-sm font-medium text-muted">/mês</span>
            </p>
            <p className="text-sm leading-6 text-muted">{draft.description}</p>
            <div className="flex flex-wrap gap-2">
              {draft.profileTags.slice(0, 4).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>
        </article>
        <ListingQualityChecklist issues={quality.issues} score={quality.score} />
      </aside>
    </section>
  );
}
