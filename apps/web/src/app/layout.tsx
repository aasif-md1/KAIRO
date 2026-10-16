import type { Metadata } from "next";
import "@/styles/global.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kairo.example"),
  title: "KAIRO: Access-Control and Secret-Handling Audit Platform",
  description: "Find access-control flaws in AI-built web applications before you launch.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "KAIRO",
    description: "Find access-control flaws in AI-built web applications before you launch.",
    siteName: "KAIRO",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "KAIRO",
      },
    ],
    type: "website",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('kairo-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}else{var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.style.colorScheme=d?'dark':'light';}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content" style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
