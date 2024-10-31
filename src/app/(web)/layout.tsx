import { BuiltWithOutstatic } from "@/components/built-with-outstatic";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { absoluteUrl, ogUrl } from "@/lib/utils";
import "@/styles/index.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://geunaweb.vercel.app"),
  title: {
    default: "Grupo Espírita União - Espiritismo na Web",
    template: "%s | GEU",
  },
  description:
    "Livros Espíritas, Projetos Sociais e Muita Divulgação do Espiritismo.",
  openGraph: {
    title: "Grupo Espírita União - Espiritismo na Web.",
    description:
      "Livros Espíritas, Projetos Sociais e Muita Divulgação do Espiritismo.",
    url: absoluteUrl("/"),
    siteName: "geunaweb.vercel.app",
    images: [
      {
        url: ogUrl("Livros Espíritas, Projetos Sociais e Muita Divulgação do Espiritismo."),
        width: 1200,
        height: 630,
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
    <html lang="en" suppressHydrationWarning>
      <body className="relative pb-56 md:pb-36 min-h-screen bg-gradient-to-b from-[#e9edf1a8] via-[#e6e7e979] to-[#ffffff65]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="relative max-w-6xl mx-auto px-5 h-full pt-20 md:py-24">
            {children}
          </div>
          <BuiltWithOutstatic fixed />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
