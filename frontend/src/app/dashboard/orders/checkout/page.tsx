"use client";

import { useCart } from "@/context/CartContext";
import { useMutation } from "@apollo/client/react";
import { CREATE_ORDER } from "@/lib/graphql-queries";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
    const { items, restaurantId, restaurantName, total, updateQuantity, removeItem, clearCart } = useCart();
    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [orderResult, setOrderResult] = useState<any>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [createOrder, { loading, error }] = useMutation(CREATE_ORDER, {
        onCompleted: (data: any) => {
            setOrderResult(data.createOrder);
            setSuccess(true);
            clearCart();
        },
    });

    const handleCheckout = () => {
        if (!restaurantId || items.length === 0) return;
        createOrder({
            variables: {
                createOrderInput: {
                    restaurantId,
                    items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
                },
            },
        });
    };

    if (success && orderResult) {
        return (
            <div className="animate-fade-in-up max-w-lg mx-auto">
                <div className="glass-card p-8 text-center">
                    <div className="text-5xl mb-4">🎉</div>
                    <h1 className="text-2xl font-bold gradient-text mb-2">Order Placed!</h1>
                    <p className="text-gray-400 mb-4">Order #{orderResult.id} — ${orderResult.totalAmount.toFixed(2)}</p>
                    <span className="badge badge-created">{orderResult.orderStatus}</span>
                    <div className="mt-6 flex gap-3 justify-center">
                        <Link href="/dashboard/orders" className="btn-primary">View My Orders</Link>
                        <Link href="/dashboard/restaurants" className="btn-secondary">Order More</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="animate-fade-in-up max-w-lg mx-auto">
                <div className="glass-card p-8 text-center">
                    <div className="text-5xl mb-4">🛒</div>
                    <h1 className="text-xl font-bold text-gray-300 mb-2">Your cart is empty</h1>
                    <Link href="/dashboard/restaurants" className="btn-primary mt-4 inline-block">Browse Restaurants</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Checkout</h1>
            <p className="text-gray-400 mb-6">From <span className="text-orange-400 font-medium">{restaurantName}</span></p>

            <div className="glass-card p-6 mb-4">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.menuItemId} className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
                            <div>
                                <span className="font-medium text-gray-200">{item.name}</span>
                                <span className="text-gray-500 text-sm ml-2">${item.price.toFixed(2)} each</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-sm transition-colors">−</button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-sm transition-colors">+</button>
                                </div>
                                <span className="font-semibold text-orange-400 w-20 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                                <button onClick={() => removeItem(item.menuItemId)} className="text-gray-500 hover:text-red-400 transition-colors">✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card p-6">
                <div className="flex justify-between items-center text-lg font-bold mb-4">
                    <span>Total</span>
                    <span className="gradient-text text-2xl">${total.toFixed(2)}</span>
                </div>
                {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error.message}</div>}
                <button onClick={handleCheckout} disabled={loading} className="btn-primary w-full text-lg py-3">
                    {loading ? "Processing..." : `Place Order — $${total.toFixed(2)}`}
                </button>
            </div>
        </div>
    );
}
