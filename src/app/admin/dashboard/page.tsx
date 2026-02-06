"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import StatsOverview from "@/components/admin/StatsOverview";
import WhatsAppConfirmationModal from "@/components/features/WhatsAppConfirmationModal";
import { Check, X, Clock } from "lucide-react";


import { useLanguage, TRANSLATIONS } from "@/components/features/LanguageContext";

export default function AdminDashboardPage() {
    const { t } = useLanguage();
    const [bookings, setBookings] = useState<any[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // ... (keep fetch logic)
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

    const handleApproveClick = (booking: any) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleConfirmApproval = async (sendWhatsApp: boolean) => {
        if (!selectedBooking) return;

        const id = selectedBooking.id;
        setIsModalOpen(false);

        // Send WhatsApp IMMEDIATELY to avoid popup blockers
        if (sendWhatsApp) {
            // Use customer's preferred language if available, otherwise default to "de"
            // We need to import TRANSLATIONS (referencing it via import) or just assume it is available if we import it
            // Since we can't easily import a non-exported constant if module system is strict/already imported via default
            // I will update the import first.

            // Assume "booking" has preferredLanguage.
            // If TS complains about preferredLanguage not on "any", cast it or just access it.
            const langCode = (selectedBooking.preferredLanguage || "de") as "de" | "en" | "tr" | "ku" | "ar";

            // @ts-ignore - TRANSLATIONS is exported now
            const rawMessage = TRANSLATIONS[langCode]?.["whatsapp.message_template"] || TRANSLATIONS["de"]["whatsapp.message_template"];

            const message = rawMessage
                .replace("{name}", selectedBooking.name)
                .replace("{date}", new Date(selectedBooking.date).toLocaleDateString())
                .replace("{time}", selectedBooking.time)
                .replace("{barber}", selectedBooking.barber || "MAKAS")
                .replace("{total}", selectedBooking.total);

            const cleanPhone = selectedBooking.phone.replace(/\D/g, '');
            window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
        }

        // Optimistic update
        const updatedBookings = bookings.map(b => b.id === id ? { ...b, status: 'approved' } : b);
        setBookings(updatedBookings);

        try {
            await fetch('/api/appointments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'approved' })
            });

            // Reload to sync state (optional, but keeps data fresh)
            window.location.reload();
        } catch (error) {
            console.error("Failed to approve", error);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm(t("admin.btn.delete_confirm"))) return;

        try {
            await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
            window.location.reload();
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
                        {t("admin.dashboard.pending_title")}
                    </h3>

                    {pendingBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <p>{t("admin.dashboard.pending_empty")}</p>
                            <p className="text-xs mt-2">{t("admin.dashboard.pending_subtitle")}</p>
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
                                            onClick={() => handleApproveClick(booking)}
                                            className="flex-1 bg-green-500/10 text-green-400 border border-green-500/20 py-3 rounded-xl text-sm font-bold hover:bg-green-500 hover:text-black hover:border-green-500 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check size={18} /> {t("admin.btn.approve")}
                                        </button>
                                        <button
                                            onClick={() => handleReject(booking.id)}
                                            className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 py-3 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-black hover:border-red-500 transition-all flex items-center justify-center gap-2"
                                        >
                                            <X size={18} /> {t("admin.btn.reject")}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <WhatsAppConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmApproval}
                bookingName={selectedBooking?.name || ""}
            />
        </DashboardLayout >
    );
}
