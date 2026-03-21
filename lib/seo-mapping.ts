export const SEO_STYLES = [
  { slug: "studio-ghibli", name: "Studio Ghibli", keyword: "Studio Ghibli style" },
  { slug: "anime-style", name: "Anime", keyword: "Anime style" },
  { slug: "cinematic-portrait", name: "Cinematic Portrait", keyword: "Cinematic portrait" },
  { slug: "pixar-3d", name: "Pixar 3D", keyword: "Pixar 3D style" },
  { slug: "watercolor-painting", name: "Watercolor", keyword: "Watercolor painting style" },
  { slug: "oil-painting-portrait", name: "Oil Painting", keyword: "Oil painting portrait" },
  { slug: "cyberpunk", name: "Cyberpunk", keyword: "Cyberpunk style" },
  { slug: "minimalist", name: "Minimalist", keyword: "Minimalist style" },
  { slug: "retro-vintage", name: "Retro Vintage", keyword: "Retro vintage style" },
  { slug: "fantasy-art", name: "Fantasy", keyword: "Fantasy art style" },
  { slug: "3d-render", name: "3D Render", keyword: "3D render style" },
  { slug: "photorealistic", name: "Photorealistic", keyword: "Photorealistic style" },
  { slug: "pop-art", name: "Pop Art", keyword: "Pop art style" },
  { slug: "pencil-sketch", name: "Pencil Sketch", keyword: "Pencil sketch style" },
];

export const SEO_PLATFORMS = [
  { slug: "chatgpt", name: "ChatGPT", keyword: "ChatGPT" },
  { slug: "gemini", name: "Gemini", keyword: "Google Gemini" },
  { slug: "midjourney", name: "Midjourney", keyword: "Midjourney" },
  { slug: "stable-diffusion", name: "Stable Diffusion", keyword: "Stable Diffusion" },
  { slug: "claude", name: "Claude", keyword: "Anthropic Claude" },
];

export function getAllSeoCombinations() {
  const combinations: { slug: string; style: typeof SEO_STYLES[0]; platform: typeof SEO_PLATFORMS[0] }[] = [];
  for (const style of SEO_STYLES) {
    for (const platform of SEO_PLATFORMS) {
      combinations.push({
        slug: `${style.slug}-${platform.slug}`,
        style,
        platform,
      });
    }
  }
  return combinations;
}
