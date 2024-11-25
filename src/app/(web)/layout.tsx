import { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/SessionContext";
import AffiliateBanner from "@/components/AffiliateBanner";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/index.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.geuuniao.com.br"),
  title: {
    default: "Grupo Espírita União - Espiritismo na Rede.",
    template: "%s | GEU",
  },
  description:
    "Livros Espíritas, Eventos, Palestras e muitos mais Espiritismo para você.",
  openGraph: {
    title: "Grupo Espírita União - Espiritismo na Rede.",
    description:
      "Livros Espíritas, Eventos, Palestras e muitos mais Espiritismo para você.",
    url: "/",
    siteName: "geuuniao.com.br",
    images: [
      {
        url: "https://www.geuuniao.com.br/images/ogimagegeumenor.jpg",
        width: 600,
        height: 600,
      },
    ],
    locale: "pt_BR",
    type: "website",
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta property="og:image" content="https://www.geuuniao.com.br/images/ogimagegeumenor.jpg" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:type" content="image/jpg" />
        <meta property="og:description" content="Livros Espíritas, Eventos, Palestras e muitos mais Espiritismo para você." />
      </head>
      <body className="relative pb-56 md:pb-36 min-h-screen bg-stripePattern">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <AffiliateBanner />
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
