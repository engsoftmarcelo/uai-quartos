"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineMessage } from "@/components/ui/inline-message";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="uai-container grid min-h-screen content-center gap-5 py-10"
      id="conteudo"
    >
      <InlineMessage
        icon={<AlertTriangle className="h-5 w-5" />}
        tone="danger"
        title="Não foi possível carregar esta área."
      >
        Tente novamente. Se continuar, a equipe técnica pode localizar o erro
        pelo identificador da requisição.
      </InlineMessage>
      <Button leftIcon={<RotateCw className="h-4 w-4" />} onClick={reset}>
        Recarregar
      </Button>
    </main>
  );
}
