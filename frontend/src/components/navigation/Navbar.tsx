"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const roleLabel = () => {
        if (!user?.roleId) return "";
        const roles: Record<number, string> = { 1: "Member", 2: "Manager", 3: "Admin" };
        return roles[user.roleId] || "";
    };

    const roleBadgeColor = () => {
        if (!user?.roleId) return "bg-gray-600";
        const colors: Record<number, string> = {
            1: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            2: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            3: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        };
        return colors[user.roleId] || "bg-gray-600";
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="glass-card mx-4 mt-4 mb-6 px-6 py-4 flex items-center justify-between" style={{ borderRadius: "1rem" }}>
            <div className="flex items-center gap-8">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold gradient-text">FoodOrder</span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    <Link
                        href="/dashboard"
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/dashboard")
                                ? "bg-orange-500/15 text-orange-400"
                                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                            }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/restaurants"
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${pathname.startsWith("/dashboard/restaurants")
                                ? "bg-orange-500/15 text-orange-400"
                                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                            }`}
                    >
                        Restaurants
                    </Link>
                    <Link
                        href="/dashboard/orders"
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${pathname.startsWith("/dashboard/orders")
                                ? "bg-orange-500/15 text-orange-400"
                                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                            }`}
                    >
                        Orders
                    </Link>
                    <Link
                        href="/dashboard/payments"
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${pathname.startsWith("/dashboard/payments")
                                ? "bg-orange-500/15 text-orange-400"
                                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                            }`}
                    >
                        Payments
                    </Link>
                    {user?.roleId === 3 && (
                        <Link
                            href="/dashboard/admin"
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${pathname.startsWith("/dashboard/admin")
                                    ? "bg-purple-500/15 text-purple-400"
                                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                                }`}
                        >
                            Admin
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className={`badge border ${roleBadgeColor()}`}>{roleLabel()}</span>
                <span className="text-sm text-gray-400 hidden sm:inline">{user?.email}</span>
                <button
                    id="logout-btn"
                    onClick={logout}
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors font-medium"
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
}
