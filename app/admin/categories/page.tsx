import Link from "next/link";
import { useEffect, useState } from "react";
import { CategoryType } from "@/types"; // define CategoryType separately if not yet
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCategories(categories.filter((c) => c._id !== id));
        toast.success("Category deleted");
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link
          href="/admin/categories/create"
          className="bg-lime-500 hover:bg-lime-400 text-black px-4 py-2 rounded-md"
        >
          ➕ New Category
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="w-full border border-white/10 text-left">
          <thead>
            <tr className="bg-white/5">
              <th className="p-2">Name</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t border-white/10">
                <td className="p-2">{cat.name}</td>
                <td className="p-2 space-x-2">
                  <Link
                    href={`/admin/categories/${cat._id}/edit`}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
