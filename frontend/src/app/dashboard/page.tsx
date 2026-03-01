"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
    const { user } = useAuth();

    const roleLabel = () => {
        if (!user?.roleId) return "";
        const roles: Record<number, string> = { 1: "Member", 2: "Manager", 3: "Admin" };
        return roles[user.roleId] || "";
    };

    const quickLinks = [
        { title: "Browse Restaurants", desc: "Discover menus and place orders", href: "/dashboard/restaurants", icon: "🍽️" },
        { title: "My Orders", desc: "Track your order history", href: "/dashboard/orders", icon: "📦" },
        { title: "Payment Methods", desc: "Manage your payment options", href: "/dashboard/payments", icon: "💳" },
    ];

    if (user?.roleId === 3) {
        quickLinks.push(
            { title: "Admin Panel", desc: "Manage users, restaurants & orders", href: "/dashboard/admin", icon: "⚙️" }
        );
    }

    return (
        <div className="animate-fade-in-up">
            {/* Welcome banner */}
            <div className="glass-card p-8 mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, <span className="gradient-text">{user?.firstName || user?.email?.split("@")[0]}</span>! 👋
                </h1>
                <p className="text-gray-400">
                    You&apos;re logged in as <span className="font-medium text-gray-300">{roleLabel()}</span>. What would you like to do today?
                </p>
            </div>

            {/* Quick links grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="glass-card p-6 hover:border-orange-500/30 transition-all duration-300 group"
                    >
                        <div className="text-3xl mb-3">{link.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-100 group-hover:text-orange-400 transition-colors">
                            {link.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">{link.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
