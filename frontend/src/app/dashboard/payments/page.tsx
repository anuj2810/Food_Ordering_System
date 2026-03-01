"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_PAYMENT_METHODS, ADD_PAYMENT_METHOD, DELETE_PAYMENT_METHOD } from "@/lib/graphql-queries";
import { useState } from "react";

export default function PaymentsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, loading, error, refetch } = useQuery(GET_MY_PAYMENT_METHODS) as any;
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ methodName: "", provider: "", token: "" });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [addMethod, { loading: adding }] = useMutation(ADD_PAYMENT_METHOD, {
        onCompleted: () => { refetch(); setShowAdd(false); setForm({ methodName: "", provider: "", token: "" }); },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [deleteMethod] = useMutation(DELETE_PAYMENT_METHOD, { onCompleted: () => refetch() });

    if (loading) return (
        <div className="flex justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-orange-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        </div>
    );
    if (error) return <div className="glass-card p-6 text-red-400">Error: {error.message}</div>;

    const methods = data?.myPaymentMethods || [];

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Payment Methods</h1>
                <button onClick={() => setShowAdd(!showAdd)} className="btn-primary">
                    {showAdd ? "Cancel" : "+ Add Method"}
                </button>
            </div>

            {showAdd && (
                <div className="glass-card p-6 mb-6 animate-slide-in">
                    <h2 className="text-lg font-semibold mb-4">Add Payment Method</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <input className="input-field" placeholder="e.g. Visa Card" value={form.methodName} onChange={(e) => setForm({ ...form, methodName: e.target.value })} />
                        <input className="input-field" placeholder="e.g. Stripe" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
                        <input className="input-field" placeholder="Card token" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} />
                    </div>
                    <button
                        onClick={() => addMethod({ variables: { createPaymentMethodInput: form } })}
                        disabled={adding || !form.methodName || !form.provider || !form.token}
                        className="btn-primary mt-4"
                    >
                        {adding ? "Adding..." : "Save Payment Method"}
                    </button>
                </div>
            )}

            {methods.length === 0 ? (
                <div className="glass-card p-8 text-center text-gray-400">
                    <div className="text-4xl mb-3">💳</div>
                    <p>No payment methods yet. Add one to get started!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {methods.map((m: any) => (
                        <div key={m.id} className="glass-card p-5 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-200">{m.methodName}</h3>
                                <p className="text-sm text-gray-400">Provider: {m.provider}</p>
                                <p className="text-xs text-gray-500 mt-1">Token: {m.token?.slice(0, 12)}...</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {m.isActive && <span className="badge badge-paid">Active</span>}
                                <button onClick={() => deleteMethod({ variables: { id: m.id } })} className="btn-danger text-xs">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
