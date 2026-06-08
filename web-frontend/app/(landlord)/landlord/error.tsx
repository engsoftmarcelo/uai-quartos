"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineMessage } from "@/components/ui/inline-message";

export default function LandlordAreaError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[28rem] place-items-center">
      <InlineMessage
        className="max-w-xl"
        tone="danger"
        title="Nao foi possivel carregar a area do locador"
      >
        <p>
          Tente novamente. Se continuar, os dados operacionais podem estar
          temporariamente indisponiveis na API.
        </p>
        <Button
          className="mt-3"
          leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
          onClick={reset}
        >
          Recarregar
        </Button>
      </InlineMessage>
    </div>
  );
}
