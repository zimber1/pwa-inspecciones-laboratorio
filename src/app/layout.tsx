import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inspecciones de laboratorio",
  description: "Shell instalable para inspecciones sinteticas de mantenimiento de laboratorios.",
  applicationName: "Inspecciones de laboratorio UTT",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Inspecciones"
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" }
    ],
    apple: [{ url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#1f6f5b",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}

