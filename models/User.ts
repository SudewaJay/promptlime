import mongoose, { Schema, Document, models } from "mongoose";

// Extend TypeScript interface
export interface IUser extends Document {
  email: string;
  name?: string;
  image?: string;
  isPro?: boolean;
  copyCount?: number;
  lastReset?: Date;
  savedCategories?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Define schema
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    image: String,

    // ✅ Pro user and usage tracking
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

    // ✅ New: Saved categories
    savedCategories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // ✅ createdAt & updatedAt will be added automatically
  }
);

// Prevent model overwrite in development
const User = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;