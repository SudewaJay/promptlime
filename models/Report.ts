import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IReport extends Document {
    promptId: mongoose.Types.ObjectId;
    reporterId?: mongoose.Types.ObjectId; // Optional if we allow anon reports (but better strictly logged in)
    reason: string;
    status: "pending" | "resolved" | "dismissed";
    createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
    {
        promptId: { type: Schema.Types.ObjectId, ref: "Prompt", required: true },
        reporterId: { type: Schema.Types.ObjectId, ref: "User" },
        reason: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "resolved", "dismissed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Report = models.Report || model<IReport>("Report", ReportSchema);
export default Report;
