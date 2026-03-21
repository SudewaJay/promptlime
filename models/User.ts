import mongoose, { Schema, Document, models } from "mongoose";

// ✅ Extend TypeScript interface
export interface IUser extends Document {
  email: string;
  name?: string;
  image?: string;
  username?: string;
  savedPrompts: mongoose.Types.ObjectId[];
  isPro?: boolean;
  copyCount?: number;
  lastReset?: Date;
  savedCategories?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Define User schema
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    image: String,

    // 👉 User identification
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows nulls for old users until they set one
      trim: true,
      lowercase: true,
    },

    // 👉 Track subscription and usage
    isPro: {
      type: Boolean,
      default: false,
    },
    copyCount: {
      type: Number,
      default: 0,
    },
    lastReset: {
      type: Date,
      default: () => new Date(),
    },

    // 👉 User's saved data
    savedPrompts: {
      type: [{ type: Schema.Types.ObjectId, ref: "Prompt" }],
      default: [],
    },
    savedCategories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // ⏱ Adds createdAt and updatedAt
  }
);

// ✅ Prevent model overwrite in dev
const User = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;