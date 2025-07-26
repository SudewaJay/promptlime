// models/Category.ts

import mongoose, { Schema, model, models } from "mongoose";

// Define the schema
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true, // ✅ Adds createdAt & updatedAt
  }
);

// Middleware to auto-generate slug from name if not provided
CategorySchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

// Export model only once
const Category = models.Category || model("Category", CategorySchema);
export default Category;