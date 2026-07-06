"use client";

import type { SearchResultFilters } from "@/lib/types";

const roomTypes = [
  { label: "Qualquer tipo", value: "" },
  { label: "Quarto individual", value: "private" },
  { label: "Quarto compartilhado", value: "shared" },
  { label: "Suíte", value: "suite" },
] as const;

const genderPolicies = [
  { label: "Qualquer política", value: "" },
  { label: "Todos os generos", value: "all_genders" },
  { label: "Casa mista", value: "mixed" },
  { label: "Casa feminina", value: "women_only" },
  { label: "Casa masculina", value: "men_only" },
] as const;

const simpleOptions = {
  guests: [
    { label: "Qualquer regra", value: "" },
    { label: "Hospedes permitidos", value: "allowed" },
    { label: "Hospedes combinados", value: "limited" },
    { label: "Sem hospedes", value: "not_allowed" },
  ],
  noise: [
    { label: "Qualquer nível", value: "" },
    { label: "Silencioso", value: "quiet" },
    { label: "Equilibrado", value: "balanced" },
    { label: "Movimentado", value: "lively" },
  ],
  pets: [
    { label: "Qualquer política", value: "" },
    { label: "Pets permitidos", value: "allowed" },
    { label: "Sem pets", value: "not_allowed" },
  ],
  smoker: [
    { label: "Qualquer política", value: "" },
    { label: "Fumante ok", value: "allowed" },
    { label: "So fora de casa", value: "outside_only" },
    { label: "Não fumante", value: "not_allowed" },
  ],
} as const;

const compatOptions = ["foco em estudos", "organizada", "silenciosa", "social na medida"];
const ruleOptions = [
  { label: "Visitas combinadas", value: "visitas-combinadas" },
  { label: "Sem fumante", value: "sem-fumante" },
  { label: "Contrato pronto", value: "contrato-pronto" },
  { label: "Rotina silenciosa", value: "rotina-silenciosa" },
];

export function FilterPanel({
  filters,
  submitLabel = "Aplicar filtros",
}: {
  filters: SearchResultFilters;
  submitLabel?: string;
}) {
  return (
    <form action="/buscar/resultados" className="grid gap-5" method="get">
      <input name="sort" type="hidden" value={filters.sort} />
      <input name="view" type="hidden" value={filters.view} />

      <div className="grid gap-3">
        <Field label="Campus, universidade ou bairro">
          <input
            className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            defaultValue={filters.location ?? filters.campus}
            name="location"
            placeholder="PUC Minas, UFMG, Savassi"
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Custo mensal max.">
            <input
              className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              defaultValue={filters.totalMax}
              inputMode="numeric"
              name="totalMax"
              placeholder="1200"
            />
          </Field>
          <Field label="Pagar hoje max.">
            <input
              className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              defaultValue={filters.dueTodayMax}
              inputMode="numeric"
              name="dueTodayMax"
              placeholder="700"
            />
          </Field>
          <Field label="Disponibilidade">
            <input
              className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              defaultValue={filters.availability}
              name="availability"
              type="date"
            />
          </Field>
          <Field label="Até o campus">
            <input
              className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              defaultValue={filters.commuteMax}
              inputMode="numeric"
              name="commuteMax"
              placeholder="15 min"
            />
          </Field>
        </div>

        <Field label="Tipo de quarto">
          <Select defaultValue={filters.roomType ?? ""} name="roomType" options={roomTypes} />
        </Field>

        <div className="grid gap-2">
          <Toggle name="billsIncluded" checked={filters.billsIncluded} label="Contas inclusas" />
          <Toggle name="furnished" checked={filters.furnished} label="Mobiliado" />
          <Toggle name="study" checked={filters.study} label="Bom para estudos" />
          <Toggle name="verified" checked={filters.verified} label="Somente verificados" />
        </div>
      </div>

      <details className="rounded-md border border-border bg-surface-muted p-3" open>
        <summary className="cursor-pointer text-sm font-bold text-muted-strong">
          Convivência e regras da casa
        </summary>
        <div className="mt-3 grid gap-3">
          <Field label="Genero/política da casa">
            <Select
              defaultValue={filters.genderPolicy ?? ""}
              name="genderPolicy"
              options={genderPolicies}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Pets">
              <Select defaultValue={filters.pets ?? ""} name="pets" options={simpleOptions.pets} />
            </Field>
            <Field label="Fumante">
              <Select
                defaultValue={filters.smoker ?? ""}
                name="smoker"
                options={simpleOptions.smoker}
              />
            </Field>
            <Field label="Ruido">
              <Select defaultValue={filters.noise ?? ""} name="noise" options={simpleOptions.noise} />
            </Field>
            <Field label="Hospedes">
              <Select
                defaultValue={filters.guests ?? ""}
                name="guests"
                options={simpleOptions.guests}
              />
            </Field>
          </div>
          <Field label="Duração mínima max.">
            <input
              className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              defaultValue={filters.minStayMax}
              inputMode="numeric"
              name="minStayMax"
              placeholder="6 meses"
            />
          </Field>
        </div>
      </details>

      <CheckboxGroup
        label="Compatibilidade de convivência"
        name="compat"
        options={compatOptions.map((value) => ({ label: value, value }))}
        selected={filters.compatibility}
      />

      <CheckboxGroup
        label="Regras da casa"
        name="houseRules"
        options={ruleOptions}
        selected={filters.houseRules}
      />

      <div className="sticky bottom-0 -mx-4 grid gap-2 border-t border-border bg-surface p-4 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <button
          className="inline-flex h-12 items-center justify-center rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
          type="submit"
        >
          {submitLabel}
        </button>
        <a
          className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
          href="/buscar/resultados"
        >
          Limpar filtros
        </a>
      </div>
    </form>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold text-muted-strong">{label}</span>
      {children}
    </label>
  );
}

function Select({
  defaultValue,
  name,
  options,
}: {
  defaultValue: string;
  name: string;
  options: readonly { label: string; value: string }[];
}) {
  return (
    <select
      className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      defaultValue={defaultValue}
      name={name}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function Toggle({
  checked,
  label,
  name,
}: {
  checked?: boolean;
  label: string;
  name: string;
}) {
  return (
    <label className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 text-sm font-bold text-muted-strong">
      {label}
      <input
        className="h-5 w-5 accent-brand"
        defaultChecked={checked}
        name={name}
        type="checkbox"
        value="true"
      />
    </label>
  );
}

function CheckboxGroup({
  label,
  name,
  options,
  selected,
}: {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  selected: string[];
}) {
  return (
    <fieldset className="grid gap-2 rounded-md border border-border bg-surface p-3">
      <legend className="px-1 text-sm font-bold text-muted-strong">
        {label}
      </legend>
      <div className="grid gap-2">
        {options.map((option) => (
          <label
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-surface-muted px-3 text-sm font-medium text-muted-strong"
            key={option.value}
          >
            <input
              className="h-4 w-4 accent-brand"
              defaultChecked={selected.includes(option.value)}
              name={name}
              type="checkbox"
              value={option.value}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
