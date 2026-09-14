'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ShoppingListItem } from '@/types/database';

interface ShoppingListContextType {
  items: ShoppingListItem[];
  addItem: (item: Omit<ShoppingListItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  updateRequestedWeight: (productId: string, weight: string) => void;
  clearList: () => void;
  totalItemsCount: number;
  hasPriceOnRequestItems: boolean;
  estimatedSubtotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

const STORAGE_KEY = 'bajaj_karyan_shopping_list_v1';

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load shopping list from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save shopping list to localStorage', e);
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<ShoppingListItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === item.productId);
      const qtyToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1;

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Number((updated[existingIndex].quantity + qtyToAdd).toFixed(2)),
          customerNotes: item.customerNotes || updated[existingIndex].customerNotes,
          requestedWeight: item.requestedWeight || updated[existingIndex].requestedWeight,
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...item,
          quantity: qtyToAdd,
        },
      ];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Number(quantity.toFixed(2)) }
          : item
      )
    );
  };

  const updateNotes = (productId: string, customerNotes: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, customerNotes } : item
      )
    );
  };

  const updateRequestedWeight = (productId: string, requestedWeight: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, requestedWeight } : item
      )
    );
  };

  const clearList = () => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const hasPriceOnRequestItems = items.some((item) => item.price === null);

  const estimatedSubtotal = items.reduce((sum, item) => {
    if (item.price === null) return sum;
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <ShoppingListContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        updateRequestedWeight,
        clearList,
        totalItemsCount,
        hasPriceOnRequestItems,
        estimatedSubtotal,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
}
