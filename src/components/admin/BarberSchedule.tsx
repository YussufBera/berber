"use client";

import { useState, useEffect } from "react";
import { User, Calendar, Clock, DollarSign, Scissors } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Barber } from "@/lib/mockData";

export default function BarberSchedule() {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/barbers').then(res => res.json()),
            fetch('/api/appointments').then(res => res.json())
        ]).then(([barbersData, appointmentsData]) => {
            setBarbers(barbersData);
            setAppointments(appointmentsData);
            if (barbersData.length > 0) {
                setSelectedBarberId(barbersData[0].id);
            }
            setLoading(false);
        }).catch(err => console.error(err));
    }, []);

    const selectedBarber = barbers.find(b => b.id === selectedBarberId);

    // Filter and sort appointments
    const filteredAppointments = appointments
        .filter(app => {
            // Check if appointment is confirmed
            const isConfirmed = app.status === 'approved' || app.status === 'confirmed'; // Handling both likely statuses
            // Check if it belongs to selected barber
            // Note: Appointment 'barber' field is stored as Name currently in API (based on previous edits)
            // But Barber object has 'id'. We need to match by Name since that's what we saved.
            // Ideally we should have saved ID, but we saved Name.
            // Let's try to match by Name.
            const barberName = selectedBarber?.name;
            return isConfirmed && app.barber === barberName;
        })
        .sort((a, b) => {
            // Sort by Date then Time
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (dateA !== dateB) return dateA - dateB;
            return a.time.localeCompare(b.time);
        });

    // Group by Date
    const groupedAppointments: Record<string, any[]> = {};
    filteredAppointments.forEach(app => {
        const dateKey = new Date(app.date).toLocaleDateString();
        if (!groupedAppointments[dateKey]) groupedAppointments[dateKey] = [];
        groupedAppointments[dateKey].push(app);
    });

    return (
        <div className="space-y-6">
            {/* Barber Selector */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="text-neon-blue" />
                    Select Barber
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {barbers.map(barber => (
                        <button
                            key={barber.id}
                            onClick={() => setSelectedBarberId(barber.id)}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl border transition-all min-w-[200px]
                                ${selectedBarberId === barber.id
                                    ? "bg-neon-blue/10 border-neon-blue text-white"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}
                            `}
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                                <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold">{barber.name}</div>
                                <div className="text-xs opacity-70">{barber.specialty}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Schedule View */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 min-h-[400px]">
                {!selectedBarberId ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Please select a barber to view schedule.
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">
                                Schedule: <span className="text-neon-blue">{selectedBarber?.name}</span>
                            </h3>
                            <span className="text-sm text-gray-400">
                                {filteredAppointments.length} Appointments Found
                            </span>
                        </div>

                        {Object.keys(groupedAppointments).length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No confirmed appointments found for this barber.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(groupedAppointments).map(([date, apps]) => (
                                    <div key={date}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-[1px] bg-white/10 flex-1" />
                                            <h4 className="text-neon-purple font-mono font-bold border border-neon-purple/30 px-3 py-1 rounded-full bg-neon-purple/5">
                                                {date}
                                            </h4>
                                            <div className="h-[1px] bg-white/10 flex-1" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {apps.map((app) => (
                                                <motion.div
                                                    key={app.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-white/20 transition-all flex flex-col justify-between"
                                                >
                                                    <div>
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="flex items-center gap-2 text-xl font-bold text-white">
                                                                <Clock size={18} className="text-neon-blue" />
                                                                {app.time}
                                                            </div>
                                                            <div className="flex items-center text-green-400 font-mono text-sm bg-green-900/20 px-2 py-0.5 rounded">
                                                                <DollarSign size={12} />
                                                                {app.total}
                                                            </div>
                                                        </div>

                                                        <div className="mb-2">
                                                            <p className="text-white font-medium text-lg">{app.name}</p>
                                                            <p className="text-gray-500 text-xs">{app.phone}</p>
                                                        </div>

                                                        <div className="text-sm text-gray-400 mt-2 pt-2 border-t border-white/5 flex items-start gap-2">
                                                            <Scissors size={14} className="mt-0.5 shrink-0" />
                                                            <span className="line-clamp-2">{app.services}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
