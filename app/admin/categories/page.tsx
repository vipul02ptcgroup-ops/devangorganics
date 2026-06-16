"use client";

import { useMemo, useState } from "react";
import {
  Coffee,
  Edit3,
  Leaf,
  Package,
  Plus,
  Sparkles,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/ui/StatCard";
import {
  baseCategoryDefinitions,
  slugifyCategoryName,
  type CategoryDefinition,
} from "@/lib/data";
import { isFirebaseConfigured } from "@/lib/firebase";
import { useProducts } from "@/lib/products";

const iconOptions = [
  { value: "Leaf", label: "Leaf", Icon: Leaf },
  { value: "Coffee", label: "Coffee", Icon: Coffee },
  { value: "Sparkles", label: "Sparkles", Icon: Sparkles },
  { value: "Utensils", label: "Utensils", Icon: Utensils },
  { value: "Package", label: "Package", Icon: Package },
] as const;

type FormState = {
  name: string;
  slug: string;
  iconName: string;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  iconName: "Leaf",
};

function CategoryIcon({ iconName }: { iconName: string }) {
  const matched = iconOptions.find((option) => option.value === iconName);
  const Icon = matched?.Icon ?? Package;
  return <Icon size={18} className="text-[#C9A84C]" />;
}

export default function AdminCategories() {
  const {
    categories,
    categoryDefinitions,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useProducts();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const managedCategories = useMemo(
    () =>
      categoryDefinitions.length > 0
        ? categoryDefinitions.map((definition, index) => {
            const matchedCategory = categories.find(
              (category) => category.slug === definition.slug
            );

            return {
              id: matchedCategory?.id ?? index + 1,
              name: definition.name,
              slug: definition.slug,
              iconName: definition.iconName,
              count: matchedCategory?.count ?? 0,
            };
          })
        : isFirebaseConfigured
          ? []
        : categories.filter((category) =>
            baseCategoryDefinitions.some(
              (definition) => definition.slug === category.slug
            )
          ),
    [categories, categoryDefinitions]
  );

  const handleNameChange = (value: string) => {
    setForm((current) => {
      const nextName = value;
      const nextSlug =
        current.slug === "" || current.slug === slugifyCategoryName(current.name)
          ? slugifyCategoryName(nextName)
          : current.slug;

      return {
        ...current,
        name: nextName,
        slug: nextSlug,
      };
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingSlug(null);
  };

  const handleEdit = (category: CategoryDefinition) => {
    setForm({
      name: category.name,
      slug: category.slug,
      iconName: category.iconName,
    });
    setEditingSlug(category.slug);
    setStatusMessage("");
    setErrorMessage("");
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteCategory(slug);
      setStatusMessage("Category removed from the catalog.");
      setErrorMessage("");

      if (editingSlug === slug) {
        resetForm();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete category."
      );
    }
  };

  const handleSave = async () => {
    const name = form.name.trim();
    const slug = slugifyCategoryName(form.slug || form.name);

    if (!name) {
      setErrorMessage("Category name is required.");
      return;
    }

    if (!slug) {
      setErrorMessage("Category slug is required.");
      return;
    }

    const duplicate = managedCategories.find(
      (category) =>
        category.slug === slug && category.slug !== (editingSlug || "")
    );

    if (duplicate) {
      setErrorMessage("A category with this slug already exists.");
      return;
    }

    const payload: CategoryDefinition = {
      name,
      slug,
      iconName: form.iconName || "Leaf",
    };

    try {
      if (editingSlug) {
        await updateCategory(editingSlug, payload);
        setStatusMessage(`Updated "${payload.name}".`);
      } else {
        await addCategory(payload);
        setStatusMessage(`Added "${payload.name}".`);
      }

      setErrorMessage("");
      resetForm();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save category."
      );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="text-[#C9A84C] text-xs tracking-[0.25em] mb-2">CATALOG</p>
          <h1 className="font-[Cinzel] text-3xl text-[#F5F0E8]">Categories</h1>
          <p className="text-[#666] text-sm mt-2">
            Create the category list once in admin, then reuse the same categories
            across the storefront and product forms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="TOTAL CATEGORIES" value={managedCategories.length} />
          <StatCard label="PRODUCTS TAGGED" value={products.length} />
          <StatCard label="ACTIVE EDIT" value={editingSlug ? "1" : "0"} />
        </div>

        <div className="bg-[#161616] border border-[#1A1A1A] p-5 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_0.9fr_auto] gap-3">
            <input
              value={form.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Add new category"
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C]"
            />
            <input
              value={form.slug}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  slug: slugifyCategoryName(event.target.value),
                }))
              }
              placeholder="category-slug"
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C]"
            />
            <select
              value={form.iconName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  iconName: event.target.value,
                }))
              }
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C]"
            >
              {iconOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => void handleSave()}
                className="flex items-center justify-center gap-2 px-5 py-3 font-[Cinzel] text-sm text-[#0A0A0A] min-w-[160px]"
                style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }}
              >
                <Plus size={16} />
                {editingSlug ? "Save Category" : "Add Category"}
              </button>
              {editingSlug ? (
                <button
                  onClick={resetForm}
                  className="px-4 py-3 border border-[#2A2A2A] text-[#C8C0B0] hover:text-[#F5F0E8] hover:border-[#C9A84C] transition-colors"
                >
                  <X size={16} />
                </button>
              ) : null}
            </div>
          </div>

          {statusMessage ? (
            <div className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-4 py-3 text-sm">
              {statusMessage}
            </div>
          ) : null}
          {errorMessage ? (
            <div className="border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3 text-sm">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <div className="bg-[#161616] border border-[#1A1A1A] overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["Category", "Icon", "Products", "Slug", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    className="text-left text-[#666] text-xs tracking-wider px-4 py-3.5 bg-[#111] font-normal"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {managedCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-[#666]"
                  >
                    No categories found yet. Create your first category above.
                  </td>
                </tr>
              ) : (
                managedCategories.map((category) => (
                  <tr key={category.slug} className="border-b border-[#111]">
                    <td className="px-4 py-4 text-[#F5F0E8] text-sm">
                      {category.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#C8C0B0]">
                      <div className="flex items-center gap-2">
                        <CategoryIcon iconName={category.iconName} />
                        <span>{category.iconName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#C9A84C]">
                      {category.count}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#666]">
                      {category.slug}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleEdit({
                              name: category.name,
                              slug: category.slug,
                              iconName: category.iconName,
                            })
                          }
                          className="bg-[rgba(201,168,76,0.1)] border-none text-[#C9A84C] cursor-pointer p-2 hover:bg-[rgba(201,168,76,0.2)] transition-colors"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => void handleDelete(category.slug)}
                          className="bg-[rgba(239,68,68,0.1)] border-none text-red-400 cursor-pointer p-2 hover:bg-[rgba(239,68,68,0.2)] transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
