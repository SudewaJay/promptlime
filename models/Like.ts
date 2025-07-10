import mongoose, { Schema, Document, models } from "mongoose";

export interface ILike extends Document {
  userEmail: string;
  promptId: mongoose.Types.ObjectId;
}

const LikeSchema = new Schema<ILike>({
  userEmail: { type: String, required: true },
  promptId: { type: Schema.Types.ObjectId, ref: "Prompt", required: true },
});

const Like = models.Like || mongoose.model<ILike>("Like", LikeSchema);

export default Like;