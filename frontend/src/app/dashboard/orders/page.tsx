"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_ORDERS, CANCEL_ORDER } from "@/lib/graphql-queries";

export default function OrdersPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, loading, error, refetch } = useQuery(GET_MY_ORDERS) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cancelOrder, { loading: cancelling }] = useMutation(CANCEL_ORDER, { onCompleted: () => refetch() });

    const statusBadge = (status: string) => {
        const map: Record<string, string> = { CREATED: "badge-created", PAID: "badge-paid", COMPLETED: "badge-completed", CANCELLED: "badge-cancelled" };
        return map[status] || "badge-created";
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-orange-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        </div>
    );
    if (error) return <div className="glass-card p-6 text-red-400">Error: {error.message}</div>;

    const orders = data?.myOrders || [];

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>
            {orders.length === 0 ? (
                <div className="glass-card p-8 text-center text-gray-400">
                    <div className="text-4xl mb-3">📦</div>
                    <p>No orders yet. Start by browsing restaurants!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: any) => (
                        <div key={order.id} className="glass-card p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                                    <p className="text-gray-400 text-sm">Restaurant #{order.restaurantId}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`badge ${statusBadge(order.orderStatus)}`}>{order.orderStatus}</span>
                                    <span className="text-xl font-bold gradient-text">${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            {order.items?.length > 0 && (
                                <div className="bg-gray-800/30 rounded-lg p-3 mb-4">
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between text-sm py-1">
                                            <span className="text-gray-300">Item #{item.menuItemId} × {item.quantity}</span>
                                            <span className="text-gray-400">${item.subtotal.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {order.orderStatus === "CREATED" && (
                                <button
                                    onClick={() => cancelOrder({ variables: { orderId: order.id } })}
                                    disabled={cancelling}
                                    className="btn-danger"
                                >
                                    {cancelling ? "Cancelling..." : "Cancel Order"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
