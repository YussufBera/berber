"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import StatsOverview from "@/components/admin/StatsOverview";
import { Check, X, Clock } from "lucide-react";


export default function AdminDashboardPage() {
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        async function fetchBookings() {
            try {
                const res = await fetch('/api/appointments');
                if (res.ok) {
                    const data = await res.json();
                    setBookings(data);
                }
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            }
        }
        fetchBookings();
    }, []);

    const handleApprove = async (id: string) => {
        // Optimistic UI update
        const updatedBookings = bookings.map(b => b.id === id ? { ...b, status: 'approved' } : b);
        setBookings(updatedBookings);

        try {
            await fetch('/api/appointments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'approved' })
            });
        } catch (error) {
            console.error("Failed to approve", error);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Termin wirklich ablehnen und löschen?")) return;

        // Optimistic UI update (Remove from list)
        setBookings(prev => prev.filter(b => b.id !== id));

        try {
            await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const pendingBookings = bookings.filter(b => b.status === 'pending');

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <StatsOverview />



                <div className="bg-[#111] border border-white/5 rounded-2xl p-6 min-h-[600px]">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Clock className="text-neon-blue" size={24} />
                        Ausstehende Anfragen
                    </h3>

                    {pendingBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <p>Keine ausstehenden Termine.</p>
                            <p className="text-xs mt-2">Neue Buchungen erscheinen hier automatisch.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pendingBookings.map((booking) => (
                                <div key={booking.id} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between h-full">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-white font-bold text-lg">{booking.name}</p>
                                                <p className="text-sm text-neon-blue">{booking.services}</p>
                                                <p className="text-xs text-gray-400 mt-1">{booking.phone} / {booking.email}</p>
                                            </div>
                                            <span className="text-neon-purple font-mono font-bold text-xl">€{booking.total}</span>
                                        </div>

                                        <div className="flex gap-2 text-sm text-gray-400 mb-6 bg-black/20 p-2 rounded-lg justify-center">
                                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                                            <span className="text-white/20">|</span>
                                            <span className="text-white font-medium">{booking.time}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-auto">
                                        <button
                                            onClick={() => handleApprove(booking.id)}
                                            className="flex-1 bg-green-500/10 text-green-400 border border-green-500/20 py-3 rounded-xl text-sm font-bold hover:bg-green-500 hover:text-black hover:border-green-500 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check size={18} /> Bestätigen
                                        </button>
                                        <button
                                            onClick={() => handleReject(booking.id)}
                                            className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 py-3 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-black hover:border-red-500 transition-all flex items-center justify-center gap-2"
                                        >
                                            <X size={18} /> Ablehnen
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
