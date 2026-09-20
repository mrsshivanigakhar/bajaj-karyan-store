'use client';

import React, { useState, useMemo } from 'react';
import { Category } from '@/types/database';
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/actions/categories';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  Layers,
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
} from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AdminReportToolbar } from '@/components/admin/AdminReportToolbar';
import { generateCategoriesReport } from '@/lib/reports/report-generators';

export function CategoriesClient({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [parentSlug, setParentSlug] = useState<string>('');

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    sort_order: 0,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startAdd = () => {
    setEditingCat(null);
    setErrorMsg(null);
    setParentSlug('');
    setForm({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      sort_order: categories.length + 1,
      is_active: true,
    });
    setIsAdding(true);
  };

  const startEdit = (cat: Category) => {
    setIsAdding(false);
    setErrorMsg(null);
    setEditingCat(cat);
    const isSub = cat.slug.includes('--');
    const pSlug = isSub ? cat.slug.split('--')[0] : '';
    setParentSlug(pSlug);
    setForm({
      name: cat.name,
      slug: isSub ? cat.slug.split('--')[1] : cat.slug,
      description: (cat.description || '').replace(/^\[Parent:\s*[^\]]+\]\s*/i, ''),
      image_url: cat.image_url || '',
      sort_order: cat.sort_order,
      is_active: cat.is_active,
    });
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingCat(null);
    setErrorMsg(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: editingCat
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

    const cleanSlug = form.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const finalSlug = parentSlug ? `${parentSlug}--${cleanSlug}` : cleanSlug;
    let finalDesc = form.description || '';
    if (parentSlug && !finalDesc.includes(`[Parent: ${parentSlug}]`)) {
      finalDesc = `[Parent: ${parentSlug}] ${finalDesc}`.trim();
    }

    const payload = {
      ...form,
      slug: finalSlug,
      description: finalDesc,
    };

    try {
      if (editingCat) {
        const res = await updateCategoryAction(editingCat.id, payload);
        if (res.success) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCat.id ? { ...c, ...payload } : c))
          );
          closeModal();
        } else {
          setErrorMsg(res.error || 'Failed to update category.');
        }
      } else {
        const res = await createCategoryAction(payload);
        if (res.success) {
          if (res.data) {
            setCategories((prev) => [...prev, res.data]);
          }
          closeModal();
        } else {
          setErrorMsg(res.error || 'Failed to create category.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(res.error || 'Failed to delete category.');
      }
    }
  };

  // Filter categories by search term
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query))
    );
  }, [categories, searchQuery]);

  const handleExportPdf = (scope: 'filtered' | 'all') => {
    const list = scope === 'filtered' ? filteredCategories : categories;
    generateCategoriesReport(list, 'pdf');
  };

  const handleExportExcel = (scope: 'filtered' | 'all') => {
    const list = scope === 'filtered' ? filteredCategories : categories;
    generateCategoriesReport(list, 'excel');
  };

  return (
    <div className="w-full space-y-6">
      {/* Reports & Export Toolbar */}
      <AdminReportToolbar
        title="Categories Taxonomy Report"
        subtitle="Export category list, slugs, display hierarchy, and active storefront status."
        totalCount={categories.length}
        filteredCount={filteredCategories.length}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
      />

      {/* Action and Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-rose-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-rose-50/60 p-1 rounded-xl border border-rose-200/60">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'table'
                  ? 'bg-white text-[#800f2f] shadow-2xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'grid'
                  ? 'bg-white text-[#800f2f] shadow-2xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Grid</span>
            </button>
          </div>

          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 bg-[#800f2f] hover:bg-[#a4133c] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Display */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-3xl border border-rose-100 p-16 text-center text-gray-500 shadow-xs">
          <Layers className="w-12 h-12 text-rose-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 text-base mb-1">
            {searchQuery ? 'No categories found' : 'No categories yet'}
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            {searchQuery
              ? `No category matching "${searchQuery}".`
              : 'Get started by creating your first store category.'}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={startAdd}
              className="inline-flex items-center gap-2 bg-[#800f2f] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* Full-Width Data Table */
        <div className="bg-white rounded-3xl border border-rose-100 shadow-xs overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/50 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-rose-100">
                <tr>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Slug</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6 text-center">Sort Order</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50 text-xs sm:text-sm">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-rose-50/20 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 overflow-hidden border border-rose-100 shrink-0 shadow-2xs">
                          {cat.image_url ? (
                            <img
                              src={cat.image_url}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-rose-300">
                              <Layers className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 block">{cat.name}</span>
                            {cat.slug.includes('--') ? (
                              <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                                Sub-Category
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 bg-rose-50 text-[#800f2f] border border-rose-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                Main
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 font-mono">
                            /{cat.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-600 font-mono text-xs">
                      /{cat.slug}
                    </td>

                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                      {cat.description || '—'}
                    </td>

                    <td className="py-4 px-6 text-center font-mono font-semibold text-gray-700">
                      {cat.sort_order}
                    </td>

                    <td className="py-4 px-6 text-center">
                      {cat.is_active ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 border border-gray-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                          <X className="w-3 h-3" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className="p-1.5 text-gray-600 hover:text-[#800f2f] hover:bg-rose-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Full-Width Responsive Card Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-rose-100 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition group"
            >
              <div className="h-36 w-full bg-rose-50 relative overflow-hidden">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-rose-300">
                    <Layers className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-2.5 right-2.5">
                  {cat.is_active ? (
                    <span className="bg-emerald-500/90 text-white backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      Active
                    </span>
                  ) : (
                    <span className="bg-gray-500/90 text-white backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2.5 left-2.5 bg-black/60 text-white backdrop-blur-xs text-[10px] font-mono px-2 py-0.5 rounded-md">
                  Order: #{cat.sort_order}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{cat.name}</h4>
                  <p className="text-xs text-gray-400 font-mono">/{cat.slug}</p>
                  {cat.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-50">
                  <button
                    type="button"
                    onClick={() => startEdit(cat)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#800f2f] hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal Dialog */}
      {(isAdding || editingCat) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {editingCat ? `Edit Category: ${editingCat.name}` : 'Create New Category'}
                </h3>
                <p className="text-xs text-gray-500">
                  {editingCat
                    ? 'Update category information and photo in Supabase.'
                    : 'Add a new department or collection to your catalog.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Biscuits & Cookies"
                    className="w-full text-sm p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="biscuits-cookies"
                    className="w-full text-sm p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Parent Category (Hierarchy)
                </label>
                <select
                  value={parentSlug}
                  onChange={(e) => setParentSlug(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                >
                  <option value="">📁 None (This is a Main Category)</option>
                  {categories
                    .filter((c) => !c.slug.includes('--') && (editingCat ? c.id !== editingCat.id : true))
                    .map((main) => (
                      <option key={main.id} value={main.slug}>
                        ↳ Sub-Category under: {main.name}
                      </option>
                    ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Choose a Main Category to make this a Sub-Category (e.g. Atta under Staples).
                </p>
              </div>

              {/* Supabase Storage Image Upload */}
              <div>
                <ImageUpload
                  label="Category Image"
                  folder="categories"
                  value={form.image_url}
                  onChange={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
                  description="Upload an image from your device to save in the Supabase 'store' bucket, or paste a URL."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief summary of items in this category..."
                  className="w-full text-sm p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))
                    }
                    className="w-full text-sm p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded text-[#800f2f] focus:ring-[#800f2f] w-4 h-4"
                    />
                    <span>Active in Store</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-rose-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#800f2f] hover:bg-[#a4133c] text-white py-2.5 px-6 rounded-xl text-xs font-bold shadow-sm transition disabled:bg-gray-300"
                >
                  {saving ? 'Saving...' : editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
