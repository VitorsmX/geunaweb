import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/index.css";
import { Metadata } from "next";
import { SessionProvider } from "@/components/SessionContext"
import AffiliateBanner from "@/components/AffiliateBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.geuuniao.com.br"),
  title: {
    default: "Espiritismo na Web - Grupo Espírita União",
    template: "%s | Seção do website do Grupo Espírita União",
  },
  description:
    "Descubra Livros Espíritas, participe de Projetos Sociais e explore a Divulgação do Espiritismo.",
  openGraph: {
    title: "Espiritismo na Web - Grupo Espírita União",
    description:
      "Descubra Livros Espíritas, participe de Projetos Sociais e explore a Divulgação do Espiritismo.",
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
  twitter: {
    card: "summary_large_image",
    title: "Espiritismo na Web - Grupo Espírita União",
    description:
      "Descubra Livros Espíritas, participe de Projetos Sociais e explore a Divulgação do Espiritismo.",
    images: [
      "https://www.geuuniao.com.br/images/ogimagegeu.jpg",
      "https://www.geuuniao.com.br/images/ogimagegeu.jpg",
      "https://www.geuuniao.com.br/images/ogimagegeumenor.jpg"
    ],
  },
  icons: {
    icon: [{ url: "/favicon/logo-geu.png" }],
    apple: [{ url: "/favicon/logo-geu.png" }],
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
            </div>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
