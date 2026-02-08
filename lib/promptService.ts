// lib/promptService.ts
import Prompt from "@/models/Prompt";

// ✅ Get all prompts with optional query and sort
export async function getAllPrompts(query: Record<string, unknown> = {}, sort: Record<string, number> = { createdAt: -1 }) {
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