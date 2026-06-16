"use client";

import { useId, useRef, useState } from "react";
import {
  Download,
  FileJson,
  ImagePlus,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/ui/StatCard";
import {
  baseCategoryDefinitions,
  normalizeProductRecord,
  type Product,
  type RawProductRecord,
} from "@/lib/data";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getProductImageCandidates } from "@/lib/product-images";
import { useProducts } from "@/lib/products";

type ProductFormState = {
  id: string;
  name: string;
  categories: string;
  price: string;
  regular_price: string;
  image: string;
  description: string;
  inStock: boolean;
  weight: string;
  badge: string;
};

const emptyForm: ProductFormState = {
  id: "",
  name: "",
  categories: baseCategoryDefinitions[0]?.name || "",
  price: "",
  regular_price: "",
  image: "",
  description: "",
  inStock: true,
  weight: "50g",
  badge: "",
};

function parseImportedJson(text: string) {
  const trimmed = text.replace(/^\uFEFF/, "").trim();
  const repairEscapes = (value: string) =>
    value.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");

  const tryParse = (value: string) => JSON.parse(value) as RawProductRecord | RawProductRecord[];

  const extractTopLevelJsonValues = (value: string) => {
    const segments: string[] = [];
    let start = -1;
    let depth = 0;
    let inString = false;
    let escaping = false;

    for (let index = 0; index < value.length; index += 1) {
      const char = value[index];

      if (start === -1) {
        if (char === "{" || char === "[") {
          start = index;
          depth = 1;
        }
        continue;
      }

      if (inString) {
        if (escaping) {
          escaping = false;
          continue;
        }
        if (char === "\\") {
          escaping = true;
          continue;
        }
        if (char === "\"") {
          inString = false;
        }
        continue;
      }

      if (char === "\"") {
        inString = true;
        continue;
      }

      if (char === "{" || char === "[") {
        depth += 1;
        continue;
      }

      if (char === "}" || char === "]") {
        depth -= 1;
        if (depth === 0) {
          segments.push(value.slice(start, index + 1));
          start = -1;
        }
      }
    }

    return segments;
  };

  try {
    return tryParse(trimmed);
  } catch {
    const repaired = repairEscapes(trimmed);

    try {
      return tryParse(repaired);
    } catch {
      const segments = extractTopLevelJsonValues(repaired);

      if (segments.length === 0) {
        throw new Error("No valid JSON objects were found in the uploaded file.");
      }

      const parsedSegments = segments.flatMap((segment) => {
        const parsed = tryParse(segment);
        return Array.isArray(parsed) ? parsed : [parsed];
      });

      if (parsedSegments.length === 0) {
        throw new Error("The uploaded JSON did not contain any product records.");
      }

      return parsedSegments;
    }
  }
}

function toFormState(product: Product): ProductFormState {
  return {
    id: String(product.id),
    name: product.name,
    categories: product.categories,
    price: product.price === null ? "" : String(product.price),
    regular_price:
      product.regular_price === null ? "" : String(product.regular_price),
    image: product.image,
    description: product.description,
    inStock: product.inStock,
    weight: product.weight,
    badge: product.badge || "",
  };
}

export default function AdminProducts() {
  const {
    products,
    categories,
    categoryDefinitions,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    importProducts,
  } =
    useProducts();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageUploadRef = useRef<HTMLInputElement | null>(null);
  const imageInputId = useId();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const imageCandidates = getProductImageCandidates(form.image, form.name || "Product");
  const previewImage = imageCandidates[0] || "";
  const categoryOptions =
    categoryDefinitions.length > 0 || !isFirebaseConfigured
      ? categories.map((category) => category.name)
      : [];

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.categories.toLowerCase().includes(query) ||
      String(product.id).includes(query)
    );
  });

  const resetModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleOpenCreate = () => {
    setErrorMessage("");
    setStatusMessage("");
    setEditingId(null);
    setForm({
      ...emptyForm,
      categories: categoryOptions[0] || emptyForm.categories,
      id: String(
        products.reduce((max, product) => Math.max(max, product.id), 0) + 1
      ),
    });
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setErrorMessage("");
    setStatusMessage("");
    setEditingId(product.id);
    setForm(toFormState(product));
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      setStatusMessage(`Deleted product #${id}.`);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete product."
      );
    }
  };

  const handleSave = async () => {
    if (!form.id || !form.name.trim()) {
      setErrorMessage("Product ID and product name are required.");
      return;
    }

    if (!form.categories.trim()) {
      setErrorMessage("Please create and select a category first.");
      return;
    }

    const rawRecord: RawProductRecord = {
      id: Number(form.id),
      name: form.name,
      categories: form.categories,
      price: form.price || null,
      regular_price: form.regular_price || null,
      description: form.description,
      short_description: form.description,
      in_stock: form.inStock,
      image: form.image,
      attributes: null,
    };

    const normalized = normalizeProductRecord(rawRecord, products.length);
    const productToSave: Product = {
      ...normalized,
      weight: form.weight || normalized.weight,
      badge: form.badge || undefined,
    };

    if (editingId !== null) {
      try {
        await updateProduct(productToSave);
        setStatusMessage(`Updated product "${productToSave.name}".`);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to update product."
        );
        return;
      }
    } else {
      try {
        await addProduct(productToSave);
        setStatusMessage(`Added product "${productToSave.name}".`);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to add product."
        );
        return;
      }
    }

    resetModal();
  };

  const handleJsonUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseImportedJson(text);
      const records = Array.isArray(parsed) ? parsed : [parsed];
      const count = await importProducts(records);
      setStatusMessage(`Imported ${count} product${count === 1 ? "" : "s"} from JSON.`);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to import JSON file."
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read the selected image."));
        reader.readAsDataURL(file);
      });

      setForm((current) => ({
        ...current,
        image: imageDataUrl,
      }));
      setErrorMessage("");
      setStatusMessage(`Attached image "${file.name}" to the product form.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to upload image."
      );
    } finally {
      event.target.value = "";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[#C9A84C] text-xs tracking-[0.25em] mb-2">CATALOG</p>
            <h1 className="font-[Cinzel] text-3xl text-[#F5F0E8]">Products</h1>
            <p className="text-[#666] text-sm mt-2">
              Manage products manually or import them with your JSON schema.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-5 py-3 font-[Cinzel] text-sm text-[#0A0A0A]"
              style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }}
            >
              <Plus size={16} />
              Add Product
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-3 border border-[#2A2A2A] bg-[#161616] text-[#C8C0B0] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
            >
              <Upload size={16} />
              Upload JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleJsonUpload}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Products", value: products.length, icon: <Package size={18} className="text-[#C9A84C]" /> },
            { label: "In Stock", value: products.filter((product) => product.inStock).length, icon: <Download size={18} className="text-[#C9A84C]" /> },
            { label: "JSON Ready", value: "Single or Array", icon: <FileJson size={18} className="text-[#C9A84C]" /> },
          ].map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              icon={card.icon}
            />
          ))}
        </div>

        <div className="bg-[#161616] border border-[#1A1A1A] p-4 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by id, name, or category..."
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
          <p className="text-[#666] text-sm">
            Accepted JSON: a single product object or an array of product objects.
          </p>
        </div>

        {statusMessage ? (
          <div className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-4 py-3 text-sm">
            {statusMessage}
          </div>
        ) : null}
        {loading ? (
          <div className="border border-[#2A2A2A] bg-[#161616] text-[#C8C0B0] px-4 py-3 text-sm">
            Loading products from Firebase...
          </div>
        ) : null}
        {errorMessage ? (
          <div className="border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3 text-sm">
            {errorMessage}
          </div>
        ) : null}

        <div className="bg-[#161616] border border-[#1A1A1A] overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {["ID", "Image", "Product", "Category", "Price", "Stock", "Image URL", "Actions"].map((heading) => (
                  <th key={heading} className="text-left text-[#666] text-xs tracking-wider px-4 py-3.5 bg-[#111] font-normal">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-[#666]"
                  >
                    No Firebase products found yet. Add a product manually or import your JSON file.
                  </td>
                </tr>
              ) : null}
              {filteredProducts.map((product) => (
                <AdminProductRow
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>

        {showModal ? (
          <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-8">
            <div className="bg-[#161616] border border-[#C9A84C] p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-[Cinzel] text-[#C9A84C] text-lg">
                    {editingId !== null ? "Edit Product" : "Add Product"}
                  </h2>
                  <p className="text-[#666] text-sm mt-1">
                    Use the same core fields as your JSON product schema.
                  </p>
                </div>
                <button
                  onClick={resetModal}
                  className="text-[#666] hover:text-[#F5F0E8] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[ 
                  ["id", "Product ID", "e.g. 160"],
                  ["name", "Name", "Wild Cordyceps"],
                  ["price", "Price", "499"],
                  ["regular_price", "Regular Price", "699"],
                  ["image", "Image Path", "assets/ProductsImage/wild-cordyceps.webp"],
                  ["weight", "Weight", "50g"],
                  ["badge", "Badge", "Bestseller"],
                ].map(([field, label, placeholder]) => (
                  <div key={field}>
                    <label className="block text-[#C8C0B0] text-xs mb-1.5">{label}</label>
                    <input
                      value={form[field as keyof ProductFormState] as string}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [field]: event.target.value,
                        }))
                      }
                      placeholder={placeholder}
                      className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none"
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <div className="flex flex-wrap items-start gap-4 rounded-sm border border-[#2A2A2A] bg-[#111] p-4">
                    <div className="h-28 w-28 overflow-hidden rounded-sm border border-[#2A2A2A] bg-[#0A0A0A] flex items-center justify-center">
                      {previewImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewImage}
                          alt={form.name || "Product preview"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-center text-xs text-[#666] px-3">
                          No image selected
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-[220px]">
                      <label
                        htmlFor={imageInputId}
                        className="block text-[#C8C0B0] text-xs mb-1.5"
                      >
                        Upload Image
                      </label>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => imageUploadRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2.5 border border-[#2A2A2A] bg-[#161616] text-[#C8C0B0] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors text-sm"
                        >
                          <ImagePlus size={15} />
                          Choose Image
                        </button>
                        {form.image ? (
                          <button
                            type="button"
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                image: "",
                              }))
                            }
                            className="px-4 py-2.5 border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/15 transition-colors text-sm"
                          >
                            Remove Image
                          </button>
                        ) : null}
                      </div>
                      <p className="text-[#666] text-xs mt-2">
                        Upload a product photo, or keep using an existing image path or URL.
                      </p>
                      <input
                        id={imageInputId}
                        ref={imageUploadRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#C8C0B0] text-xs mb-1.5">Category</label>
                  <select
                    value={form.categories}
                    disabled={categoryOptions.length === 0}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        categories: event.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {categoryOptions.length === 0 ? (
                    <p className="text-[#666] text-xs mt-2">
                      Create at least one category in the Categories admin page first.
                    </p>
                  ) : null}
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-[#C8C0B0] text-sm">
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          inStock: event.target.checked,
                        }))
                      }
                      className="accent-[#C9A84C]"
                    />
                    In Stock
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#C8C0B0] text-xs mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    rows={5}
                    placeholder="Describe the product..."
                    className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] text-sm focus:border-[#C9A84C] focus:outline-none resize-y"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 font-[Cinzel] text-[#0A0A0A]"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)" }}
                >
                  {editingId !== null ? "Save Changes" : "Add Product"}
                </button>
                <button
                  onClick={resetModal}
                  className="px-6 py-3 border border-[#2A2A2A] text-[#C8C0B0] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
}

function AdminProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void | Promise<void>;
}) {
  const imageCandidates = getProductImageCandidates(product.image, product.name);
  const [imageIndex, setImageIndex] = useState(0);
  const activeImage = imageCandidates[imageIndex] || "";

  return (
    <tr className="border-b border-[#111] hover:bg-[#111] transition-colors">
                  <td className="px-4 py-3.5 text-[#C9A84C] font-[Cinzel]">{product.id}</td>
                  <td className="px-4 py-3.5">
                    <div className="h-14 w-14 overflow-hidden rounded-sm border border-[#2A2A2A] bg-[#0A0A0A] flex items-center justify-center">
                      {activeImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activeImage}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={() => {
                            if (imageIndex < imageCandidates.length - 1) {
                              setImageIndex((current) => current + 1);
                            }
                          }}
                        />
                      ) : (
                        <span className="text-[10px] text-[#666]">No image</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 min-w-[260px]">
                    <p className="text-[#F5F0E8] text-sm">{product.name}</p>
                    <p className="text-[#666] text-xs line-clamp-2 mt-1">{product.description}</p>
                  </td>
                  <td className="px-4 py-3.5 text-[#C8C0B0] text-sm">{product.categories}</td>
                  <td className="px-4 py-3.5 text-[#C9A84C] font-[Cinzel]">
                    {product.price === null ? "On request" : `Rs${product.price}`}
                  </td>
                  <td className="px-4 py-3.5 text-sm">
                    <span className={product.inStock ? "text-emerald-400" : "text-red-400"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[#666] text-xs max-w-[220px] truncate">
                    {product.image || "No image"}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="bg-[rgba(201,168,76,0.1)] border-none text-[#C9A84C] cursor-pointer p-2 hover:bg-[rgba(201,168,76,0.2)] transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="bg-[rgba(239,68,68,0.1)] border-none text-red-400 cursor-pointer p-2 hover:bg-[rgba(239,68,68,0.2)] transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
  );
}
