"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { InlineMessage } from "@/components/ui/inline-message";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/auth-provider";

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha tem no mínimo 8 caracteres."),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Informe seu nome completo."),
  role: z.enum(["STUDENT", "LANDLORD"]),
});

type RegisterValues = z.infer<typeof registerSchema>;

type Mode = "login" | "register";

function friendlyAuthError(error: unknown, mode: Mode): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "Não foi possível falar com o servidor agora. Tente novamente em instantes.";
    }
    if (error.response.status === 401 || error.response.status === 400) {
      return mode === "login"
        ? "E-mail ou senha incorretos. Confira os dados e tente de novo."
        : "Não foi possível criar a conta com esses dados. Revise e tente de novo.";
    }
    if (error.response.status === 409) {
      return "Já existe uma conta com esse e-mail. Tente entrar.";
    }
  }
  return "Algo deu errado. Tente novamente em instantes.";
}

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("login");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { login, register: registerAccount } = useAuth();
  const router = useRouter();

  const form = useForm<RegisterValues>({
    defaultValues: { email: "", name: "", password: "", role: "STUDENT" },
    resolver: zodResolver(mode === "login" ? (loginSchema as never) : registerSchema),
  });

  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: RegisterValues) {
    setSubmitError(null);
    try {
      if (mode === "login") {
        await login({ email: values.email, password: values.password });
      } else {
        await registerAccount(values);
      }
      router.push(values.role === "LANDLORD" ? "/landlord/dashboard" : "/dashboard");
    } catch (error) {
      setSubmitError(friendlyAuthError(error, mode));
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setSubmitError(null);
    form.clearErrors();
  }

  return (
    <section className="grid gap-5 rounded-md border border-border bg-surface p-4 shadow-xs sm:p-5">
      <div className="grid grid-cols-2 gap-1 rounded-md bg-surface-muted p-1">
        <button
          aria-pressed={mode === "login"}
          className={`rounded-md px-3 py-2 text-sm font-bold transition ${
            mode === "login" ? "bg-surface shadow-xs" : "text-muted"
          }`}
          onClick={() => switchMode("login")}
          type="button"
        >
          Entrar
        </button>
        <button
          aria-pressed={mode === "register"}
          className={`rounded-md px-3 py-2 text-sm font-bold transition ${
            mode === "register" ? "bg-surface shadow-xs" : "text-muted"
          }`}
          onClick={() => switchMode("register")}
          type="button"
        >
          Criar conta
        </button>
      </div>

      {submitError ? (
        <InlineMessage tone="danger" title="Não foi possível continuar">
          {submitError}
        </InlineMessage>
      ) : (
        <InlineMessage
          icon={<ShieldCheck className="h-5 w-5" />}
          tone="success"
          title="Seus dados ficam protegidos"
        >
          Usamos verificação de identidade e seguimos a LGPD para manter a
          plataforma segura para estudantes e locadores.
        </InlineMessage>
      )}

      <form className="grid gap-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        {mode === "register" ? (
          <Input
            autoComplete="name"
            error={errors.name?.message}
            label="Nome completo"
            placeholder="Como aparece no seu documento"
            type="text"
            {...form.register("name")}
          />
        ) : null}
        <Input
          autoComplete="email"
          error={errors.email?.message}
          label="E-mail"
          placeholder="voce@exemplo.com"
          type="email"
          {...form.register("email")}
        />
        <Input
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          error={errors.password?.message}
          label="Senha"
          placeholder="Mínimo de 8 caracteres"
          type="password"
          {...form.register("password")}
        />
        {mode === "register" ? (
          <RadioGroup
            defaultValue="STUDENT"
            label="Quero usar como"
            name="role"
            onValueChange={(value) =>
              form.setValue("role", value as RegisterValues["role"])
            }
            options={[
              {
                description: "Buscar quartos, conversar e reservar visitas.",
                label: "Estudante",
                value: "STUDENT",
              },
              {
                description: "Anunciar quartos e gerenciar candidatos.",
                label: "Locador",
                value: "LANDLORD",
              },
            ]}
          />
        ) : null}
        <Button
          isLoading={isSubmitting}
          leftIcon={
            mode === "login" ? (
              <LogIn className="h-4 w-4" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )
          }
          type="submit"
        >
          {mode === "login" ? "Entrar" : "Criar conta"}
        </Button>
      </form>
    </section>
  );
}
