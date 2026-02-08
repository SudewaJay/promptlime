import mongoose, { Schema, Document, models, model } from "mongoose";

// 1. Define the TypeScript interface
export interface IPrompt extends Document {
  title: string;
  category: string;
  tool: string;               // ✅ Added: Tool name (e.g. "ChatGPT")
  tags: string[];             // ✅ Added: Tags array
  prompt: string;
  image?: string;
  copyCount: number;
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the Mongoose schema
const PromptSchema = new Schema<IPrompt>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    tool: { type: String, required: true, default: "ChatGPT" }, // ✅ Default for migration
    tags: { type: [String], default: [], index: true },         // ✅ Indexed for search
    prompt: { type: String, required: true },
    image: { type: String },
    copyCount: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "prompts",
  }
);

// 3. Export the model
const Prompt = models.Prompt || model<IPrompt>("Prompt", PromptSchema);
export default Prompt;