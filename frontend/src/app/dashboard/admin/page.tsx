"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_ORDERS, GET_ALL_USERS, CREATE_RESTAURANT, ADD_MENU_ITEM, UPDATE_ORDER_STATUS } from "@/lib/graphql-queries";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState<"orders" | "users" | "restaurants">("orders");

    useEffect(() => {
        if (!authLoading && user?.roleId !== 3) router.push("/dashboard");
    }, [authLoading, user, router]);

    if (authLoading || user?.roleId !== 3) return null;

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <div className="flex gap-2 mb-6">
                {(["orders", "users", "restaurants"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${tab === t ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:bg-white/5"}`}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>
            {tab === "orders" && <AdminOrders />}
            {tab === "users" && <AdminUsers />}
            {tab === "restaurants" && <AdminRestaurants />}
        </div>
    );
}

function AdminOrders() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, loading, refetch } = useQuery(GET_ALL_ORDERS) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [updateStatus] = useMutation(UPDATE_ORDER_STATUS, { onCompleted: () => refetch() });
    const statusBadge = (s: string) => ({ CREATED: "badge-created", PAID: "badge-paid", COMPLETED: "badge-completed", CANCELLED: "badge-cancelled" }[s] || "badge-created");

    if (loading) return <div className="text-center py-10 text-gray-400">Loading orders...</div>;
    const orders = data?.allOrders || [];

    return (
        <div className="space-y-3">
            <p className="text-gray-400 text-sm mb-3">{orders.length} total order(s)</p>
            {orders.map((o: any) => (
                <div key={o.id} className="glass-card p-4 flex justify-between items-center">
                    <div>
                        <span className="font-semibold">Order #{o.id}</span>
                        <span className="text-gray-500 text-sm ml-3">User #{o.userId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-orange-400">${o.totalAmount.toFixed(2)}</span>
                        <span className={`badge ${statusBadge(o.orderStatus)}`}>{o.orderStatus}</span>
                        {o.orderStatus !== "CANCELLED" && o.orderStatus !== "COMPLETED" && (
                            <select className="input-field text-xs py-1 px-2 w-auto" defaultValue="" onChange={(e) => { if (e.target.value) updateStatus({ variables: { orderId: o.id, status: e.target.value } }); }}>
                                <option value="" disabled>Update</option>
                                <option value="PAID">PAID</option>
                                <option value="COMPLETED">COMPLETED</option>
                            </select>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function AdminUsers() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, loading } = useQuery(GET_ALL_USERS) as any;
    if (loading) return <div className="text-center py-10 text-gray-400">Loading users...</div>;
    const users = data?.users || [];
    const roleLabel = (id: number) => ({ 1: "Member", 2: "Manager", 3: "Admin" }[id] || "Unknown");

    return (
        <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-800">
                    <th className="text-left p-3 text-gray-400">ID</th>
                    <th className="text-left p-3 text-gray-400">Name</th>
                    <th className="text-left p-3 text-gray-400">Email</th>
                    <th className="text-left p-3 text-gray-400">Role</th>
                    <th className="text-left p-3 text-gray-400">Active</th>
                </tr></thead>
                <tbody>
                    {users.map((u: any) => (
                        <tr key={u.id} className="border-b border-gray-800/50 hover:bg-white/5">
                            <td className="p-3">{u.id}</td>
                            <td className="p-3">{u.firstName} {u.lastName}</td>
                            <td className="p-3 text-gray-400">{u.email}</td>
                            <td className="p-3"><span className="badge badge-created">{roleLabel(u.roleId)}</span></td>
                            <td className="p-3">{u.isActive ? "✅" : "❌"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AdminRestaurants() {
    const [form, setForm] = useState({ name: "", description: "", address: "", phoneNumber: "", countryId: 1 });
    const [menuForm, setMenuForm] = useState({ name: "", description: "", price: 0, restaurantId: 0 });
    const [showMenu, setShowMenu] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [createRest, { loading: creating }] = useMutation(CREATE_RESTAURANT, {
        onCompleted: (data: any) => {
            alert(`Restaurant "${data.createRestaurant.name}" created (ID: ${data.createRestaurant.id})`);
            setForm({ name: "", description: "", address: "", phoneNumber: "", countryId: 1 });
        },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [addItem, { loading: addingItem }] = useMutation(ADD_MENU_ITEM, {
        onCompleted: (data: any) => {
            alert(`Menu item "${data.addMenuItem.name}" added!`);
            setMenuForm({ name: "", description: "", price: 0, restaurantId: menuForm.restaurantId });
        },
    });

    return (
        <div className="space-y-6">
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4">Create Restaurant</h2>
                <div className="grid gap-3 md:grid-cols-2">
                    <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <input className="input-field" placeholder="Phone" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                    <input className="input-field" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    <input className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <button onClick={() => createRest({ variables: { createRestaurantInput: form } })} disabled={creating || !form.name} className="btn-primary mt-4">
                    {creating ? "Creating..." : "Create Restaurant"}
                </button>
            </div>

            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Add Menu Item</h2>
                    <button onClick={() => setShowMenu(!showMenu)} className="btn-secondary text-xs">{showMenu ? "Hide" : "Show"}</button>
                </div>
                {showMenu && (
                    <div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <input className="input-field" placeholder="Item name" value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} />
                            <input className="input-field" type="number" placeholder="Restaurant ID" value={menuForm.restaurantId || ""} onChange={(e) => setMenuForm({ ...menuForm, restaurantId: parseInt(e.target.value) || 0 })} />
                            <input className="input-field" placeholder="Description" value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} />
                            <input className="input-field" type="number" step="0.01" placeholder="Price" value={menuForm.price || ""} onChange={(e) => setMenuForm({ ...menuForm, price: parseFloat(e.target.value) || 0 })} />
                        </div>
                        <button onClick={() => addItem({ variables: { createMenuItemInput: menuForm } })} disabled={addingItem || !menuForm.name || !menuForm.restaurantId} className="btn-primary mt-4">
                            {addingItem ? "Adding..." : "Add Menu Item"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
