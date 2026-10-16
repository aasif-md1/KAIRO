import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kairo.example";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_assets/", "/internal-assets/", "/reports/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
