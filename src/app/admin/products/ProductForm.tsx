'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Product, UnitType } from '@/types/database';
import { createProductAction, updateProductAction } from '@/actions/products';
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface ProductFormProps {
  categories: Category[];
  initialProduct?: Product | null;
}

export function ProductForm({ categories, initialProduct }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialProduct;

  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    slug: initialProduct?.slug || '',
    category_id: initialProduct?.category_id || '',
    description: initialProduct?.description || '',
    image_url: initialProduct?.image_url || '',
    isPriceOnRequest: initialProduct ? initialProduct.price === null : false,
    price: initialProduct?.price !== null && initialProduct?.price !== undefined ? initialProduct.price : '',
    sale_price: initialProduct?.sale_price || '',
    unit_type: (initialProduct?.unit_type as UnitType) || 'packet',
    unit_value: initialProduct?.unit_value || 1,
    sku: initialProduct?.sku || '',
    stock_quantity: initialProduct?.stock_quantity !== undefined ? initialProduct.stock_quantity : 100,
    is_available: initialProduct ? initialProduct.is_available : true,
    is_featured: initialProduct ? initialProduct.is_featured : false,
    is_active: initialProduct ? initialProduct.is_active : true,
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: isEditing
        ? prev.slug
        : val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const priceVal = formData.isPriceOnRequest
      ? null
      : formData.price === ''
      ? null
      : Number(formData.price);

    const salePriceVal = formData.isPriceOnRequest
      ? null
      : formData.sale_price === ''
      ? null
      : Number(formData.sale_price);

    const payload = {
      name: formData.name,
      slug: formData.slug,
      category_id: formData.category_id || null,
      description: formData.description || null,
      image_url: formData.image_url || null,
      price: priceVal,
      sale_price: salePriceVal,
      unit_type: formData.unit_type,
      unit_value: Number(formData.unit_value),
      sku: formData.sku || null,
      stock_quantity: Number(formData.stock_quantity),
      is_available: formData.is_available,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
    };

    try {
      let res;
      if (isEditing && initialProduct) {
        res = await updateProductAction(initialProduct.id, payload);
      } else {
        res = await createProductAction(payload);
      }

      if (res.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to save product.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const unitOptions = [
    { value: 'packet', label: 'Packet' },
    { value: 'piece', label: 'Piece' },
    { value: 'box', label: 'Box' },
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'gram', label: 'Gram (g)' },
    { value: 'litre', label: 'Litre' },
    { value: 'ml', label: 'Millilitre (ml)' },
    { value: 'dozen', label: 'Dozen' },
    { value: 'bundle', label: 'Bundle' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#800f2f] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#800f2f] hover:bg-[#a4133c] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition disabled:bg-gray-300"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-gray-900 border-b border-rose-100 pb-3">
          {isEditing ? 'Edit Product Details' : 'New Product Information'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Parle-G Gold Biscuits"
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="parle-g-gold-biscuits"
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800 font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Store Category
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
              className="w-full text-sm p-3 rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
            >
              <option value="">Select Category / Sub-Category...</option>
              {(() => {
                const mainCats = categories.filter((c) => !c.slug.includes('--'));
                const subCats = categories.filter((c) => c.slug.includes('--'));

                return mainCats.map((main) => {
                  const children = subCats.filter((s) => s.slug.startsWith(`${main.slug}--`));
                  return (
                    <optgroup key={main.id} label={`📁 ${main.name}`}>
                      <option value={main.id}>📌 {main.name} (Main Category)</option>
                      {children.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          &nbsp;&nbsp;&nbsp;↳ {sub.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                });
              })()}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              SKU / Product Code (Optional)
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
              placeholder="e.g. PARLE-GOLD-01"
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800 font-mono"
            />
          </div>
        </div>

        {/* Pricing & Unit System */}
        <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-[#590d22]">Pricing & Measurement Unit</h4>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#800f2f]">
              <input
                type="checkbox"
                checked={formData.isPriceOnRequest}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isPriceOnRequest: e.target.checked }))
                }
                className="rounded text-[#800f2f] focus:ring-[#800f2f] w-4 h-4"
              />
              <span>Price on Request (Market Rate)</span>
            </label>
          </div>

          {!formData.isPriceOnRequest ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Regular Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required={!formData.isPriceOnRequest}
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g. 50"
                  className="w-full text-sm p-3 rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Sale / Discounted Price (₹ Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sale_price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sale_price: e.target.value }))}
                  placeholder="e.g. 45"
                  className="w-full text-sm p-3 rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-rose-800 bg-rose-100/60 p-3 rounded-xl">
              This product will display as <strong>“Price on Request”</strong> to customers. You will confirm the exact price per order when preparing items.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-rose-200/60">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Selling Unit Type *
              </label>
              <select
                value={formData.unit_type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, unit_type: e.target.value as UnitType }))
                }
                className="w-full text-sm p-3 rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
              >
                {unitOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Unit Measure Value (e.g. 1 kg, 0.5 kg, 500 g)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.unit_value}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, unit_value: parseFloat(e.target.value) || 1 }))
                }
                className="w-full text-sm p-3 rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Stock Quantity *
          </label>
          <input
            type="number"
            step="0.1"
            required
            value={formData.stock_quantity}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                stock_quantity: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full sm:w-1/2 text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800 font-bold"
          />
        </div>

        {/* Product Image Upload & Storage */}
        <div className="pt-2 border-t border-rose-100">
          <ImageUpload
            label="Product Image"
            folder="products"
            value={formData.image_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
            description="Upload a photo from your computer to store it in Supabase Storage, or enter an image URL."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Short Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Key ingredients, freshness, or packaging highlights..."
            className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
          />
        </div>

        {/* Status Toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-rose-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
            <input
              type="checkbox"
              checked={formData.is_available}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, is_available: e.target.checked }))
              }
              className="rounded text-[#800f2f] focus:ring-[#800f2f] w-4 h-4"
            />
            <span>Available for Ordering</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))
              }
              className="rounded text-[#800f2f] focus:ring-[#800f2f] w-4 h-4"
            />
            <span>Featured on Home Page</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
              className="rounded text-[#800f2f] focus:ring-[#800f2f] w-4 h-4"
            />
            <span>Active in Catalog</span>
          </label>
        </div>
      </div>
    </form>
  );
}
