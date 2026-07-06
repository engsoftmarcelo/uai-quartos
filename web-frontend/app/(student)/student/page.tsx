import type { Metadata } from "next";
import { ProductWorkspace } from "@/components/shared/product-workspace";

export const metadata: Metadata = {
  title: "Área do estudante",
  description:
    "Workspace preservado com integrações existentes de autenticação, busca e mensagens.",
};

export default function StudentPage() {
  return (
    <div id="workspace">
      <ProductWorkspace />
    </div>
  );
}
