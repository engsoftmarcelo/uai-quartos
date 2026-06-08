"use client";

import { useMemo, useState } from "react";
import { Inbox, MessageCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InlineMessage } from "@/components/ui/inline-message";
import type { StudentConversation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ConversationPane } from "./conversation-pane";

export function StudentInbox({
  conversations,
  initialConversationId,
}: {
  conversations: StudentConversation[];
  initialConversationId?: string;
}) {
  const firstConversationId = conversations[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState(
    initialConversationId &&
      conversations.some((conversation) => conversation.id === initialConversationId)
      ? initialConversationId
      : firstConversationId,
  );

  const selectedConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === selectedId) ??
      conversations[0],
    [conversations, selectedId],
  );

  if (!conversations.length) {
    return (
      <section className="grid gap-4 rounded-md border border-dashed border-border bg-surface p-6 text-center">
        <Inbox className="mx-auto h-8 w-8 text-brand" aria-hidden="true" />
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Nenhuma conversa iniciada
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">
            Quando voce chamar um locador, a conversa aparece aqui com o
            anuncio, avisos de seguranca e historico de combinados.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      <InlineMessage
        icon={<ShieldCheck className="h-5 w-5" />}
        tone="success"
        title="Comunicacao centralizada"
      >
        Use este espaco para alinhar visita, documentos e custos. Evite
        pagamentos ou combinados sensiveis fora da plataforma.
      </InlineMessage>

      <div className="grid gap-4 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
        <aside className="grid gap-2 rounded-md border border-border bg-surface p-3 shadow-xs">
          <div className="px-1 pb-1">
            <h2 className="font-display text-xl font-bold text-foreground">
              Inbox
            </h2>
            <p className="text-sm text-muted">
              {conversations.length} conversas em andamento.
            </p>
          </div>
          {conversations.map((conversation) => {
            const selected = conversation.id === selectedId;

            return (
              <button
                className={cn(
                  "grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-3 rounded-md border p-3 text-left transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)]",
                  selected
                    ? "border-brand bg-brand-soft"
                    : "border-border bg-surface-raised hover:bg-surface-muted",
                )}
                key={conversation.id}
                onClick={() => setSelectedId(conversation.id)}
                type="button"
              >
                <span className="grid h-10 w-10 place-items-center rounded-md bg-surface text-brand">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="grid gap-1">
                  <span className="font-bold text-muted-strong">
                    {conversation.participantName}
                  </span>
                  <span className="line-clamp-2 text-sm leading-5 text-muted">
                    {conversation.lastMessage}
                  </span>
                  <span className="text-xs font-bold text-muted">
                    {conversation.connectedListing.neighborhood} -{" "}
                    {conversation.updatedAtLabel}
                  </span>
                </span>
                {conversation.unreadCount ? (
                  <Badge tone="accent">{conversation.unreadCount}</Badge>
                ) : null}
              </button>
            );
          })}
        </aside>

        {selectedConversation ? (
          <ConversationPane conversation={selectedConversation} />
        ) : null}
      </div>
    </section>
  );
}
