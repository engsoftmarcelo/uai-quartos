"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  FileUp,
  Home,
  KeyRound,
  Loader2,
  LogIn,
  LogOut,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { FinanceWorkspace } from "@/components/finance-workspace";
import { PropertyWorkspace } from "@/components/property-workspace";
import { SocialWorkspace } from "@/components/social-workspace";
import { useAuth, type KycUploadIntent } from "@/contexts/auth-provider";
import type { Role } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("E-mail invalido"),
  password: z.string().min(8, "Mínimo de 8 caracteres"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Informe seu nome").max(120),
  role: z.enum(["STUDENT", "LANDLORD"]),
});

const kycSchema = z.object({
  documentType: z.enum(["RG", "CNH", "PASSPORT", "STUDENT_ID"]),
  filename: z.string().min(1, "Selecione um arquivo"),
  contentType: z.string().min(1, "Arquivo sem tipo identificado"),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type KycValues = z.infer<typeof kycSchema>;
type AuthMode = "login" | "register";

const roleLabel: Record<Role, string> = {
  STUDENT: "Estudante",
  LANDLORD: "Locador",
  ADMIN: "Admin",
};

const kycLabel = {
  PENDING: "Pendente",
  VERIFIED: "Verificado",
  REJECTED: "Rejeitado",
};

export function ProductWorkspace() {
  const auth = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [feedback, setFeedback] = useState<string | null>(null);

  if (auth.isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-[#f4f6f2] text-[#191b18]">
        <div className="flex items-center gap-3 rounded-md border border-[#dfe5d9] bg-white px-4 py-3 text-sm font-medium">
          <Loader2 className="h-4 w-4 animate-spin text-[#27735d]" />
          Sincronizando sessão
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f2] text-[#191b18]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-5 py-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
        <aside className="grid content-start gap-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-[#27735d] text-white">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6258]">
                UAI QUARTOS
              </p>
              <h1 className="text-3xl font-semibold text-[#191b18] sm:text-4xl">
                Mapa de quartos
              </h1>
            </div>
          </div>

          <div className="grid gap-3">
            <Metric icon={ShieldCheck} label="PostGIS" value="GIST" />
            <Metric icon={KeyRound} label="Busca" value="Raio + filtros" />
            <Metric icon={BadgeCheck} label="LGPD" value="Soft delete" />
          </div>

          {auth.user ? (
            <SessionPanel />
          ) : (
            <AuthPanel
              feedback={feedback}
              mode={mode}
              onFeedback={setFeedback}
              onModeChange={setMode}
            />
          )}
        </aside>

        <div className="grid content-start gap-5">
          <PropertyWorkspace />
          <SocialWorkspace />
          <FinanceWorkspace />
        </div>
      </div>
    </div>
  );
}

export default ProductWorkspace;

function AuthPanel({
  feedback,
  mode,
  onFeedback,
  onModeChange,
}: {
  feedback: string | null;
  mode: AuthMode;
  onFeedback: (message: string | null) => void;
  onModeChange: (mode: AuthMode) => void;
}) {
  return (
    <section className="rounded-lg border border-[#dfe5d9] bg-white p-5 shadow-sm">
      <div className="mb-5 grid grid-cols-2 rounded-md bg-[#eef2ea] p-1">
        <button
          className={`flex h-10 items-center justify-center gap-2 rounded-md text-sm font-semibold transition ${
            mode === "login"
              ? "bg-white text-[#191b18] shadow-sm"
              : "text-[#5b6258]"
          }`}
          type="button"
          onClick={() => {
            onModeChange("login");
            onFeedback(null);
          }}
        >
          <LogIn className="h-4 w-4" />
          Entrar
        </button>
        <button
          className={`flex h-10 items-center justify-center gap-2 rounded-md text-sm font-semibold transition ${
            mode === "register"
              ? "bg-white text-[#191b18] shadow-sm"
              : "text-[#5b6258]"
          }`}
          type="button"
          onClick={() => {
            onModeChange("register");
            onFeedback(null);
          }}
        >
          <UserPlus className="h-4 w-4" />
          Criar conta
        </button>
      </div>

      {mode === "login" ? (
        <LoginForm onFeedback={onFeedback} />
      ) : (
        <RegisterForm onFeedback={onFeedback} />
      )}

      {feedback ? (
        <p className="mt-4 rounded-md border border-[#f0b8a8] bg-[#fff4ef] px-3 py-2 text-sm text-[#8a3521]">
          {feedback}
        </p>
      ) : null}
    </section>
  );
}

function LoginForm({ onFeedback }: { onFeedback: (message: string | null) => void }) {
  const { login } = useAuth();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    onFeedback(null);

    try {
      await login(values);
    } catch (error) {
      onFeedback(getErrorMessage(error));
    }
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Field
        error={form.formState.errors.email?.message}
        label="E-mail"
        type="email"
        {...form.register("email")}
      />
      <Field
        error={form.formState.errors.password?.message}
        label="Senha"
        type="password"
        {...form.register("password")}
      />
      <SubmitButton
        icon={LogIn}
        isSubmitting={form.formState.isSubmitting}
        label="Entrar"
      />
    </form>
  );
}

function RegisterForm({
  onFeedback,
}: {
  onFeedback: (message: string | null) => void;
}) {
  const { register } = useAuth();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
    },
  });
  const role = useWatch({ control: form.control, name: "role" });

  async function onSubmit(values: RegisterValues) {
    onFeedback(null);

    try {
      await register(values);
    } catch (error) {
      onFeedback(getErrorMessage(error));
    }
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Field
        error={form.formState.errors.name?.message}
        label="Nome"
        type="text"
        {...form.register("name")}
      />
      <Field
        error={form.formState.errors.email?.message}
        label="E-mail"
        type="email"
        {...form.register("email")}
      />
      <Field
        error={form.formState.errors.password?.message}
        label="Senha"
        type="password"
        {...form.register("password")}
      />

      <div className="grid gap-2">
        <span className="text-sm font-medium text-[#343832]">Perfil</span>
        <div className="grid grid-cols-2 gap-2">
          {(["STUDENT", "LANDLORD"] as const).map((option) => (
            <button
              className={`h-11 rounded-md border text-sm font-semibold transition ${
                role === option
                  ? "border-[#27735d] bg-[#e7f3ed] text-[#174d3d]"
                  : "border-[#dfe5d9] bg-white text-[#5b6258]"
              }`}
              key={option}
              type="button"
              onClick={() => form.setValue("role", option)}
            >
              {roleLabel[option]}
            </button>
          ))}
        </div>
        {form.formState.errors.role?.message ? (
          <p className="text-sm text-[#b9482f]">
            {form.formState.errors.role.message}
          </p>
        ) : null}
      </div>

      <SubmitButton
        icon={UserPlus}
        isSubmitting={form.formState.isSubmitting}
        label="Criar conta"
      />
    </form>
  );
}

function SessionPanel() {
  const { logout, requestKycUpload, user } = useAuth();
  const [intent, setIntent] = useState<KycUploadIntent | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const form = useForm<KycValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      documentType: "RG",
      filename: "",
      contentType: "",
    },
  });

  const statusTone = useMemo(() => {
    if (user?.kycStatus === "VERIFIED") return "bg-[#e7f3ed] text-[#174d3d]";
    if (user?.kycStatus === "REJECTED") return "bg-[#fff4ef] text-[#8a3521]";
    return "bg-[#fff8e8] text-[#72520d]";
  }, [user?.kycStatus]);

  if (!user) return null;

  async function onKycSubmit(values: KycValues) {
    setFeedback(null);
    setIntent(null);

    try {
      const uploadIntent = await requestKycUpload(values);
      setIntent(uploadIntent);
    } catch (error) {
      setFeedback(getErrorMessage(error));
    }
  }

  return (
    <section className="grid gap-5 rounded-lg border border-[#dfe5d9] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6258]">
            Sessão ativa
          </p>
          <h2 className="mt-1 text-2xl font-semibold">{user.name}</h2>
          <p className="mt-1 text-sm text-[#5b6258]">{user.email}</p>
        </div>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#dfe5d9] px-3 text-sm font-semibold text-[#343832] transition hover:bg-[#f4f6f2]"
          type="button"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoBlock label="Papel" value={roleLabel[user.role]} />
        <InfoBlock
          label="KYC"
          value={kycLabel[user.kycStatus]}
          valueClassName={statusTone}
        />
      </div>

      <form className="grid gap-4 border-t border-[#edf1e9] pt-5" onSubmit={form.handleSubmit(onKycSubmit)}>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-[#343832]" htmlFor="documentType">
            Documento
          </label>
          <select
            className="h-11 rounded-md border border-[#dfe5d9] bg-white px-3 text-sm outline-none transition focus:border-[#27735d] focus:ring-2 focus:ring-[#27735d]/15"
            id="documentType"
            {...form.register("documentType")}
          >
            <option value="RG">RG</option>
            <option value="CNH">CNH</option>
            <option value="PASSPORT">Passaporte</option>
            <option value="STUDENT_ID">Carteira estudantil</option>
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-[#343832]" htmlFor="kycFile">
            Arquivo
          </label>
          <input
            accept="image/*,application/pdf"
            className="block w-full rounded-md border border-[#dfe5d9] bg-white text-sm text-[#343832] file:mr-3 file:h-11 file:border-0 file:bg-[#e7f3ed] file:px-3 file:text-sm file:font-semibold file:text-[#174d3d]"
            id="kycFile"
            type="file"
            onChange={(event) => {
              const file = event.target.files?.[0];
              form.setValue("filename", file?.name ?? "", {
                shouldValidate: true,
              });
              form.setValue("contentType", file?.type ?? "", {
                shouldValidate: true,
              });
            }}
          />
          {form.formState.errors.filename?.message ? (
            <p className="text-sm text-[#b9482f]">
              {form.formState.errors.filename.message}
            </p>
          ) : null}
        </div>

        <SubmitButton
          icon={FileUp}
          isSubmitting={form.formState.isSubmitting}
          label="Gerar upload"
        />
      </form>

      {intent ? (
        <div className="rounded-md border border-[#dfe5d9] bg-[#f8faf6] p-3 text-sm">
          <p className="font-semibold text-[#174d3d]">Upload KYC criado</p>
          <p className="mt-1 break-all text-[#5b6258]">{intent.uploadUrl}</p>
        </div>
      ) : null}

      {feedback ? (
        <p className="rounded-md border border-[#f0b8a8] bg-[#fff4ef] px-3 py-2 text-sm text-[#8a3521]">
          {feedback}
        </p>
      ) : null}
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#dfe5d9] bg-white p-4 shadow-sm">
      <Icon className="h-5 w-5 text-[#27735d]" />
      <p className="mt-3 text-sm text-[#5b6258]">{label}</p>
      <p className="text-lg font-semibold text-[#191b18]">{value}</p>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-md border border-[#dfe5d9] p-3">
      <p className="text-sm text-[#5b6258]">{label}</p>
      <p
        className={`mt-1 inline-flex rounded-md px-2 py-1 text-sm font-semibold ${
          valueClassName ?? "bg-[#eef2ea] text-[#343832]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Field({
  error,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: string;
}) {
  const inputId = props.name ?? label;

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-[#343832]" htmlFor={inputId}>
        {label}
      </label>
      <input
        className="h-11 rounded-md border border-[#dfe5d9] bg-white px-3 text-sm outline-none transition focus:border-[#27735d] focus:ring-2 focus:ring-[#27735d]/15"
        id={inputId}
        {...props}
      />
      {error ? <p className="text-sm text-[#b9482f]">{error}</p> : null}
    </div>
  );
}

function SubmitButton({
  icon: Icon,
  isSubmitting,
  label,
}: {
  icon: typeof LogIn;
  isSubmitting: boolean;
  label: string;
}) {
  return (
    <button
      className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#27735d] px-4 text-sm font-semibold text-white transition hover:bg-[#1f604e] disabled:cursor-not-allowed disabled:bg-[#9ab9ad]"
      disabled={isSubmitting}
      type="submit"
    >
      {isSubmitting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      {label}
    </button>
  );
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as { message?: unknown };

    if (Array.isArray(data.message)) {
      return data.message.join(" ");
    }

    if (typeof data.message === "string") {
      return data.message;
    }
  }

  return "Não foi possível concluir a operação.";
}
