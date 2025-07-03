import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  image?: string;
  copiesToday?: number;
  lastCopyDate?: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: String,
  image: String,
  copiesToday: {
    type: Number,
    default: 0,
  },
  lastCopyDate: {
    type: Date,
  },
});

const User = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;