"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
    menuItemId: number;
    name: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    restaurantId: number | null;
    restaurantName: string;
    addItem: (item: Omit<CartItem, "quantity">, restId: number, restName: string) => void;
    removeItem: (menuItemId: number) => void;
    updateQuantity: (menuItemId: number, quantity: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType>({
    items: [],
    restaurantId: null,
    restaurantName: "",
    addItem: () => { },
    removeItem: () => { },
    updateQuantity: () => { },
    clearCart: () => { },
    total: 0,
    itemCount: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [restaurantId, setRestaurantId] = useState<number | null>(null);
    const [restaurantName, setRestaurantName] = useState("");

    const addItem = (item: Omit<CartItem, "quantity">, restId: number, restName: string) => {
        if (restaurantId && restaurantId !== restId) {
            if (!confirm(`Your cart has items from ${restaurantName}. Clear cart and add from ${restName}?`)) return;
            setItems([]);
        }
        setRestaurantId(restId);
        setRestaurantName(restName);
        setItems((prev) => {
            const existing = prev.find((i) => i.menuItemId === item.menuItemId);
            if (existing) {
                return prev.map((i) => i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (menuItemId: number) => {
        setItems((prev) => {
            const filtered = prev.filter((i) => i.menuItemId !== menuItemId);
            if (filtered.length === 0) { setRestaurantId(null); setRestaurantName(""); }
            return filtered;
        });
    };

    const updateQuantity = (menuItemId: number, quantity: number) => {
        if (quantity <= 0) { removeItem(menuItemId); return; }
        setItems((prev) => prev.map((i) => i.menuItemId === menuItemId ? { ...i, quantity } : i));
    };

    const clearCart = () => { setItems([]); setRestaurantId(null); setRestaurantName(""); };
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, restaurantId, restaurantName, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
