import { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import { getAllSeoCombinations } from "@/lib/seo-mapping";
import LandingPageTemplate from "@/components/LandingPageTemplate";

// 1. Static generation for all combinations
export async function generateStaticParams() {
  const combinations = getAllSeoCombinations();
  return combinations.map((c) => ({
    slug: c.slug,
  }));
}

// 2. Dynamic Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const combinations = getAllSeoCombinations();
  const combo = combinations.find((c) => c.slug === slug);

  if (!combo) return { title: "Prompts Collection" };

  const { style, platform } = combo;
  const title = `Best ${style.name} Prompts for ${platform.name} (2025)`;
  const description = `The ultimate collection of high-quality ${style.keyword} prompts optimized for ${platform.keyword}. Copy and paste proven prompts for stunning AI results.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`https://promptlime.space/api/og?title=${encodeURIComponent(title)}&style=${style.slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// 3. Server Page Component
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const combinations = getAllSeoCombinations();
  const combo = combinations.find((c) => c.slug === slug);

  if (!combo) {
    notFound();
  }

  await dbConnect();

  // Query prompts matching the style and platform
  // Note: We match by case-insensitive name or slug if needed
  const prompts = await Prompt.find({
    $and: [
      { 
        $or: [
          { styleTag: combo.style.slug },
          { styleTag: combo.style.name.toLowerCase() },
          { tags: combo.style.slug },
          { tags: combo.style.name.toLowerCase() }
        ]
      },
      {
        $or: [
          { tool: combo.platform.name },
          { tool: combo.platform.slug }
        ]
      }
    ]
  })
  .sort({ views: -1 })
  .limit(50)
  .lean();

  return (
    <LandingPageTemplate 
      style={combo.style} 
      platform={combo.platform} 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prompts={prompts as unknown as any[]} 
    />
  );
}
