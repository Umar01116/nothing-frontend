import React, { useEffect, useState, useRef } from "react";
import { AdminLayout } from "./AdminLayout";
import { productsApi, Product } from "../../api/products";
import { categoriesApi, Category } from "../../api/categories";
import { adminApi, Brand, Attribute } from "../../api/admin";
import { DataTable, Column } from "../../components/admin/common/DataTable";
import { Pagination } from "../../components/admin/common/Pagination";
import { ImageUpload } from "../../components/admin/common/ImageUpload";
import { money, resolveImageUrl } from "../../utils/store";
import { RichTextRenderer } from "../../components/common/RichTextRenderer";

interface UIVariantItem {
  id?: number;
  sku: string;
  price: number | string;
  sale_price: number | string;
  cost_price: number | string;
  stock_status: string;
  quantity: number;
  status: boolean;
  attributes: Array<{
    attribute_id: number;
    attribute_value_id: number;
    attr_name?: string;
    value_name?: string;
  }>;
  attrNames: string;
}

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [availableAttributes, setAvailableAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<number | "">("");
  const [search, setSearch] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [brandId, setBrandId] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [salePrice, setSalePrice] = useState<number | "">("");
  const [costPrice, setCostPrice] = useState<number | "">("");
  const [shortDesc, setShortDesc] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [schemaMarkup, setSchemaMarkup] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isDeal, setIsDeal] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  // Variants State
  const [hasVariants, setHasVariants] = useState(false);
  const [selectedAttrValues, setSelectedAttrValues] = useState<Record<number, number[]>>({});
  const [singleVariantSelections, setSingleVariantSelections] = useState<Record<number, number>>({});
  const [variants, setVariants] = useState<UIVariantItem[]>([]);

  // Rich Description Editor State
  const [descEditorTab, setDescEditorTab] = useState<"write" | "preview">("write");
  const descTextareaRef = useRef<HTMLTextAreaElement>(null);
  const inlineProductImageInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const [prodRes, catRes, brandRes, attrRes] = await Promise.all([
        productsApi.getProducts({
          page,
          category_id: categoryFilter || undefined,
          search: search || undefined,
        }),
        categoriesApi.getCategories(),
        adminApi.getBrands(),
        adminApi.getAttributes().catch(() => []),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes || []);
      setBrands(brandRes || []);
      setAvailableAttributes(attrRes || []);

      if (prodRes.meta) {
        setCurrentPage(prodRes.meta.current_page);
        setLastPage(prodRes.meta.last_page);
        setTotal(prodRes.meta.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [categoryFilter]);

  const openModal = async (prodParam?: Product) => {
    let prod = prodParam;
    if (prodParam?.id) {
      try {
        const freshProd = await productsApi.getProduct(prodParam.id);
        if (freshProd) prod = freshProd;
      } catch (err) {
        console.error("Failed to load fresh product:", err);
      }
    }

    if (prod) {
      setEditingProduct(prod);
      setName(prod.name);
      setSlug(prod.slug);
      setSku(prod.sku);
      setCategoryId(prod.category_id || categories[0]?.id || "");
      setBrandId(prod.brand_id || "");
      setPrice(prod.price);
      setSalePrice(prod.sale_price || "");
      setCostPrice(prod.cost_price || "");
      setShortDesc(prod.short_description || "");
      setDesc(prod.description || "");
      setImageUrl(prod.images?.[0]?.image || "");
      setGalleryImages((prod.images || []).slice(1).map((i) => i.image));
      setSeoTitle(prod.seo_title || "");
      setSeoDesc(prod.seo_description || "");
      setSchemaMarkup(prod.schema_markup || (prod as any).seo?.schema_markup || "");
      setIsFeatured(prod.is_featured);
      setIsBestSeller(prod.is_best_seller);
      setIsDeal(prod.is_deal);
      setIsNew(prod.is_new);

      // Load Variants if product has variants
      const rawVariants = prod.variants || (prod as any).product_variants || [];
      if (rawVariants.length > 0) {
        setHasVariants(true);
        const mapAttrVals: Record<number, number[]> = {};
        const loadedVariants: UIVariantItem[] = rawVariants.map((v: any) => {
          const rawAttrs = v.attributes || v.variant_values || v.variantValues || [];
          const attrs = rawAttrs.map((a: any) => {
            const aId = a.attribute?.id || a.attribute_id || 0;
            const valId = a.value?.id || a.attribute_value?.id || a.attributeValue?.id || a.attribute_value_id || 0;
            const aName = a.attribute?.name || a.attr_name || "Option";
            const valName = a.value?.value || a.attribute_value?.value || a.attributeValue?.value || a.value_name || "";

            if (aId && valId) {
              if (!mapAttrVals[aId]) mapAttrVals[aId] = [];
              if (!mapAttrVals[aId].includes(valId)) mapAttrVals[aId].push(valId);
            }
            return {
              attribute_id: aId,
              attribute_value_id: valId,
              attr_name: aName,
              value_name: valName,
            };
          });

          const variantTitle =
            attrs
              .map((a: any) => `${a.attr_name || "Option"}: ${a.value_name || "Value"}`)
              .filter((s: string) => !s.endsWith(": Value") && !s.endsWith(": "))
              .join(" • ") || v.sku;

          return {
            id: v.id,
            sku: v.sku,
            price: v.price,
            sale_price: v.sale_price ?? "",
            cost_price: v.cost_price ?? "",
            stock_status: v.stock_status || "in_stock",
            quantity: v.inventory?.quantity ?? 50,
            status: v.status !== false,
            attributes: attrs,
            attrNames: variantTitle,
          };
        });

        setSelectedAttrValues(mapAttrVals);
        setVariants(loadedVariants);
      } else {
        setHasVariants(false);
        setSelectedAttrValues({});
        setVariants([]);
      }
    } else {
      setEditingProduct(null);
      setName("");
      setSlug("");
      setSku("");
      setCategoryId(categories[0]?.id || "");
      setBrandId(brands[0]?.id || "");
      setPrice("");
      setSalePrice("");
      setCostPrice("");
      setShortDesc("");
      setDesc("");
      setImageUrl("");
      setGalleryImages([]);
      setSeoTitle("");
      setSeoDesc("");
      setSchemaMarkup("");
      setIsFeatured(false);
      setIsBestSeller(false);
      setIsDeal(false);
      setIsNew(false);
      setHasVariants(false);
      setSelectedAttrValues({});
      setVariants([]);
    }
    setSingleVariantSelections({});
    setDescEditorTab("write");
    setModalOpen(true);
  };

  const toggleAttrValue = (attrId: number, valueId: number) => {
    setSelectedAttrValues((prev) => {
      const current = prev[attrId] || [];
      const updated = current.includes(valueId)
        ? current.filter((id) => id !== valueId)
        : [...current, valueId];
      return { ...prev, [attrId]: updated };
    });
  };

  const generateVariantCombinations = () => {
    // 1. Filter attributes that have at least one value selected
    const activeAttrs = availableAttributes
      .map((attr) => ({
        attr,
        selectedVals: (attr.values || []).filter((v) =>
          (selectedAttrValues[attr.id] || []).includes(v.id)
        ),
      }))
      .filter((item) => item.selectedVals.length > 0);

    if (activeAttrs.length === 0) {
      alert("Please select at least one option value from Step 1 above to generate combinations.");
      return;
    }

    // 2. Cartesian product helper
    const cartesian = (arrays: any[][]): any[][] => {
      return arrays.reduce(
        (acc, curr) => acc.flatMap((d) => curr.map((e) => [...d, e])),
        [[]]
      );
    };

    const valueArrays = activeAttrs.map((item) =>
      item.selectedVals.map((v) => ({
        attribute_id: item.attr.id,
        attribute_value_id: v.id,
        attr_name: item.attr.name,
        value_name: v.value,
      }))
    );

    const combos = cartesian(valueArrays);
    const baseSku = sku || `SKU-${Date.now().toString(36).toUpperCase()}`;

    const newVariants: UIVariantItem[] = combos.map((combo) => {
      const names = combo.map((c: any) => `${c.attr_name}: ${c.value_name}`).join(" • ");
      const slugParts = combo.map((c: any) => c.value_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).join("-");
      const varSku = `${baseSku}-${slugParts.toUpperCase()}`.substring(0, 50);

      // Check if existing variant with same attributes already exists
      const existing = variants.find(
        (v) =>
          v.attributes.length === combo.length &&
          v.attributes.every((a) =>
            combo.some((c: any) => c.attribute_value_id === a.attribute_value_id)
          )
      );

      if (existing) {
        return existing;
      }

      return {
        sku: varSku,
        price: price || 0,
        sale_price: salePrice || "",
        cost_price: costPrice || "",
        stock_status: "in_stock",
        quantity: 50,
        status: true,
        attributes: combo,
        attrNames: names,
      };
    });

    // Merge without wiping previously added variants
    const merged = [...variants];
    newVariants.forEach((nv) => {
      const isAlreadyInList = merged.some(
        (ev) =>
          ev.attributes.length === nv.attributes.length &&
          ev.attributes.every((ea) =>
            nv.attributes.some((na) => na.attribute_value_id === ea.attribute_value_id)
          )
      );
      if (!isAlreadyInList) {
        merged.push(nv);
      }
    });

    setVariants(merged);
  };

  const handleAddSingleVariant = () => {
    const selectedAttributes: Array<{
      attribute_id: number;
      attribute_value_id: number;
      attr_name?: string;
      value_name?: string;
    }> = [];

    availableAttributes.forEach((attr) => {
      const valId = singleVariantSelections[attr.id];
      if (valId) {
        const valObj = (attr.values || []).find((v) => v.id === valId);
        if (valObj) {
          selectedAttributes.push({
            attribute_id: attr.id,
            attribute_value_id: valObj.id,
            attr_name: attr.name,
            value_name: valObj.value,
          });
        }
      }
    });

    if (selectedAttributes.length === 0) {
      alert("Please select at least one option from the dropdowns to add a variant.");
      return;
    }

    const isDuplicate = variants.some(
      (v) =>
        v.attributes.length === selectedAttributes.length &&
        v.attributes.every((a) =>
          selectedAttributes.some((sa) => sa.attribute_value_id === a.attribute_value_id)
        )
    );

    if (isDuplicate) {
      alert("This variant combination already exists in the list below.");
      return;
    }

    const baseSku = sku || `SKU-${Date.now().toString(36).toUpperCase()}`;
    const slugParts = selectedAttributes.map((c) => c.value_name?.toLowerCase().replace(/[^a-z0-9]+/g, "-")).join("-");
    const varSku = `${baseSku}-${slugParts.toUpperCase()}`.substring(0, 50);
    const names = selectedAttributes.map((c) => `${c.attr_name}: ${c.value_name}`).join(" • ");

    const newVar: UIVariantItem = {
      sku: varSku,
      price: price || 0,
      sale_price: salePrice || "",
      cost_price: costPrice || "",
      stock_status: "in_stock",
      quantity: 50,
      status: true,
      attributes: selectedAttributes,
      attrNames: names,
    };

    setVariants([...variants, newVar]);
    setSingleVariantSelections({});
  };

  const addManualVariant = () => {
    const baseSku = sku || `SKU-${Date.now().toString(36).toUpperCase()}`;
    const newVar: UIVariantItem = {
      sku: `${baseSku}-VAR-${variants.length + 1}`,
      price: price || 0,
      sale_price: salePrice || "",
      cost_price: costPrice || "",
      stock_status: "in_stock",
      quantity: 50,
      status: true,
      attributes: [],
      attrNames: `Custom Variant #${variants.length + 1}`,
    };
    setVariants([...variants, newVar]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariantField = (index: number, field: keyof UIVariantItem, val: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: val };
    setVariants(updated);
  };

  const syncBasePricesToVariants = () => {
    if (!price) {
      alert("Please enter a regular price first.");
      return;
    }
    setVariants(
      variants.map((v) => ({
        ...v,
        price: Number(price),
        sale_price: salePrice ? Number(salePrice) : "",
      }))
    );
  };

  const generateSchemaTemplate = () => {
    const selectedCat = categories.find((c) => c.id === categoryId)?.name || "Accessories";
    const selectedBrand = brands.find((b) => b.id === brandId)?.name || "Nothing";
    const finalPrice = salePrice || price || "0";

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: name || "Product Title",
      image: imageUrl ? [imageUrl, ...galleryImages.filter(Boolean)] : [],
      description: shortDesc || (desc ? desc.substring(0, 160) : name),
      sku: sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
      brand: {
        "@type": "Brand",
        name: selectedBrand,
      },
      category: selectedCat,
      offers: {
        "@type": "Offer",
        url: typeof window !== "undefined" ? `${window.location.origin}/product/${editingProduct?.id || ""}` : "",
        priceCurrency: "PKR",
        price: String(finalPrice),
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "Nothing Accessories Pakistan",
        },
      },
    };

    setSchemaMarkup(JSON.stringify(schema, null, 2));
  };

  const insertDescFormatting = (prefix: string, suffix: string = "", placeholder: string = "") => {
    const textarea = descTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || placeholder;

    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    const newContent = `${before}${prefix}${selectedText}${suffix}${after}`;
    setDesc(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const handleInlineProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const defaultAlt = file.name.split(".")[0].replace(/[-_]/g, " ");
    const altText = window.prompt("Enter Image Alt Text / Description (Recommended for SEO):", defaultAlt);
    if (altText === null) return;

    try {
      const res = await adminApi.uploadMedia(file, "products");
      insertDescFormatting(`\n![${altText.trim() || defaultAlt}](${res.url})\n`, "", "");
    } catch (err: any) {
      alert("Failed to upload image: " + err.message);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: any = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      sku: sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
      category_id: Number(categoryId),
      brand_id: brandId ? Number(brandId) : null,
      price: Number(price),
      sale_price: salePrice ? Number(salePrice) : null,
      cost_price: costPrice ? Number(costPrice) : null,
      short_description: shortDesc,
      description: desc,
      seo_title: seoTitle,
      seo_description: seoDesc,
      schema_markup: schemaMarkup || null,
      stock_status: "in_stock",
      status: true,
      is_featured: isFeatured,
      is_best_seller: isBestSeller,
      is_deal: isDeal,
      is_new: isNew,
    };

    const allImages: Array<{ image: string; is_primary: boolean; sort_order: number }> = [];
    if (imageUrl) {
      allImages.push({
        image: imageUrl,
        is_primary: true,
        sort_order: 1,
      });
    }
    galleryImages.forEach((img, idx) => {
      if (img && img !== imageUrl) {
        allImages.push({
          image: img,
          is_primary: false,
          sort_order: idx + 2,
        });
      }
    });
    if (allImages.length > 0) {
      payload.images = allImages;
    }

    // Attach Variants if enabled
    if (hasVariants && variants.length > 0) {
      payload.variants = variants.map((v) => ({
        id: v.id || undefined,
        sku: v.sku,
        price: Number(v.price),
        sale_price: v.sale_price !== "" && v.sale_price !== null ? Number(v.sale_price) : null,
        cost_price: v.cost_price !== "" && v.cost_price !== null ? Number(v.cost_price) : null,
        stock_status: v.stock_status || "in_stock",
        status: v.status !== false,
        attributes: v.attributes.map((a) => ({
          attribute_id: Number(a.attribute_id),
          attribute_value_id: Number(a.attribute_value_id),
        })),
        inventory: {
          quantity: Number(v.quantity || 0),
          reserved_quantity: 0,
          low_stock_threshold: 5,
        },
      }));
    } else if (hasVariants && variants.length === 0) {
      payload.variants = [];
    }

    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      setModalOpen(false);
      await fetchData(currentPage);
      alert("Product saved successfully with variants!");
    } catch (err: any) {
      alert(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await adminApi.deleteProduct(id);
      await fetchData(currentPage);
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  const columns: Column<Product>[] = [
    {
      header: "Product",
      accessor: (prod) => (
        <div className="flex items-center gap-3">
          {prod.images?.[0]?.image ? (
            <img
              src={resolveImageUrl(prod.images[0].image)}
              alt=""
              className="w-10 h-10 object-cover rounded-lg bg-neutral-100 p-0.5 border"
            />
          ) : (
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-xs">📦</div>
          )}
          <div>
            <p className="font-bold text-neutral-900">{prod.name}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[11px] text-neutral-400 font-mono">SKU: {prod.sku}</p>
              {prod.variants && prod.variants.length > 0 && (
                <span className="px-1.5 py-0.5 bg-neutral-900 text-white text-[10px] font-bold rounded">
                  {prod.variants.length} Variants
                </span>
              )}
            </div>
            {prod.variants && prod.variants.length > 0 && (
              <div className="flex gap-1 flex-wrap mt-1 max-w-xs">
                {prod.variants.map((v) => {
                  const label = (v.attributes || (v as any).variant_values || (v as any).variantValues)
                    ?.map((a: any) => a.value?.value || a.attribute_value?.value || a.attributeValue?.value || a.value_name)
                    .filter(Boolean)
                    .join("/") || v.sku;
                  return (
                    <span
                      key={v.id}
                      className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${
                        v.status === false
                          ? "bg-neutral-100 text-neutral-400 line-through border-neutral-200"
                          : v.stock_status === "out_of_stock"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-white text-neutral-800 border-neutral-200"
                      }`}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (prod) => (
        <span className="text-xs font-semibold text-neutral-700">{prod.category?.name || "General"}</span>
      ),
    },
    {
      header: "Price",
      accessor: (prod) => <span className="font-bold text-neutral-900">{money(Number(prod.price))}</span>,
    },
    {
      header: "Sale Price",
      accessor: (prod) => (
        <span className="font-bold text-red-600">
          {prod.sale_price ? money(Number(prod.sale_price)) : "—"}
        </span>
      ),
    },
    {
      header: "Badges",
      accessor: (prod) => (
        <div className="flex gap-1 flex-wrap">
          {prod.is_featured && (
            <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] rounded font-bold border border-amber-200">
              Featured
            </span>
          )}
          {prod.is_best_seller && (
            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded font-bold border border-blue-200">
              Best Seller
            </span>
          )}
          {prod.is_deal && (
            <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[10px] rounded font-bold border border-red-200">
              Deal
            </span>
          )}
          {prod.is_new && (
            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded font-bold border border-emerald-200">
              New
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      align: "right",
      accessor: (prod) => (
        <div className="space-x-2">
          <button
            onClick={() => openModal(prod)}
            className="text-xs font-semibold text-neutral-700 hover:text-black cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(prod.id)}
            className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      activeTab="products"
      title="Product Catalog & Variants"
      subtitle="Manage hardware accessories, multi-variant combinations, pricing, stock, badges, and SEO"
      actions={
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition flex items-center gap-1.5"
        >
          <span>+</span> Add New Product
        </button>
      }
    >
      <div className="space-y-4">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-neutral-600">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-lg bg-neutral-50"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchData(1);
            }}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <input
              type="text"
              placeholder="Search by title or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-lg flex-1 sm:w-64"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-neutral-900 text-white font-bold text-xs rounded-lg cursor-pointer hover:bg-black"
            >
              Search
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
          <DataTable
            columns={columns}
            data={products}
            loading={loading}
            keyExtractor={(prod) => prod.id}
            emptyMessage="No products found."
          />
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            onPageChange={(page) => fetchData(page)}
          />
        </div>

        {/* Create/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    {editingProduct ? `Edit: ${editingProduct.name}` : "Create New Product"}
                  </h3>
                  <p className="text-xs text-neutral-500">Configure pricing, multiple variants, image assets, and SEO</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slug) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                      }
                    }}
                    placeholder="e.g. Nothing Phone (2) Clear Protective Case"
                    className="w-full px-3 py-2.5 border rounded-xl text-sm focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-neutral-700">Category *</label>
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl bg-white focus:ring-1 focus:ring-red-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-neutral-700">Brand</label>
                    <select
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl bg-white focus:ring-1 focus:ring-red-500"
                    >
                      <option value="">None</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-neutral-700">Regular Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-neutral-700">Sale Price (PKR)</label>
                    <input
                      type="number"
                      min="0"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-neutral-700">Base SKU</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g. NOTH-CASE-P2"
                      className="w-full px-3 py-2 border rounded-xl font-mono text-xs focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Primary Image Upload from PC */}
                <ImageUpload
                  label="Primary Product Photo (Upload from PC)"
                  value={imageUrl}
                  onChange={setImageUrl}
                  folder="products"
                />

                {/* Additional Gallery Photos */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-neutral-700">Additional Gallery Photos</label>
                    <button
                      type="button"
                      onClick={() => setGalleryImages([...galleryImages, ""])}
                      className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                    >
                      + Add Gallery Photo
                    </button>
                  </div>
                  {galleryImages.map((gImg, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1">
                        <ImageUpload
                          value={gImg}
                          onChange={(url) => {
                            const updated = [...galleryImages];
                            updated[idx] = url;
                            setGalleryImages(updated.filter(Boolean));
                          }}
                          folder="products"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                        className="text-sm text-neutral-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                        title="Remove slot"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                {/* 🎨 Dedicated Product Variants Builder */}
                <div className="pt-3 border-t space-y-3">
                  <div className="flex items-center justify-between bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                        <span>🎨</span> Multiple Product Variants & Options
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Enable if this product comes in multiple colors, phone models, or editions.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasVariants}
                        onChange={(e) => setHasVariants(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  {hasVariants && (
                    <div className="space-y-4 bg-neutral-50/70 p-4 rounded-xl border border-neutral-200">
                      {/* Step 1: Select Available Options */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                            Step 1: Select Attributes & Values For This Product
                          </label>
                        </div>

                        {availableAttributes.length === 0 ? (
                          <div className="p-3 bg-white rounded-lg border border-neutral-200 text-neutral-400 italic text-xs">
                            No attributes defined yet. Go to Product Attributes & Options to create attributes like Color or Model.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {availableAttributes.map((attr) => (
                              <div key={attr.id} className="p-3 bg-white rounded-xl border border-neutral-200/80 shadow-2xs space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-red-500" />
                                  <span className="font-bold text-neutral-900 text-xs">{attr.name}:</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {(attr.values || []).map((val) => {
                                    const isSelected = (selectedAttrValues[attr.id] || []).includes(val.id);
                                    return (
                                      <button
                                        key={val.id}
                                        type="button"
                                        onClick={() => toggleAttrValue(attr.id, val.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                          isSelected
                                            ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs scale-102"
                                            : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                                        }`}
                                      >
                                        {isSelected ? "✓ " : "+ "}
                                        {val.value}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Generator Buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={generateVariantCombinations}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition"
                          >
                            <span>⚡</span> Auto-Generate All Combinations
                          </button>
                        </div>

                        {/* Direct Single Variant Creator */}
                        <div className="mt-3 p-3.5 bg-white rounded-xl border border-neutral-200/90 shadow-2xs space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-neutral-800 text-xs flex items-center gap-1">
                              <span>➕</span> Or Add A Single Variant Directly:
                            </span>
                            <span className="text-[10px] text-neutral-400">Pick options & click Add</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {availableAttributes.map((attr) => (
                              <div key={attr.id}>
                                <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">{attr.name}</label>
                                <select
                                  value={singleVariantSelections[attr.id] || ""}
                                  onChange={(e) =>
                                    setSingleVariantSelections({
                                      ...singleVariantSelections,
                                      [attr.id]: e.target.value === "" ? 0 : Number(e.target.value),
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-red-500"
                                >
                                  <option value="">-- Choose {attr.name} --</option>
                                  {(attr.values || []).map((val) => (
                                    <option key={val.id} value={val.id}>
                                      {val.value}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={handleAddSingleVariant}
                            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-2xs"
                          >
                            + Add This Variant to List
                          </button>
                        </div>
                      </div>

                      {/* Step 2: Variants Matrix Table */}
                      {variants.length > 0 && (
                        <div className="space-y-2.5 pt-3 border-t border-neutral-200">
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                              Step 2: Set Prices & Stock For Generated Variants ({variants.length})
                            </label>
                            <button
                              type="button"
                              onClick={syncBasePricesToVariants}
                              className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                            >
                              Sync Base Price ({money(Number(price || 0))}) to All
                            </button>
                          </div>

                          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                            {variants.map((v, vIdx) => (
                              <div
                                key={vIdx}
                                className="p-3 bg-white rounded-xl border border-neutral-200/90 shadow-2xs space-y-2.5"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-bold rounded">
                                      #{vIdx + 1}
                                    </span>
                                    <span className="text-xs font-bold text-neutral-900">
                                      {v.attrNames || v.sku}
                                    </span>
                                    {v.status === false && (
                                      <span className="px-1.5 py-0.5 bg-neutral-200 text-neutral-700 text-[9px] font-bold rounded">
                                        Hidden / Inactive
                                      </span>
                                    )}
                                    {v.stock_status === "out_of_stock" && (
                                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded">
                                        Out of Stock
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-neutral-600">
                                      <input
                                        type="checkbox"
                                        checked={v.status !== false}
                                        onChange={(e) => updateVariantField(vIdx, "status", e.target.checked)}
                                        className="rounded text-red-600 focus:ring-red-500"
                                      />
                                      <span>Active / Visible</span>
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeVariant(vIdx)}
                                      className="text-neutral-400 hover:text-red-600 text-xs font-bold p-1 cursor-pointer"
                                      title="Delete Variant"
                                    >
                                      ✕ Delete
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-5 gap-2 text-[11px]">
                                  <div>
                                    <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">
                                      SKU
                                    </label>
                                    <input
                                      type="text"
                                      required
                                      value={v.sku}
                                      onChange={(e) => updateVariantField(vIdx, "sku", e.target.value)}
                                      className="w-full px-2 py-1.5 border rounded-lg text-[11px] font-mono"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">
                                      Price (PKR) *
                                    </label>
                                    <input
                                      type="number"
                                      required
                                      min="0"
                                      value={v.price}
                                      onChange={(e) => updateVariantField(vIdx, "price", e.target.value)}
                                      className="w-full px-2 py-1.5 border rounded-lg text-[11px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">
                                      Sale Price
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={v.sale_price}
                                      onChange={(e) => updateVariantField(vIdx, "sale_price", e.target.value)}
                                      className="w-full px-2 py-1.5 border rounded-lg text-[11px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">
                                      Stock Qty
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={v.quantity}
                                      onChange={(e) => updateVariantField(vIdx, "quantity", Number(e.target.value))}
                                      className="w-full px-2 py-1.5 border rounded-lg text-[11px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">
                                      Stock Status
                                    </label>
                                    <select
                                      value={v.stock_status || "in_stock"}
                                      onChange={(e) => updateVariantField(vIdx, "stock_status", e.target.value)}
                                      className="w-full px-2 py-1.5 border rounded-lg text-[11px] bg-white"
                                    >
                                      <option value="in_stock">In Stock</option>
                                      <option value="out_of_stock">Out of Stock</option>
                                      <option value="backorder">Backorder</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">Short Summary</label>
                  <input
                    type="text"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                {/* Rich Description Editor */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-neutral-700">Full Product Description</label>
                    <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setDescEditorTab("write")}
                        className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                          descEditorTab === "write" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500"
                        }`}
                      >
                        Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescEditorTab("preview")}
                        className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                          descEditorTab === "preview" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500"
                        }`}
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  {descEditorTab === "write" ? (
                    <div className="border rounded-xl overflow-hidden">
                      <div className="flex flex-wrap items-center gap-1 p-1.5 bg-neutral-50 border-b text-neutral-700">
                        <button
                          type="button"
                          onClick={() => insertDescFormatting("**", "**", "bold text")}
                          className="px-2 py-0.5 text-xs font-bold bg-white hover:bg-neutral-100 border rounded cursor-pointer"
                          title="Bold"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => insertDescFormatting("*", "*", "italic text")}
                          className="px-2 py-0.5 text-xs italic font-serif bg-white hover:bg-neutral-100 border rounded cursor-pointer"
                          title="Italic"
                        >
                          I
                        </button>
                        <span className="h-3.5 w-px bg-neutral-300 mx-0.5" />
                        <button
                          type="button"
                          onClick={() => insertDescFormatting("## ", "\n", "Heading 2")}
                          className="px-1.5 py-0.5 text-[11px] font-semibold bg-white hover:bg-neutral-100 border rounded cursor-pointer"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => insertDescFormatting("### ", "\n", "Heading 3")}
                          className="px-1.5 py-0.5 text-[11px] font-semibold bg-white hover:bg-neutral-100 border rounded cursor-pointer"
                        >
                          H3
                        </button>
                        <span className="h-3.5 w-px bg-neutral-300 mx-0.5" />
                        <button
                          type="button"
                          onClick={() => insertDescFormatting("> ", "\n", "Highlight quote")}
                          className="px-1.5 py-0.5 text-[11px] bg-white hover:bg-neutral-100 border rounded cursor-pointer"
                          title="Blockquote"
                        >
                          &ldquo; Quote
                        </button>
                        <button
                          type="button"
                          onClick={() => insertDescFormatting("- ", "\n", "Feature item")}
                          className="px-1.5 py-0.5 text-[11px] bg-white hover:bg-neutral-100 border rounded cursor-pointer"
                          title="Bullet list"
                        >
                          • List
                        </button>
                        <button
                          type="button"
                          onClick={() => insertDescFormatting("[", "](https://...)", "Link text")}
                          className="px-1.5 py-0.5 text-[11px] bg-white hover:bg-neutral-100 border rounded cursor-pointer"
                          title="Insert link"
                        >
                          🔗 Link
                        </button>
                        <span className="h-3.5 w-px bg-neutral-300 mx-0.5" />
                        <button
                          type="button"
                          onClick={() => inlineProductImageInputRef.current?.click()}
                          className="px-2 py-0.5 text-[11px] font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded flex items-center gap-1 cursor-pointer"
                          title="Upload image from PC and insert with Alt Text"
                        >
                          🖼️ Insert Photo
                        </button>
                        <input
                          ref={inlineProductImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleInlineProductImageUpload}
                          className="hidden"
                        />
                      </div>

                      <textarea
                        ref={descTextareaRef}
                        rows={7}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Write formatted product specifications, highlights, compatibility..."
                        className="w-full p-3 font-mono text-xs leading-relaxed outline-none resize-y"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-xl p-4 bg-neutral-50 min-h-[140px] text-xs leading-relaxed overflow-y-auto max-h-[260px]">
                      {desc ? (
                        <RichTextRenderer content={desc} className="prose prose-neutral max-w-none text-xs" />
                      ) : (
                        <p className="text-neutral-400 italic">No description added yet.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <label className="block font-semibold mb-1 text-neutral-700">SEO Meta Title</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Page title for Google"
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-neutral-700">SEO Meta Description</label>
                    <input
                      type="text"
                      value={seoDesc}
                      onChange={(e) => setSeoDesc(e.target.value)}
                      placeholder="Search snippet"
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                {/* Schema Markup */}
                <div className="pt-2 border-t space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block font-semibold text-neutral-900">
                        Product Schema Markup (JSON-LD Structured Data)
                      </label>
                      <p className="text-[10px] text-neutral-500">Google Rich Snippets JSON-LD schema</p>
                    </div>
                    <button
                      type="button"
                      onClick={generateSchemaTemplate}
                      className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg cursor-pointer transition shadow-2xs"
                    >
                      ⚡ Auto-Generate Schema
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={schemaMarkup}
                    onChange={(e) => setSchemaMarkup(e.target.value)}
                    placeholder='{"@context": "https://schema.org/", "@type": "Product", ...}'
                    className="w-full p-2.5 font-mono text-[11px] border rounded-lg bg-neutral-900 text-emerald-400 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex gap-4 pt-2 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} />
                    Best Seller
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input type="checkbox" checked={isDeal} onChange={(e) => setIsDeal(e.target.checked)} />
                    Deals & Offers
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
                    New Launch
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 border rounded-xl font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl disabled:opacity-50 cursor-pointer shadow-xs transition"
                  >
                    {saving ? "Saving..." : "Save Product"}
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
