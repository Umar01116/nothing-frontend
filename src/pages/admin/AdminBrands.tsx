import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi, Brand } from "../../api/admin";
import { DataTable, Column } from "../../components/admin/common/DataTable";
import { StatusBadge } from "../../components/admin/common/StatusBadge";
import { ImageUpload } from "../../components/admin/common/ImageUpload";

export const AdminBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getBrands();
      setBrands(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openCreateModal = (b?: Brand) => {
    if (b) {
      setEditingBrand(b);
      setName(b.name);
      setSlug(b.slug);
      setWebsite(b.website || "");
      setLogo(b.logo || "");
      setDescription(b.description || "");
      setStatus(b.status);
    } else {
      setEditingBrand(null);
      setName("");
      setSlug("");
      setWebsite("");
      setLogo("");
      setDescription("");
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
        website: website || null,
        logo: logo || null,
        description: description || null,
        status,
      };

      if (editingBrand) {
        await adminApi.updateBrand(editingBrand.id, payload);
      } else {
        await adminApi.createBrand(payload);
      }
      setModalOpen(false);
      await fetchBrands();
    } catch (err: any) {
      alert(err.message || "Failed to save brand");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      await adminApi.deleteBrand(id);
      await fetchBrands();
    } catch (err: any) {
      alert(err.message || "Failed to delete brand");
    }
  };

  const columns: Column<Brand>[] = [
    {
      header: "Brand",
      accessor: (b) => (
        <div className="flex items-center gap-3">
          {b.logo ? (
            <img src={b.logo} alt="" className="w-8 h-8 object-contain rounded bg-neutral-100 p-1" />
          ) : (
            <div className="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center font-bold text-xs text-neutral-500">
              {b.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-bold text-neutral-900">{b.name}</p>
            {b.website && <p className="text-[11px] text-neutral-400 font-mono">{b.website}</p>}
          </div>
        </div>
      ),
    },
    {
      header: "Slug",
      accessor: (b) => <span className="font-mono text-xs text-neutral-600">/{b.slug}</span>,
    },
    {
      header: "Products Count",
      accessor: (b) => <span className="font-semibold text-neutral-800">{b.products_count ?? "—"}</span>,
    },
    {
      header: "Status",
      accessor: (b) => <StatusBadge status={b.status ? "active" : "inactive"} />,
    },
    {
      header: "Actions",
      align: "right",
      accessor: (b) => (
        <div className="space-x-2">
          <button
            onClick={() => openCreateModal(b)}
            className="text-xs font-semibold text-neutral-700 hover:text-black"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(b.id)}
            className="text-xs font-semibold text-red-600 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      activeTab="brands"
      title="Brand Partners"
      subtitle="Manage hardware and accessory manufacturers"
      actions={
        <button
          onClick={() => openCreateModal()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm"
        >
          + Add Brand
        </button>
      }
    >
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={brands}
          loading={loading}
          keyExtractor={(b) => b.id}
          emptyMessage="No brands created yet."
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                {editingBrand ? "Edit Brand" : "New Brand"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nothing, CMF"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Auto-generated if empty"
                  className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                />
              </div>

                {/* PC Logo Uploader */}
                <ImageUpload
                  label="Brand Logo (Upload from PC)"
                  value={logo}
                  onChange={setLogo}
                  folder="brands"
                />

              <div>
                <label className="block text-xs font-semibold mb-1">Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://nothing.tech"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                  />
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
