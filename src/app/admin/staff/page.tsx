"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import BarberSchedule from "@/components/admin/BarberSchedule";

export default function StaffPortal() {
    const [barberId, setBarberId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Extract cookie safely
        const match = document.cookie.match(new RegExp('(^| )staff_barber_id=([^;]+)'));
        if (match) {
            setBarberId(match[2]);
        } else {
            router.push('/admin/login');
        }
    }, [router]);

    const handleLogout = () => {
        document.cookie = "staff_session=; path=/; max-age=0";
        document.cookie = "staff_barber_id=; path=/; max-age=0";
        router.push("/admin/login");
    };

    if (!barberId) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <header className="bg-[#111] border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
                <h1 className="text-xl font-bold tracking-widest text-white flex items-center gap-2">
                    NELIO <span className="bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded text-xs">ÇALIŞAN PORTALI</span>
                </h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-white/5 text-gray-300 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-colors text-sm font-bold"
                >
                    <LogOut size={16} />
                    Çıkış Yap
                </button>
            </header>

            <main className="flex-1 p-4 md:p-8 w-full max-w-6xl mx-auto">
                <BarberSchedule fixedBarberId={barberId} />
            </main>
        </div>
    );
}
