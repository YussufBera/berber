"use client";

import { useState, useEffect } from "react";
import { Calendar, Users, TrendingUp, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";



const iconMap: any = {
    calendar: Calendar,
    users: Users,
    euro: DollarSign,
    clock: Clock
};

const colorMap: any = {
    calendar: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    users: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    euro: "bg-green-500/10 text-green-500 border-green-500/20",
    clock: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
};

import { useLanguage } from "../features/LanguageContext";

export default function StatsOverview() {
    const { t } = useLanguage();
    const [stats, setStats] = useState({ revenue: 0, appointments: 0, pending: 0 });

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/appointments');
                if (res.ok) {
                    const data = await res.json();
                    const approvedBookings = data.filter((b: any) => b.status === 'approved');
                    const pendingBookings = data.filter((b: any) => b.status === 'pending');

                    const totalRevenue = approvedBookings.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0);
                    const totalAppointments = approvedBookings.length;
                    const totalPending = pendingBookings.length;

                    setStats({
                        revenue: totalRevenue,
                        appointments: totalAppointments,
                        pending: totalPending
                    });
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-neon-purple/10 rounded-xl">
                        <TrendingUp className="text-neon-purple" size={24} />
                    </div>
                </div>
                <h3 className="text-gray-400 text-sm font-medium tracking-wider mb-1">{t("admin.stats.total_revenue")}</h3>
                <p className="text-4xl font-bold text-white">€{stats.revenue}</p>
            </div>

            {/* Appointments */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-neon-blue/10 rounded-xl">
                        <Users className="text-neon-blue" size={24} />
                    </div>
                </div>
                <h3 className="text-gray-400 text-sm font-medium tracking-wider mb-1">{t("admin.stats.confirmed_appointments")}</h3>
                <p className="text-4xl font-bold text-white">{stats.appointments}</p>
            </div>

            {/* Pending */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-500/10 rounded-xl">
                        <Clock className="text-orange-500" size={24} />
                    </div>
                </div>
                <h3 className="text-gray-400 text-sm font-medium tracking-wider mb-1">{t("admin.stats.pending_approvals")}</h3>
                <p className="text-4xl font-bold text-white">{stats.pending}</p>
            </div>
        </div>
    );
}
