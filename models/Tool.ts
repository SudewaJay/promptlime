import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ITool extends Document {
    name: string;
    slug: string;
    icon?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ToolSchema = new Schema<ITool>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        icon: { type: String },
    },
    {
        timestamps: true,
        collection: "tools",
    }
);

const Tool = models.Tool || model<ITool>("Tool", ToolSchema);
export default Tool;
