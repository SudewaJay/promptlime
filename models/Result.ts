import mongoose, { Schema, Document, models } from "mongoose";

export interface IResult extends Document {
  userId: mongoose.Types.ObjectId;
  promptId: mongoose.Types.ObjectId;
  beforeImage: string;
  afterImage: string;
  caption?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema = new Schema<IResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    promptId: {
      type: Schema.Types.ObjectId,
      ref: "Prompt",
      required: true,
      index: true,
    },
    beforeImage: {
      type: String,
      required: true,
    },
    afterImage: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

const Result = models.Result || mongoose.model<IResult>("Result", ResultSchema);

export default Result;
