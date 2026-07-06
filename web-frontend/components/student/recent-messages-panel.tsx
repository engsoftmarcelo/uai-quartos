import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { StudentConversation } from "@/lib/types";
import { StudentEmptyState } from "./student-empty-state";

export function RecentMessagesPanel({
  conversations,
}: {
  conversations: StudentConversation[];
}) {
  return (
    <section className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Mensagens recentes
          </h2>
          <p className="mt-1 text-sm text-muted">
            Comunicação centralizada para reduzir ansiedade.
          </p>
        </div>
        <Link
          className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-sm font-bold text-brand hover:bg-brand-soft"
          href="/mensagens"
        >
          Inbox
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {conversations.length ? (
        <div className="grid gap-2">
          {conversations.slice(0, 3).map((conversation) => (
            <Link
              className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-3 rounded-md border border-border bg-surface-raised p-3 transition hover:bg-surface-muted"
              href={`/mensagens?conversation=${conversation.id}`}
              key={conversation.id}
            >
              <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-soft text-brand">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="grid gap-1">
                <span className="font-bold text-muted-strong">
                  {conversation.participantName}
                </span>
                <span className="line-clamp-1 text-sm text-muted">
                  {conversation.lastMessage}
                </span>
              </span>
              <span className="text-right text-xs font-bold text-muted">
                {conversation.updatedAtLabel}
                {conversation.unreadCount ? (
                  <span className="mt-1 block rounded-md bg-brand px-2 py-1 text-white">
                    {conversation.unreadCount}
                  </span>
                ) : null}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <StudentEmptyState
          actionHref="/buscar/resultados"
          actionLabel="Encontrar anúncios"
          title="Nenhuma conversa ainda"
        >
          Quando você chamar um locador, a conversa aparece aqui com o anúncio
          conectado.
        </StudentEmptyState>
      )}
    </section>
  );
}
