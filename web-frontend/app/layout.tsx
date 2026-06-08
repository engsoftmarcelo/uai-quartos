import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ToastRegion } from "@/components/ui/toast-region";
import { AuthProvider } from "@/contexts/auth-provider";
import { siteConfig } from "@/lib/constants/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "moradia universitaria",
    "republicas",
    "quartos compartilhados",
    "aluguel estudantil",
    "UAI QUARTOS",
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    locale: "pt_BR",
    siteName: siteConfig.name,
    type: "website",
  },
  robots: {
    follow: true,
    index: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#23765d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <AuthProvider>
          <a className="skip-link" href="#conteudo">
            Pular para o conteudo
          </a>
          {children}
          <ToastRegion />
        </AuthProvider>
      </body>
    </html>
  );
}
