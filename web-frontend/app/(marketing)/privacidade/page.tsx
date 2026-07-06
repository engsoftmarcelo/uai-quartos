import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Como o UAI QUARTOS coleta, usa e protege os seus dados pessoais, em conformidade com a LGPD.",
  alternates: {
    canonical: "/privacidade",
  },
};

const sections = [
  {
    title: "1. Dados que coletamos",
    body: [
      "Coletamos os dados que você informa ao criar a conta (nome, e-mail, perfil de estudante ou locador), os dados necessários para verificação de identidade (documento oficial, quando você opta pela verificação) e dados de uso da plataforma, como buscas, favoritos e mensagens trocadas com outros usuários.",
    ],
  },
  {
    title: "2. Como usamos os seus dados",
    body: [
      "Usamos os dados para operar a plataforma: exibir anúncios relevantes, calcular compatibilidade entre estudantes e vagas, prevenir fraudes, emitir os selos de verificação e melhorar a experiência de busca.",
      "Não vendemos os seus dados pessoais a terceiros.",
    ],
  },
  {
    title: "3. Base legal (LGPD)",
    body: [
      "O tratamento de dados segue a Lei Geral de Proteção de Dados (Lei 13.709/2018). As bases legais aplicadas são a execução de contrato (operação da conta e dos anúncios), o legítimo interesse (prevenção a fraudes e segurança) e o consentimento (comunicações opcionais).",
    ],
  },
  {
    title: "4. Compartilhamento",
    body: [
      "Informações do seu perfil público (nome, foto, selos de verificação e avaliações) ficam visíveis para outros usuários conforme necessário para a negociação. Dados de documentos enviados para verificação não são exibidos publicamente.",
    ],
  },
  {
    title: "5. Seus direitos",
    body: [
      "Você pode solicitar a qualquer momento o acesso, a correção, a portabilidade ou a exclusão dos seus dados pessoais, além de revogar consentimentos. Para exercer esses direitos, entre em contato pelos canais oficiais da plataforma.",
    ],
  },
  {
    title: "6. Segurança e retenção",
    body: [
      "Adotamos medidas técnicas e organizacionais para proteger os dados, incluindo criptografia em trânsito e controle de acesso. Os dados são mantidos apenas pelo tempo necessário para as finalidades descritas ou por obrigação legal.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <article className="uai-container uai-section grid max-w-3xl gap-8">
      <header className="grid gap-3">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand">
          Legal
        </p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Política de privacidade
        </h1>
        <p className="text-muted">
          Última atualização: julho de 2026. Esta política explica como
          tratamos os seus dados. Veja também os nossos{" "}
          <Link className="font-bold text-brand hover:underline" href="/termos">
            Termos de uso
          </Link>
          .
        </p>
      </header>

      {sections.map((section) => (
        <section className="grid gap-3" key={section.title}>
          <h2 className="text-xl font-bold">{section.title}</h2>
          {section.body.map((paragraph) => (
            <p className="leading-7 text-muted-strong" key={paragraph.slice(0, 40)}>
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
