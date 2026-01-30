"use client";

import { useStorage } from "@/hooks/useStorage";
import { Euro, Calendar, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";



const iconMap: Record<string, any> = {
    euro: Euro,
    calendar: Calendar,
    users: Users,
};

const colorMap: Record<string, string> = {
    euro: "text-green-400 bg-green-400/10 border-green-400/20",
    calendar: "text-neon-blue bg-neon-blue/10 border-neon-blue/20",
    users: "text-neon-purple bg-neon-purple/10 border-neon-purple/20",
};

export default function StatsOverview() {
    const [bookings] = useStorage<any[]>('barber_bookings', []);

    // Calculate Stats
    const totalRevenue = bookings.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0);
    const totalAppointments = bookings.length;
    // Count unique customers by email or phone
    const uniqueCustomers = new Set(bookings.map((b: any) => b.email || b.phone)).size;

    const stats = [
        {
            icon: "euro",
            label: "GESAMTEINNAHMEN",
            value: `€${totalRevenue}`,
            change: "+12%" // Mock growth for now
        },
        {
            icon: "calendar",
            label: "TERMINE",
            value: totalAppointments.toString(),
            change: "+5%"
        },
        {
            icon: "users",
            label: "KUNDEN",
            value: uniqueCustomers.toString(),
            change: "+8%"
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
                            <div className="flex items-center gap-1 text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                                <TrendingUp size={12} />
                                {stat.change}
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
