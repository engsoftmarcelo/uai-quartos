import type { Metadata } from "next";
import { ProductWorkspace } from "@/components/shared/product-workspace";

export const metadata: Metadata = {
  title: "Area do estudante",
  description:
    "Workspace preservado com integracoes existentes de autenticacao, busca e mensagens.",
};

export default function StudentPage() {
  return (
    <div id="workspace">
      <ProductWorkspace />
    </div>
  );
}
