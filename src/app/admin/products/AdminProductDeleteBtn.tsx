'use client';

import React, { useState } from 'react';
import { deleteProductAction } from '@/actions/products';
import { Trash2 } from 'lucide-react';

export function AdminProductDeleteBtn({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to remove "${productName}" from the store catalog?`)) {
      setIsDeleting(true);
      try {
        await deleteProductAction(productId);
      } catch (err) {
        alert('Failed to delete product.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
      title="Delete Product"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
