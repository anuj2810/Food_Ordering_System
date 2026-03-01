"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "@/context/AuthContext";
import { REGISTER_MUTATION } from "@/lib/graphql-queries";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        roleId: 1,
        countryId: 1,
    });
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION, {
        onCompleted: (data: any) => {
            login(data.register.accessToken, data.register.user);
            router.push("/dashboard");
        },
        onError: (err: any) => {
            setError(err.message || "Registration failed. Please try again.");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        registerMutation({
            variables: {
                registerUserInput: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    roleId: formData.roleId,
                    countryId: formData.countryId,
                },
            },
        });
    };

    const updateField = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
            </div>

            <div className="glass-card p-8 w-full max-w-lg animate-fade-in-up relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold gradient-text">Create Account</h1>
                    <p className="text-gray-400 mt-2">Join FoodOrder and start ordering</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-slide-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                            <input
                                id="register-firstname"
                                type="text"
                                className="input-field"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={(e) => updateField("firstName", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                            <input
                                id="register-lastname"
                                type="text"
                                className="input-field"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={(e) => updateField("lastName", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            id="register-email"
                            type="email"
                            className="input-field"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            id="register-password"
                            type="password"
                            className="input-field"
                            placeholder="Min. 6 characters"
                            value={formData.password}
                            onChange={(e) => updateField("password", e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                        <input
                            id="register-confirm-password"
                            type="password"
                            className="input-field"
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={(e) => updateField("confirmPassword", e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                            <select
                                id="register-role"
                                className="input-field"
                                value={formData.roleId}
                                onChange={(e) => updateField("roleId", parseInt(e.target.value))}
                            >
                                <option value={1}>Member</option>
                                <option value={2}>Manager</option>
                                <option value={3}>Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                            <select
                                id="register-country"
                                className="input-field"
                                value={formData.countryId}
                                onChange={(e) => updateField("countryId", parseInt(e.target.value))}
                            >
                                <option value={1}>United States</option>
                                <option value={2}>Canada</option>
                                <option value={3}>United Kingdom</option>
                                <option value={4}>India</option>
                            </select>
                        </div>
                    </div>

                    <button
                        id="register-submit"
                        type="submit"
                        className="btn-primary w-full mt-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Creating account...
                            </span>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
