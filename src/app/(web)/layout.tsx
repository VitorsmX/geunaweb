import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/index.css";
import { SessionProvider } from "@/components/SessionContext"
import AffiliateBanner from "@/components/AffiliateBanner";
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grupo Espírita União: Espiritismo na Internet",
  description: "Descubra Livros Espíritas, participe de Projetos Sociais e explore a Divulgação do Espiritismo.",
  metadataBase: new URL("https://www.geuuniao.com.br"), // URL base do site
  openGraph: {
    title: "Grupo Espírita União: Espiritismo na Internet",
    description: "Descubra Livros Espíritas, participe de Projetos Sociais e explore a Divulgação do Espiritismo.",
    url: "https://www.geuuniao.com.br",
    images: [
      {
        url: "https://www.geuuniao.com.br/images/ogimagegeu.jpg",
        width: 800, // Ajuste das dimensões para simplificação
        height: 800,
        alt: "Imagem representando o Grupo Espírita União",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image", // Tipo de card para o Twitter
    title: "Grupo Espírita União: Espiritismo na Internet",
    description: "Descubra Livros Espíritas, participe de Projetos Sociais e explore a Divulgação do Espiritismo.",
    images: ["https://www.geuuniao.com.br/images/ogimagegeu.jpg"],
  },
  icons: [
    { rel: "icon", url: "/images/logo-geu-transp.png" }, // Ícone do site
    { rel: "apple-touch-icon", url: "/images/logo-geu-transp.png" }, // Ícone para dispositivos Apple
  ],
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" translate="no" suppressHydrationWarning>
      <body className="relative pb-56 md:pb-36 min-h-screen bg-stripePattern">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <AffiliateBanner/>
            <div className="relative font-body max-w-6xl mx-auto px-5 h-full pt-28 sm:pt-20 md:py-24 backdrop-blur-md rounded-md">
              {children}
              <Analytics />
            </div>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
