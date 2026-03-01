"use client";

import { useQuery } from "@apollo/client/react";
import { GET_RESTAURANTS } from "@/lib/graphql-queries";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Link from "next/link";

export default function RestaurantsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, loading, error } = useQuery(GET_RESTAURANTS) as any;
    const { addItem, items, total, itemCount } = useCart();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    if (loading) return (
        <div className="flex justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-orange-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        </div>
    );

    if (error) return <div className="glass-card p-6 text-red-400">Error loading restaurants: {error.message}</div>;

    const restaurants = data?.restaurants || [];

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Browse Restaurants</h1>
                    <p className="text-gray-400 text-sm mt-1">{restaurants.length} restaurant(s) available</p>
                </div>
                {itemCount > 0 && (
                    <Link href="/dashboard/orders/checkout" className="btn-primary flex items-center gap-2">
                        🛒 Cart ({itemCount}) — ${total.toFixed(2)}
                    </Link>
                )}
            </div>

            <div className="grid gap-4">
                {restaurants.map((r: any) => (
                    <div key={r.id} className="glass-card overflow-hidden">
                        <div
                            className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex justify-between items-center"
                            onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-gray-100">{r.name}</h2>
                                <p className="text-gray-400 text-sm mt-1">{r.description}</p>
                                <p className="text-gray-500 text-xs mt-2">📍 {r.address} · 📞 {r.phoneNumber}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-400">{r.menuItems?.length || 0} items</span>
                                <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === r.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {expandedId === r.id && (
                            <div className="border-t border-gray-800 p-4">
                                {r.menuItems?.length > 0 ? (
                                    <div className="grid gap-3">
                                        {r.menuItems.map((item: any) => {
                                            const inCart = items.find((c) => c.menuItemId === item.id);
                                            return (
                                                <div key={item.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                                                    <div>
                                                        <span className="font-medium text-gray-200">{item.name}</span>
                                                        <span className="text-gray-500 text-sm ml-2">{item.description}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-semibold text-orange-400">${item.price.toFixed(2)}</span>
                                                        {inCart ? (
                                                            <span className="badge badge-paid">In cart ×{inCart.quantity}</span>
                                                        ) : (
                                                            <button
                                                                onClick={() => addItem({ menuItemId: item.id, name: item.name, price: item.price }, r.id, r.name)}
                                                                className="btn-primary text-xs py-1.5 px-3"
                                                            >
                                                                + Add
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No menu items available</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
