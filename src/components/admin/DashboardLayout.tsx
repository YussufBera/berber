"use client";

import { useState } from "react";
import { LayoutDashboard, Calendar, Users, Scissors, LogOut, Menu, X, Clock, Briefcase } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/components/features/LanguageContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { t, language, setLanguage } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const NAV_ITEMS = [
        { label: t("admin.nav.dashboard"), href: "/admin/dashboard", icon: LayoutDashboard },
        { label: t("admin.nav.termins"), href: "/admin/termins", icon: Calendar },
        { label: t("admin.nav.barbers"), href: "/admin/barbers", icon: Users },
        { label: t("admin.nav.plan"), href: "/admin/plan", icon: Calendar },
        { label: t("admin.nav.availability"), href: "/admin/availability", icon: Clock },
        { label: t("admin.nav.services"), href: "/admin/services", icon: Scissors },
        { label: t("admin.nav.applications"), href: "/admin/applications", icon: Briefcase },
    ];

    const getPageTitle = (path: string) => {
        const segment = path.split('/').pop();
        switch (segment) {
            case 'dashboard': return t("admin.nav.dashboard");
            case 'termins': return t("admin.nav.termins");
            case 'barbers': return t("admin.nav.barbers");
            case 'plan': return t("admin.nav.plan");
            case 'availability': return t("admin.nav.availability");
            case 'services': return t("admin.nav.services");
            case 'applications': return t("admin.nav.applications");
            default: return segment;
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-screen w-64 bg-[#050505] border-r border-white/10 p-6 flex flex-col z-50 transition-transform duration-300 md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-2xl font-bold tracking-wider">
                        BERBER <span className="text-neon-blue text-xs align-top">ADMIN</span>
                    </h1>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="space-y-2 flex-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
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
                    {t("admin.logout")}
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 w-full">
                <header className="flex justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-400 hover:text-white md:hidden"
                        >
                            <Menu size={28} />
                        </button>
                        <h2 className="text-xl md:text-2xl font-bold capitalize truncate">{getPageTitle(pathname)}</h2>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Compact Language Selector */}
                        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10 hidden sm:flex">
                            {['de', 'en', 'tr', 'ku', 'ar'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang as any)}
                                    className={cn(
                                        "px-2 py-1 rounded text-xs font-bold uppercase transition-all",
                                        language === lang
                                            ? "bg-neon-blue text-black shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                                            : "text-gray-500 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Language Dropdown (Simplified if screen is very small, otherwise rely on the one above or auto-hide) */}
                        {/* Ideally we keep the one above but make it scrollable or compact. For now, the sm:flex hides it on very small screens. Let's make it visible but smaller or scrollable? Or just hide on tiny screens. */}

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="font-bold">Nelio Admin</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neon-purple/20 border border-neon-purple/50 flex-shrink-0" />
                        </div>
                    </div>
                </header>

                <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
