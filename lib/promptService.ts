// lib/promptService.ts
import Prompt from "@/models/Prompt";

// ✅ Get all prompts
export async function getAllPrompts() {
  return await Prompt.find().sort({ createdAt: -1 }).lean();
}

// ✅ Create a new prompt
export async function createPrompt(data: {
  title: string;
  category: string;
  prompt: string;
  image?: string;
}) {
  const newPrompt = new Prompt({
    title: data.title,
    category: data.category,
    prompt: data.prompt,
    image: data.image,
  });

  return await newPrompt.save();
}