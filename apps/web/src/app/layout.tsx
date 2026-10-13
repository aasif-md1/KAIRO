import type { Metadata } from "next";
import "@/styles/global.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "KAIRO - Access-Control and Secret-Handling Audit Platform",
  description: "Find access-control flaws in AI-built web applications before you launch.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "KAIRO",
    description: "Find access-control flaws in AI-built web applications before you launch.",
    url: "https://kairo.dev",
    siteName: "KAIRO",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "KAIRO Audit Platform",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
