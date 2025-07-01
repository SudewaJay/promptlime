import mongoose, { Schema, Document, models, model } from "mongoose";

// 1. Define the TypeScript interface
export interface IPrompt extends Document {
  title: string;
  category: string;
  prompt: string;
  image?: string;
  copyCount: number;          // ✅ Added for tracking copies
  likes: number;              // ✅ Added to match schema
  views: number;              // ✅ Added to match schema
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the Mongoose schema
const PromptSchema = new Schema<IPrompt>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    prompt: { type: String, required: true },
    image: { type: String },
    copyCount: { type: Number, default: 0 }, // ✅ Default to 0
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,               // ✅ Auto manage createdAt/updatedAt
    collection: "prompts",          // ✅ Explicit collection name
  }
);

// 3. Export the model
const Prompt = models.Prompt || model<IPrompt>("Prompt", PromptSchema);
export default Prompt;