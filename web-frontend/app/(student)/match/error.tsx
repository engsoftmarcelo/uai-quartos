"use client";

import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineMessage } from "@/components/ui/inline-message";

export default function MatchError({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] content-center gap-4">
      <InlineMessage tone="danger" title="Nao foi possivel carregar o matching">
        Tente novamente. Seu progresso salvo localmente continua neste
        dispositivo.
      </InlineMessage>
      <Button
        leftIcon={<RotateCw className="h-4 w-4" />}
        onClick={() => reset()}
      >
        Recarregar
      </Button>
    </div>
  );
}
