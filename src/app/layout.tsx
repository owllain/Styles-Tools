import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "StyleVault — Asesor de Estilo & Guardarropa Inteligente",
  description: "Plataforma inteligente de estilismo y recomendación de outfits personalizada para Enrique Cascante. Más de 145 combinaciones curadas basadas en 46 prendas exclusivas y análisis de ocasión, clima y estética personal.",
  keywords: [
    "StyleVault",
    "Estilista Inteligente",
    "Guardarropa Personal",
    "Outfits Enrique Cascante",
    "Moda Masculina",
    "Noir Sophistiqué",
    "Old Money",
    "Corporate Tech Lord",
    "Rockero Metal",
  ],
  authors: [{ name: "Enrique Cascante" }],
  creator: "StyleVault",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "StyleVault — Asesor de Estilo & Guardarropa Inteligente",
    description: "Sugerencias inteligentes de outfits combinando 145+ combinaciones curadas y 46 prendas de alta gama.",
    type: "website",
    locale: "es_CR",
    siteName: "StyleVault",
  },
  twitter: {
    card: "summary_large_image",
    title: "StyleVault — Asesor de Estilo & Guardarropa Inteligente",
    description: "Sugerencias inteligentes de outfits combinando 145+ combinaciones curadas.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "StyleVault",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
