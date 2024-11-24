import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/index.css";
import { SessionProvider } from "@/components/SessionContext"
import AffiliateBanner from "@/components/AffiliateBanner";
import { Analytics } from '@vercel/analytics/next';
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.geuuniao.com.br"),
  title: {
    default: "Grupo Espírita União: Espiritismo na Internet",
    template: "%s | Seção do website do Grupo Espírita União",
  },
  description: "Descubra Livros Espíritas, participe de Projetos Sociais e explore a Divulgação do Espiritismo.",
  applicationName: "Grupo Espírita União: Espiritismo na Internet",
  keywords: [
    "Espiritismo", "Livros Espíritas", "Projetos Sociais", "Divulgação Espírita",
    "Religião", "Fé", "Chico Xavier", "Nosso Lar", "Divaldo Franco", "Allan Kardec"
  ],
  authors: [
    { name: "Grupo Espírita União", url: "https://www.geuuniao.com.br" },
    { name: "Equipe de Desenvolvimento", url: "https://visoteckgo.vercel.app" },
  ],
  robots: "index, follow",
  referrer: "origin",
  openGraph: {
    title: "Grupo Espírita União: Espiritismo na Internet",
    description: "Descubra Livros Espíritas, participe de Projetos Sociais e explore a Divulgação do Espiritismo.",
    url: "https://www.geuuniao.com.br",
    siteName: "Grupo Espírita União",
    images: [
      {
        url: "https://www.geuuniao.com.br/images/ogimagegeu.jpg",
        width: 1640,
        height: 856,
        alt: "Imagem representando o Grupo Espírita União maior (Modo Paisagem)",
      },
      {
        url: "https://www.geuuniao.com.br/images/ogimagegeu.jpg",
        width: 1600,
        height: 800,
        alt: "Imagem representando o Grupo Espírita União menor (Modo Paisagem)",
      },
      {
        url: "https://www.geuuniao.com.br/images/ogimagegeumenor.jpg",
        width: 800,
        height: 800,
        alt: "Imagem representando o Grupo Espírita União (Quadrada)",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: [{ url: "/images/logo-geu-transp.png" }],
    apple: [{ url: "/images/logo-geu-transp.png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Grupo Espírita União",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
  },
  category: "Espiritismo",
  classification: "Religião",
  alternates: {
    canonical: "https://www.geuuniao.com.br",
  },
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
