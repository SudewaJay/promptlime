import { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import { getAllSeoCombinations } from "@/lib/seo-mapping";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://promptlime.space";

  // 1. Static Pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // 2. Individual Prompts (Dynamic)
  let promptPages: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const prompts = await Prompt.find({ slug: { $exists: true } })
      .select("slug updatedAt")
      .lean();

    promptPages = (prompts as unknown as { slug: string; updatedAt: Date }[]).map((p) => ({
      url: `${baseUrl}/p/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap prompt fetch error:", error);
  }

  // 3. SEO Landing Pages (Combinations)
  const combinations = getAllSeoCombinations();
  const seoPages = combinations.map((c) => ({
    url: `${baseUrl}/prompts/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...promptPages, ...seoPages];
}
