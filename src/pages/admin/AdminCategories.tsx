import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { categoriesApi, Category } from "../../api/categories";
import { adminApi } from "../../api/admin";
import { DataTable, Column } from "../../components/admin/common/DataTable";
import { StatusBadge } from "../../components/admin/common/StatusBadge";
import { ImageUpload } from "../../components/admin/common/ImageUpload";
import { resolveImageUrl } from "../../utils/store";

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res: any = await categoriesApi.getCategories();
      const list = Array.isArray(res) ? res : res?.data || [];
      setCategories(list);
    } catch (err) {
      console.error("Categories fetch error:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = (cat?: Category) => {
    if (cat) {
      setEditingCat(cat);
      setName(cat.name);
      setSlug(cat.slug);
      setParentId(cat.parent_id || "");
      setDescription(cat.description || "");
      setImage(cat.image || "");
      setStatus(cat.status);
    } else {
      setEditingCat(null);
      setName("");
      setSlug("");
      setParentId("");
      setDescription("");
      setImage("");
      setStatus(true);
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        parent_id: parentId ? Number(parentId) : null,
        description,
        image: image || null,
        status,
      };

      if (editingCat) {
        await adminApi.updateCategory(editingCat.id, payload);
      } else {
        await adminApi.createCategory(payload);
      }
      setModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await adminApi.deleteCategory(id);
      await fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    }
  };

  const columns: Column<Category>[] = [
    {
      header: "Category Name",
      accessor: (cat) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
            {cat.image ? (
              <img src={resolveImageUrl(cat.image)} alt={cat.name} className="h-full w-full object-contain" />
            ) : (
              <span className="text-sm font-bold text-neutral-400">📁</span>
            )}
          </div>
          <div>
            <div className="font-semibold text-neutral-900">{cat.name}</div>
            {cat.description && <div className="text-xs text-neutral-500 line-clamp-1">{cat.description}</div>}
          </div>
        </div>
      ),
    },
    {
      header: "Slug",
      accessor: (cat) => <span className="font-mono text-xs text-neutral-500">/{cat.slug}</span>,
    },
    {
      header: "Parent Category",
      accessor: (cat) => (
        <span className="text-neutral-600 text-xs">
          {categories.find((c) => c.id === cat.parent_id)?.name || "—"}
        </span>
      ),
    },
    {
      header: "Products",
      accessor: (cat) => <span className="font-medium text-neutral-700">{cat.products_count ?? 0}</span>,
    },
    {
      header: "Status",
      accessor: (cat) => <StatusBadge status={cat.status ? "active" : "inactive"} />,
    },
    {
      header: "Actions",
      accessor: (cat) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openCreateModal(cat)}
            className="px-2 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(cat.id)}
            className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Categories</h1>
            <p className="text-sm text-neutral-500 mt-1">Manage catalog classification and navigation hierarchy</p>
          </div>
          <button
            onClick={() => openCreateModal()}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition flex items-center gap-2 self-start"
          >
            <span>+</span> Add Category
          </button>
        </div>

        <DataTable columns={columns} data={categories} loading={loading} />

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-neutral-900">
                  {editingCat ? "Edit Category" : "New Category"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-lg leading-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700">Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Auto-generated if empty"
                    className="w-full px-3 py-2 border rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700">Parent Category</label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="">None (Top Level Category)</option>
                    {categories
                      .filter((c) => !editingCat || c.id !== editingCat.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* PC Image Uploader */}
                <ImageUpload
                  label="Category Image / Banner (Upload from PC)"
                  value={image}
                  onChange={setImage}
                  folder="categories"
                />

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    Active (Visible on Storefront)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
