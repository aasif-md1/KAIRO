import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kairo.example";

  const publicRoutes = [
    "",
    "/how-it-works",
    "/coverage",
    "/security",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    "/licenses",
    "/sign-in",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-10-14"),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
