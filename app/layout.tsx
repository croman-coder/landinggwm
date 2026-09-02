import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { SITE, INDEXABLE } from "@/lib/site";

const lato = Lato({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-lato",
  weight: ["400", "700", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#000000",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "GWM Paraguay | H6 GT, TANK 400 y POER PLUS — Cotizá tu modelo",
    template: "%s | GWM Paraguay",
  },
  description: SITE.description,
  applicationName: SITE.name,
  creator: SITE.name,
  category: "automotive",
  alternates: {
    canonical: "/",
    languages: { "es-PY": "/" },
  },
  robots: INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    url: SITE.url,
    title: "GWM Paraguay | H6 GT, TANK 400 y POER PLUS — Cotizá tu modelo",
    description: SITE.description,
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={SITE.lang} className={lato.variable}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#inicio"
          className="sr-only bg-[color:var(--color-ink)] px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110]"
        >
          Saltar al contenido
        </a>

        <Header />

        <main className="flex-1" id="inicio">
          {children}
        </main>

        <Footer />
        <WhatsAppFAB />
      </body>
    </html>
  );
}