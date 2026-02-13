// lib/promptService.ts
import Prompt from "@/models/Prompt";

// ✅ Get all prompts with optional query and sort
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// ✅ Get all prompts with optional query and sort
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllPrompts(query: any = {}, sort: any = { createdAt: -1 }, defaultTag: string | null = null) {
  // If a default tag exists AND we aren't filtering by a specific tag
  if (defaultTag && !query.tags) {
    const priorityQuery = { ...query, tags: defaultTag };
    const normalQuery = { ...query, tags: { $ne: defaultTag } };

    const [priorityPrompts, otherPrompts] = await Promise.all([
      Prompt.find(priorityQuery).sort(sort).lean(),
      Prompt.find(normalQuery).sort(sort).lean(),
    ]);

    return [...priorityPrompts, ...otherPrompts];
  }

  return await Prompt.find(query).sort(sort).lean();
}

// ✅ Create a new prompt
export async function createPrompt(data: {
  title: string;
  category: string;
  tool: string;
  tags: string[];
  prompt: string;
  image?: string;
}) {
  const newPrompt = new Prompt({
    title: data.title,
    category: data.category,
    tool: data.tool || "ChatGPT", // Default if missing
    tags: data.tags || [],
    prompt: data.prompt,
    image: data.image,
  });

  return await newPrompt.save();
}