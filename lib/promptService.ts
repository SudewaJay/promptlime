// lib/promptService.ts
import Prompt from "@/models/Prompt";

// ✅ Get all prompts
export async function getAllPrompts() {
  return await Prompt.find().sort({ createdAt: -1 }).lean();
}

// ✅ Create a new prompt
export async function createPrompt(data: {
  title: string;
  content: string;
  tags?: string[];
  createdBy?: string;
}) {
  const newPrompt = new Prompt({
    title: data.title,
    content: data.content,
    tags: data.tags || [],
    createdBy: data.createdBy || null,
  });

  return await newPrompt.save();
}