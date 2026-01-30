"use client";

import { LayoutDashboard, Calendar, Users, Settings, Scissors, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Termine", href: "/admin/termins", icon: Calendar }, // Replaced Calendar/Settings
    { label: "Dienstleistungen", href: "/admin/services", icon: Scissors },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const getPageTitle = (path: string) => {
        const segment = path.split('/').pop();
        switch (segment) {
            case 'dashboard': return 'Übersicht';
            case 'termins': return 'Termine';
            case 'services': return 'Dienstleistungen';
            case 'customers': return 'Kunden';
            default: return segment;
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-50 bg-[#050505]">
                <h1 className="text-2xl font-bold mb-10 tracking-wider">
                    BERBER <span className="text-neon-blue text-xs align-top">ADMIN</span>
                </h1>

                <nav className="space-y-2 flex-1">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin/dashboard")
                                    ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={() => {
                        document.cookie = "admin_session=; path=/; max-age=0";
                        window.location.href = "/admin/login";
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors mt-auto"
                >
                    <LogOut size={20} />
                    Abmelden
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold capitalize">{getPageTitle(pathname)}</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="font-bold">Makas Admin</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-neon-purple/20 border border-neon-purple/50" />
                    </div>
                </header>

                <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
