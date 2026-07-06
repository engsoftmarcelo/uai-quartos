import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de uso",
  description:
    "Condições de uso da plataforma UAI QUARTOS para estudantes e locadores.",
  alternates: {
    canonical: "/termos",
  },
};

const sections = [
  {
    title: "1. Sobre a plataforma",
    body: [
      "O UAI QUARTOS é um marketplace que conecta estudantes em busca de moradia universitária a locadores que anunciam repúblicas, quartos individuais e quartos compartilhados. A plataforma facilita a descoberta, a comparação e o contato entre as partes.",
      "O UAI QUARTOS não é parte do contrato de locação firmado entre estudante e locador. As condições finais de aluguel, valores, prazos e regras da casa são acordadas diretamente entre as partes.",
    ],
  },
  {
    title: "2. Cadastro e conta",
    body: [
      "Para reservar visitas, conversar com locadores ou publicar anúncios é necessário criar uma conta com informações verdadeiras, completas e atualizadas. Você é responsável pela guarda das suas credenciais e por toda atividade realizada com a sua conta.",
      "Contas podem passar por verificação de identidade (KYC). Anúncios de locadores verificados recebem o selo de dono validado.",
    ],
  },
  {
    title: "3. Responsabilidades do locador",
    body: [
      "O locador se compromete a publicar apenas imóveis reais, com fotos próprias, valores completos (incluindo contas e taxas quando aplicável) e regras da casa claras. Anúncios com informações falsas ou enganosas podem ser removidos sem aviso prévio.",
    ],
  },
  {
    title: "4. Responsabilidades do estudante",
    body: [
      "O estudante se compromete a usar a plataforma de boa-fé, comparecer às visitas agendadas ou cancelá-las com antecedência, e publicar avaliações verdadeiras baseadas em experiência própria.",
    ],
  },
  {
    title: "5. Conduta proibida",
    body: [
      "É proibido usar a plataforma para discriminar candidatos por raça, gênero, orientação sexual, religião ou deficiência; publicar conteúdo ofensivo; tentar fraudar o sistema de avaliações; ou coletar dados de outros usuários para fins externos à plataforma.",
    ],
  },
  {
    title: "6. Limitação de responsabilidade",
    body: [
      "O UAI QUARTOS empenha-se em manter sinais de confiança (verificação de identidade, avaliações reais e custos transparentes), mas não garante a exatidão de todas as informações publicadas por usuários nem se responsabiliza por danos decorrentes de negociações realizadas fora da plataforma.",
    ],
  },
  {
    title: "7. Alterações destes termos",
    body: [
      "Estes termos podem ser atualizados periodicamente. Mudanças relevantes serão comunicadas com antecedência razoável pelos canais oficiais da plataforma.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <article className="uai-container uai-section grid max-w-3xl gap-8">
      <header className="grid gap-3">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand">
          Legal
        </p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Termos de uso
        </h1>
        <p className="text-muted">
          Última atualização: julho de 2026. Ao usar o UAI QUARTOS você
          concorda com as condições abaixo. Veja também a nossa{" "}
          <Link className="font-bold text-brand hover:underline" href="/privacidade">
            Política de privacidade
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
