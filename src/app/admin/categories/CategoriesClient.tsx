'use client';

import React, { useState } from 'react';
import { Category } from '@/types/database';
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/actions/categories';
import { Plus, Edit2, Trash2, Check, X, AlertCircle, Layers } from 'lucide-react';

export function CategoriesClient({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);

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
    setEditingCat(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image_url: cat.image_url || '',
      sort_order: cat.sort_order,
      is_active: cat.is_active,
    });
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

    try {
      if (editingCat) {
        const res = await updateCategoryAction(editingCat.id, form);
        if (res.success) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCat.id ? { ...c, ...form } : c))
          );
          setEditingCat(null);
        } else {
          setErrorMsg(res.error || 'Failed to update category.');
        }
      } else {
        const res = await createCategoryAction(form);
        if (res.success) {
          if (res.data) {
            setCategories((prev) => [...prev, res.data]);
          }
          setIsAdding(false);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Category List */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base">
            Existing Categories ({categories.length})
          </h3>
          {!isAdding && !editingCat && (
            <button
              type="button"
              onClick={startAdd}
              className="inline-flex items-center gap-1.5 bg-[#800f2f] hover:bg-[#a4133c] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-rose-100 shadow-xs divide-y divide-rose-50 overflow-hidden">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 flex items-center justify-between hover:bg-rose-50/20 transition gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-rose-50 overflow-hidden border border-rose-100 shrink-0">
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rose-300">
                      <Layers className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{cat.name}</h4>
                  <p className="text-xs text-gray-400 font-mono">/{cat.slug}</p>
                  {cat.description && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">{cat.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(cat)}
                  className="p-1.5 text-gray-600 hover:text-[#800f2f] hover:bg-rose-50 rounded-lg transition"
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
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Form Panel */}
      {(isAdding || editingCat) && (
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4 self-start">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <h3 className="font-bold text-gray-900 text-sm">
              {editingCat ? `Edit: ${editingCat.name}` : 'New Category'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingCat(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
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
                className="w-full text-xs p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
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
                placeholder="Brief summary..."
                className="w-full text-xs p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  className="w-full text-xs p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded text-[#800f2f] focus:ring-[#800f2f] w-4 h-4"
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#800f2f] hover:bg-[#a4133c] text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs transition disabled:bg-gray-300"
              >
                {saving ? 'Saving...' : editingCat ? 'Save Changes' : 'Create Category'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingCat(null);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
