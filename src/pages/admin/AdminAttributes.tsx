import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi, Attribute, AttributeValue } from "../../api/admin";

export const AdminAttributes: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);

  // New attribute modal
  const [attrModalOpen, setAttrModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [initialValues, setInitialValues] = useState("");
  const [savingAttr, setSavingAttr] = useState(false);

  // Add value inline
  const [selectedValueAttr, setSelectedValueAttr] = useState<Attribute | null>(null);
  const [newValueText, setNewValueText] = useState("");
  const [savingValue, setSavingValue] = useState(false);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAttributes();
      setAttributes(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleCreateAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSavingAttr(true);

    const valuesList = initialValues
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => ({ value: v }));

    try {
      await adminApi.createAttribute({
        name: name.trim(),
        code: code.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        slug: code.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        values: valuesList.length > 0 ? valuesList : undefined,
      });
      setAttrModalOpen(false);
      setName("");
      setCode("");
      setInitialValues("");
      await fetchAttributes();
    } catch (err: any) {
      alert(err.message || "Failed to create attribute");
    } finally {
      setSavingAttr(false);
    }
  };

  const handleAddValue = async (attributeId: number) => {
    if (!newValueText.trim()) return;
    setSavingValue(true);

    const items = newValueText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      for (const val of items) {
        await adminApi.addAttributeValue(attributeId, {
          value: val,
        });
      }
      setNewValueText("");
      setSelectedValueAttr(null);
      await fetchAttributes();
    } catch (err: any) {
      alert(err.message || "Failed to add attribute value");
    } finally {
      setSavingValue(false);
    }
  };

  const handleDeleteValue = async (valueId: number) => {
    if (!confirm("Are you sure you want to delete this option value?")) return;
    try {
      await adminApi.deleteAttributeValue(valueId);
      await fetchAttributes();
    } catch (err: any) {
      alert(err.message || "Failed to delete value");
    }
  };

  const handleDeleteAttribute = async (attributeId: number) => {
    if (!confirm("Are you sure you want to delete this attribute and all its option values?")) return;
    try {
      await adminApi.deleteAttribute(attributeId);
      await fetchAttributes();
    } catch (err: any) {
      alert(err.message || "Failed to delete attribute");
    }
  };

  return (
    <AdminLayout
      activeTab="attributes"
      title="Product Attributes & Options"
      subtitle="Define customizable attributes (Color, Model Compatibility, Edition, Size) to power your product variants."
      actions={
        <div className="flex gap-2">
          <button
            onClick={() => setAttrModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span> Add Attribute
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
          </div>
        ) : attributes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-neutral-400 border border-neutral-200 shadow-2xs">
            <p className="font-semibold text-neutral-700 mb-1">No attributes defined yet</p>
            <p className="text-xs text-neutral-500 mb-4">Create attributes like Color, Model Compatibility, or Size so you can assign variants to products.</p>
            <button
              onClick={() => setAttrModalOpen(true)}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl"
            >
              + Create First Attribute
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {attributes.map((attr) => (
              <div
                key={attr.id}
                className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs p-5 space-y-4 flex flex-col justify-between hover:border-neutral-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <h3 className="font-bold text-base text-neutral-900">{attr.name}</h3>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                        slug: {attr.code || (attr as any).slug || attr.name.toLowerCase()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAttribute(attr.id)}
                      className="text-xs text-neutral-400 hover:text-red-600 font-semibold p-1 transition-colors cursor-pointer"
                      title="Delete Attribute"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Values List */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span className="font-semibold uppercase tracking-wider text-[10px]">
                        Available Values ({attr.values?.length || 0})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[36px]">
                      {attr.values && attr.values.length > 0 ? (
                        attr.values.map((v) => (
                          <span
                            key={v.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100/90 hover:bg-neutral-200/70 rounded-lg text-xs font-medium text-neutral-800 transition-colors"
                          >
                            <span>{v.value}</span>
                            <button
                              onClick={() => handleDeleteValue(v.id)}
                              className="text-neutral-400 hover:text-red-600 text-[11px] font-bold cursor-pointer"
                              title="Remove value"
                            >
                              ✕
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-neutral-400 italic">No values added yet.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add Value Form */}
                <div className="pt-3 border-t border-neutral-100">
                  {selectedValueAttr?.id === attr.id ? (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          autoFocus
                          placeholder="Value name (or comma-separated e.g. Black, White)"
                          value={newValueText}
                          onChange={(e) => setNewValueText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddValue(attr.id);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs border rounded-xl focus:outline-hidden focus:ring-1 focus:ring-red-500"
                        />
                        <button
                          onClick={() => handleAddValue(attr.id)}
                          disabled={savingValue || !newValueText.trim()}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl disabled:opacity-40 cursor-pointer"
                        >
                          {savingValue ? "..." : "Add"}
                        </button>
                        <button
                          onClick={() => setSelectedValueAttr(null)}
                          className="px-2.5 py-1.5 border border-neutral-200 rounded-xl text-xs hover:bg-neutral-50 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-400">Tip: Type multiple values separated by commas</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedValueAttr(attr);
                        setNewValueText("");
                      }}
                      className="w-full py-2 text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100/80 rounded-xl border border-dashed border-neutral-300 transition-colors cursor-pointer"
                    >
                      + Add Option Value
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: New Attribute */}
        {attrModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-bold text-neutral-900">Create New Attribute</h3>
                <button
                  onClick={() => setAttrModalOpen(false)}
                  className="text-neutral-400 hover:text-black cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateAttribute} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Attribute Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!code) {
                        setCode(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    placeholder="e.g. Color, Model Compatibility, Edition, Size"
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl text-xs focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Attribute Slug / Identifier
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. color, compatibility"
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl font-mono text-xs focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Initial Values (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={initialValues}
                    onChange={(e) => setInitialValues(e.target.value)}
                    placeholder="e.g. Black, White, Dark Grey, Transparent"
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl text-xs focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">You can also add more values anytime later.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setAttrModalOpen(false)}
                    className="px-4 py-2.5 border border-neutral-200 rounded-xl text-xs font-semibold hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingAttr || !name.trim()}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                  >
                    {savingAttr ? "Creating..." : "Save Attribute"}
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
