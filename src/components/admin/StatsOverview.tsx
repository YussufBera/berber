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

export default function StatsOverview() {
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/appointments');
                if (res.ok) {
                    const data = await res.json();
                    setBookings(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        }
        fetchStats();
    }, []);

    // Filter only approved bookings for stats
    const approvedBookings = bookings.filter((b: any) => b.status === 'approved');
    const pendingBookings = bookings.filter((b: any) => b.status === 'pending');

    // Calculate Stats based on approved bookings
    const totalRevenue = approvedBookings.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0);
    const totalAppointments = approvedBookings.length;
    const totalPending = pendingBookings.length;

    const stats = [
        {
            icon: "euro",
            label: "GESAMTEINNAHMEN",
            value: `€${totalRevenue}`
        },
        {
            icon: "calendar",
            label: "BESTÄTIGTE TERMINE",
            value: totalAppointments.toString()
        },
        {
            icon: "clock",
            label: "ONAY BEKLEYENLER",
            value: totalPending.toString()
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
                const Icon = iconMap[stat.icon];
                const colorClass = colorMap[stat.icon];

                return (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-2xl bg-[#111] border border-white/5 relative overflow-hidden group"
                    >
                        {/* Background Glow */}
                        <div className={cn("absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20",
                            stat.icon === 'euro' ? 'bg-green-500' : stat.icon === 'calendar' ? 'bg-neon-blue' : 'bg-neon-purple'
                        )} />

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={cn("p-3 rounded-xl border", colorClass)}>
                                <Icon size={24} />
                            </div>
                        </div>

                        <div className="relative z-10">
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
