import mongoose, { Schema, model, models } from "mongoose";

export interface INotification {
    _id: string;
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Notification = models.Notification || model("Notification", NotificationSchema);

export default Notification;
