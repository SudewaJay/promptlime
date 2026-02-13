import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ISystemSetting extends Document {
    key: string;
    value: any;
}

const SystemSettingSchema = new Schema<ISystemSetting>(
    {
        key: { type: String, required: true, unique: true },
        value: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

const SystemSetting = models.SystemSetting || model<ISystemSetting>("SystemSetting", SystemSettingSchema);

export default SystemSetting;
